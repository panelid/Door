-- Create paste history table for version control
CREATE TABLE IF NOT EXISTS paste_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug_id UUID NOT NULL REFERENCES slugs(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  edited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  edit_token VARCHAR(255), -- Token for anonymous edits
  CONSTRAINT slug_reference FOREIGN KEY (slug_id) REFERENCES slugs(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE paste_history ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read paste history
CREATE POLICY "paste_history_select_all" ON paste_history
  FOR SELECT USING (true);

-- Allow logged-in users to create history entries for their own slugs
CREATE POLICY "paste_history_insert_own" ON paste_history
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM slugs
      WHERE slugs.id = paste_history.slug_id
      AND slugs.user_id = auth.uid()
    )
  );

-- Allow anonymous edits via token
CREATE POLICY "paste_history_insert_anonymous" ON paste_history
  FOR INSERT WITH CHECK (true);

-- Add edit_token column to slugs table
ALTER TABLE slugs ADD COLUMN IF NOT EXISTS edit_token VARCHAR(255) UNIQUE;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_paste_history_slug_id ON paste_history(slug_id);
CREATE INDEX IF NOT EXISTS idx_paste_history_created_at ON paste_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_slugs_edit_token ON slugs(edit_token);
