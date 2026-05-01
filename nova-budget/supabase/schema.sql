-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  avatar_url text,
  accent_color text default 'gold' check (accent_color in ('gold', 'blue', 'emerald')),
  currency text default 'USD',
  updated_at timestamptz default now()
);

-- Transactions
create table transactions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade not null,
  amount numeric(12,2) not null,
  category text not null,
  description text,
  type text not null check (type in ('income', 'expense')),
  created_at timestamptz default now()
);

-- Budgets
create table budgets (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade not null,
  category text not null,
  limit_amount numeric(12,2) not null,
  spent_amount numeric(12,2) default 0,
  period text default 'monthly' check (period in ('monthly', 'weekly')),
  unique (user_id, category, period)
);

-- Savings Goals
create table savings_goals (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade not null,
  name text not null,
  target_amount numeric(12,2) not null,
  current_amount numeric(12,2) default 0,
  deadline date,
  created_at timestamptz default now()
);

-- Row Level Security
alter table profiles enable row level security;
alter table transactions enable row level security;
alter table budgets enable row level security;
alter table savings_goals enable row level security;

create policy "Users own their profile" on profiles for all using (auth.uid() = id);
create policy "Users own their transactions" on transactions for all using (auth.uid() = user_id);
create policy "Users own their budgets" on budgets for all using (auth.uid() = user_id);
create policy "Users own their goals" on savings_goals for all using (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();
