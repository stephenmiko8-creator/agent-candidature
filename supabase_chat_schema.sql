-- ── SUPABASE CHAT TABLES SCHEMA ──────────────────────────────────────────────
-- Database tables to store real-time candidate-recruiter messaging

-- 1. CANDIDATE CONVERSATIONS TABLE
CREATE TABLE IF NOT EXISTS public.candidate_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    candidature_id TEXT REFERENCES public.candidatures(id) ON DELETE SET NULL,
    subject TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'Application',
    status TEXT NOT NULL DEFAULT 'New',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable RLS for candidate_conversations
ALTER TABLE public.candidate_conversations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for candidate_conversations
CREATE POLICY "Users can view their own conversations"
    ON public.candidate_conversations
    FOR SELECT
    USING (auth.uid() = candidate_id OR auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert/update their own conversations"
    ON public.candidate_conversations
    FOR ALL
    USING (auth.uid() = candidate_id OR auth.uid() IS NOT NULL)
    WITH CHECK (auth.uid() = candidate_id OR auth.uid() IS NOT NULL);


-- 2. CONVERSATION MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.conversation_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.candidate_conversations(id) ON DELETE CASCADE,
    sender TEXT NOT NULL CHECK (sender IN ('candidate', 'recruiter')),
    text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable RLS for conversation_messages
ALTER TABLE public.conversation_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for conversation_messages
CREATE POLICY "Users can view messages of their conversations"
    ON public.conversation_messages
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.candidate_conversations c
            WHERE c.id = conversation_id
            AND (c.candidate_id = auth.uid() OR auth.uid() IS NOT NULL)
        )
    );

CREATE POLICY "Users can insert messages to their conversations"
    ON public.conversation_messages
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.candidate_conversations c
            WHERE c.id = conversation_id
            AND (c.candidate_id = auth.uid() OR auth.uid() IS NOT NULL)
        )
    );

-- Enable Realtime for the tables to support live chat
alter publication supabase_realtime add table public.candidate_conversations;
alter publication supabase_realtime add table public.conversation_messages;
