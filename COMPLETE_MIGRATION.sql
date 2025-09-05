-- FINAL SUPABASE MIGRATION - SIMPLIFIED VERSION
-- Copy and paste this entire code block into your Supabase SQL Editor

-- RESET SECTION: Clear all existing upvotes and votes
-- =================================================

-- Reset all upvotes to 0
UPDATE bhandaras SET upvotes = 0;

-- Drop user_votes table if it exists and recreate it
DROP TABLE IF EXISTS user_votes;

-- =================================================

-- Step 1: Add upvotes column if it doesn't exist
ALTER TABLE bhandaras ADD COLUMN IF NOT EXISTS upvotes INTEGER DEFAULT 0;

-- Step 2: Add required columns if they don't exist
ALTER TABLE bhandaras ADD COLUMN IF NOT EXISTS user_id TEXT;
ALTER TABLE bhandaras ADD COLUMN IF NOT EXISTS user_name TEXT;
ALTER TABLE bhandaras ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Step 3: Update existing records
UPDATE bhandaras SET upvotes = 0 WHERE upvotes IS NULL;
UPDATE bhandaras SET created_at = NOW() WHERE created_at IS NULL;

-- Step 4: Create user_votes table for one-time voting
CREATE TABLE user_votes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    bhandara_id BIGINT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, bhandara_id)
);

-- Step 5: Add foreign key constraint
ALTER TABLE user_votes 
ADD CONSTRAINT fk_user_votes_bhandara 
FOREIGN KEY (bhandara_id) REFERENCES bhandaras(id) ON DELETE CASCADE;

-- Step 6: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bhandaras_upvotes ON bhandaras(upvotes DESC);
CREATE INDEX IF NOT EXISTS idx_user_votes_user_id ON user_votes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_votes_bhandara_id ON user_votes(bhandara_id);
CREATE INDEX IF NOT EXISTS idx_user_votes_composite ON user_votes(user_id, bhandara_id);

-- Step 7: Verify table structures
SELECT 'bhandaras table columns:' as info;
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'bhandaras' 
ORDER BY ordinal_position;

SELECT 'user_votes table columns:' as info;
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'user_votes' 
ORDER BY ordinal_position;
