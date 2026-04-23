-- This creates the table
create table saved_articles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null unique, -- 'unique' is required for the upsert to work!
  articles jsonb default '[]'::jsonb,
  updated_at timestamp with time zone default now()
);

-- This enables security so users can't see each other's news
alter table saved_articles enable row level security;

-- This allows the logged-in user to do everything to their own row
create policy "Users can manage their own saved articles"
  on saved_articles for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);