create table saved_articles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  collection_name text default 'Bookmarks',
  -- This column will hold the Array of Article objects
  articles jsonb default '[]'::jsonb,
  updated_at timestamp with time zone default now()
);

-- Enable RLS so users can't see each other's bookmarks
alter table saved_articles enable row level security;

create policy "Users can manage their own saved articles"
  on saved_articles for all
  using (auth.uid() = user_id);