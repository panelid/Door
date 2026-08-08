
-- Custom Domains table for Supabase (PostgreSQL)
CREATE TABLE IF NOT EXISTS custom_domains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    domain TEXT NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token TEXT NOT NULL,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, domain)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_custom_domains_user ON custom_domains(user_id);
CREATE INDEX IF NOT EXISTS idx_custom_domains_domain ON custom_domains(domain);

-- RLS Policies
ALTER TABLE custom_domains ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own custom domains"
ON custom_domains FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own custom domains"
ON custom_domains FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own custom domains"
ON custom_domains FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own custom domains"
ON custom_domains FOR DELETE
USING (auth.uid() = user_id);
