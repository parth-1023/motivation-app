CREATE TABLE public.reels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  video_url TEXT NOT NULL,
  cloudinary_public_id TEXT,
  name TEXT,
  visible BOOLEAN NOT NULL DEFAULT true,
  position INTEGER NOT NULL DEFAULT 0
);

-- Enable Row Level Security
ALTER TABLE public.reels ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (currently allows anyone to CRUD)
CREATE POLICY "Anyone can view reels" ON public.reels FOR SELECT USING (true);
CREATE POLICY "Anyone can add reels" ON public.reels FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update reels" ON public.reels FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete reels" ON public.reels FOR DELETE USING (true);
