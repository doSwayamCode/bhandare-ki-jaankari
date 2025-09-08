-- Supabase setup for bhandara finder

-- Create storage bucket for bhandara images (only if it doesn't exist)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('bhandara-images', 'bhandara-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create policy to allow public uploads to bhandara-images bucket (only if it doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' AND policyname = 'Public uploads'
    ) THEN
        CREATE POLICY "Public uploads" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'bhandara-images');
    END IF;
END $$;

-- Create policy to allow public access to bhandara-images (only if it doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' AND policyname = 'Public access'
    ) THEN
        CREATE POLICY "Public access" ON storage.objects FOR SELECT USING (bucket_id = 'bhandara-images');
    END IF;
END $$;

-- Create bhandara table (only if it doesn't exist)
CREATE TABLE IF NOT EXISTS bhandara (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  location_link TEXT NOT NULL,
  nearby_landmark TEXT,
  photo_urls TEXT[] NOT NULL,
  menu TEXT,
  location_description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  user_id TEXT,
  user_name TEXT,
  upvotes INTEGER DEFAULT 0
);

-- Enable RLS (Row Level Security) - only if not already enabled
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'bhandara' AND rowsecurity = true) THEN
        ALTER TABLE bhandara ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Create policies for bhandara table (only if they don't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'bhandara' AND policyname = 'Everyone can view bhandara') THEN
        CREATE POLICY "Everyone can view bhandara" ON bhandara FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'bhandara' AND policyname = 'Authenticated users can insert bhandara') THEN
        CREATE POLICY "Authenticated users can insert bhandara" ON bhandara FOR INSERT WITH CHECK (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'bhandara' AND policyname = 'Users can update their own bhandara') THEN
        CREATE POLICY "Users can update their own bhandara" ON bhandara FOR UPDATE USING (true);
    END IF;
END $$;

-- Create index for better performance (only if they don't exist)
CREATE INDEX IF NOT EXISTS idx_bhandara_expires_at ON bhandara(expires_at);
CREATE INDEX IF NOT EXISTS idx_bhandara_created_at ON bhandara(created_at DESC);

-- Create function to auto-delete expired bhandara (runs daily) - replace if exists
CREATE OR REPLACE FUNCTION delete_expired_bhandara()
RETURNS void AS $$
BEGIN
  DELETE FROM bhandara WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Create bhandara_votes table for tracking votes (only if it doesn't exist)
CREATE TABLE IF NOT EXISTS bhandara_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bhandara_id UUID NOT NULL REFERENCES bhandara(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(bhandara_id, user_id)
);

-- Enable RLS for votes table
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'bhandara_votes' AND rowsecurity = true) THEN
        ALTER TABLE bhandara_votes ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Create policies for bhandara_votes table
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'bhandara_votes' AND policyname = 'Users can view all votes') THEN
        CREATE POLICY "Users can view all votes" ON bhandara_votes FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'bhandara_votes' AND policyname = 'Authenticated users can insert votes') THEN
        CREATE POLICY "Authenticated users can insert votes" ON bhandara_votes FOR INSERT WITH CHECK (true);
    END IF;
END $$;

-- Create index for better performance on votes
CREATE INDEX IF NOT EXISTS idx_bhandara_votes_bhandara_id ON bhandara_votes(bhandara_id);
CREATE INDEX IF NOT EXISTS idx_bhandara_votes_user_id ON bhandara_votes(user_id);