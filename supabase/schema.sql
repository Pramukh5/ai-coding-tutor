-- Create the lessons table
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  initial_code TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create the user_progress table
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE NOT NULL,
  code TEXT,
  completed BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- Enable Row-Level Security for the tables
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Create policies for lessons
CREATE POLICY "Users can read lessons" ON lessons
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create policies for user_progress
CREATE POLICY "Users can manage their own progress" ON user_progress
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Enable the pgvector extension
create extension if not exists vector with schema public;

-- Create a table to store lesson sections and their embeddings
create table
  public.lesson_sections (
    id bigserial primary key,
    lesson_id uuid references public.lessons on delete cascade,
    content text,
    embedding vector(384) -- Corresponds to the embedding model's dimensions
  );

-- Create a function to search for relevant lesson sections
create or replace function match_lesson_sections(query_embedding vector(384), match_threshold float, match_count int)
returns table (id bigint, lesson_id uuid, content text, similarity float)
as $$
select
  lesson_sections.id,
  lesson_sections.lesson_id,
  lesson_sections.content,
  1 - (lesson_sections.embedding <=> query_embedding) as similarity
from lesson_sections
where 1 - (lesson_sections.embedding <=> query_embedding) > match_threshold
order by similarity desc
limit match_count;
$$ language sql stable;
