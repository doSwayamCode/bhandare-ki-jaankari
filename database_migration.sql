-- Migration to add upvotes column and ensure user_id exists
-- Run this in your Supabase SQL editor

-- Add upvotes column if it doesn't exist
ALTER TABLE bhandaras ADD COLUMN IF NOT EXISTS upvotes INTEGER DEFAULT 0;

-- Add user_id column if it doesn't exist (should already exist)
ALTER TABLE bhandaras ADD COLUMN IF NOT EXISTS user_id TEXT;

-- Add user_name column if it doesn't exist (should already exist) 
ALTER TABLE bhandaras ADD COLUMN IF NOT EXISTS user_name TEXT;

-- Update existing records to have upvotes = 0 if NULL
UPDATE bhandaras SET upvotes = 0 WHERE upvotes IS NULL;

-- Add index on upvotes for better performance
CREATE INDEX IF NOT EXISTS idx_bhandaras_upvotes ON bhandaras(upvotes DESC);

-- Add index on user_id for better performance
CREATE INDEX IF NOT EXISTS idx_bhandaras_user_id ON bhandaras(user_id);
