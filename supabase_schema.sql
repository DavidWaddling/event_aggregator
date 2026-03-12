-- Create the events table
CREATE TABLE IF NOT EXISTS public.events (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    location TEXT,
    date TEXT,
    price TEXT,
    category TEXT,
    image_url TEXT,
    description TEXT,
    source_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) for events
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Allow public read access to events
CREATE POLICY "Allow public read access" ON public.events
    FOR SELECT USING (true);

-- Allow all access for now (to simplify scraper sync)
CREATE POLICY "Allow all access" ON public.events
    FOR ALL USING (true) WITH CHECK (true);

-- Create simple saved_events table for later
CREATE TABLE IF NOT EXISTS public.saved_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    event_id TEXT REFERENCES public.events(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, event_id)
);

-- Enable RLS for saved_events
ALTER TABLE public.saved_events ENABLE ROW LEVEL SECURITY;

-- Users can only see/edit their own saved events
CREATE POLICY "Users can view their own saved events" ON public.saved_events
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved events" ON public.saved_events
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved events" ON public.saved_events
    FOR DELETE USING (auth.uid() = user_id);
