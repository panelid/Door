-- Add password field to slugs table for paste type links
ALTER TABLE slugs ADD COLUMN IF NOT EXISTS paste_password VARCHAR(255) DEFAULT NULL;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_slugs_slug_type ON slugs(slug, type);
