-- ── SUPABASE DATABASE SCHEMA ──────────────────────────────────────────────────
-- Migrate from localStorage to PostgreSQL with Row Level Security (RLS)

-- 1. CV PROFILES TABLE (Stores candidate resume profile data as a flexible JSONB)
CREATE TABLE IF NOT EXISTS public.cv_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    profile_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable RLS for cv_profiles
ALTER TABLE public.cv_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for cv_profiles
CREATE POLICY "Users can view their own profile data" 
    ON public.cv_profiles 
    FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Users can insert/update their own profile data" 
    ON public.cv_profiles 
    FOR ALL 
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);


-- 2. CANDIDATURES TABLE (Stores CRM job tracking applications)
CREATE TABLE IF NOT EXISTS public.candidatures (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    poste TEXT NOT NULL,
    entreprise TEXT NOT NULL,
    statut TEXT NOT NULL DEFAULT 'Draft',
    lieu TEXT DEFAULT '',
    link TEXT DEFAULT '',
    description TEXT DEFAULT '',
    date TEXT DEFAULT '',
    contact_name TEXT DEFAULT '',
    contact_email TEXT DEFAULT '',
    score_ats INTEGER DEFAULT NULL,
    lettre_generee TEXT DEFAULT '',
    objet_lettre_generee TEXT DEFAULT '',
    notes TEXT DEFAULT '',
    reminders JSONB DEFAULT '[]'::jsonb,
    workflow JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable RLS for candidatures
ALTER TABLE public.candidatures ENABLE ROW LEVEL SECURITY;

-- RLS Policies for candidatures
CREATE POLICY "Users can view their own candidatures" 
    ON public.candidatures 
    FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert/update/delete their own candidatures" 
    ON public.candidatures 
    FOR ALL 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Create performance indexes for querying
CREATE INDEX IF NOT EXISTS idx_candidatures_user_id ON public.candidatures(user_id);
CREATE INDEX IF NOT EXISTS idx_candidatures_statut ON public.candidatures(statut);
