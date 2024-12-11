create table profiles (
  id uuid references auth.users not null primary key,
  registered_at timestamp with time zone default now(),
  email text not null,
  is_admin boolean default false
);

create type project_type as enum ('burn');

create table projects (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  name text not null,
  type project_type not null,
  slug text not null unique,
  check (slug ~ '^[A-Za-z0-9_-]+$'),
  unique (type, slug)
);

create table roles (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  project_id uuid references projects not null,
  name text not null,
  unique (project_id, name)
);

create table role_assignments (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  user_id uuid references profiles not null,
  role_id uuid references roles not null,
  unique (user_id, role_id)
);

create type burn_stage as enum ('lottery-open', 'lottery-closed', 'open-sale');

create type burn_membership_pricing_type as enum ('tiered-3');

create table burn_config (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  project_id uuid references projects not null,
  current_stage burn_stage not null,
  open_sale_starting_at timestamp with time zone, -- this determines the 'reserved_until' field for memberships obtained in the lottery
  open_sale_reservation_duration bigint, -- in seconds, determines how long the user has time to answer the questions and enter payment details
  transfer_reservation_duration bigint, -- in seconds, determines how long the user has time to purchase a membership after a transfer is made
  max_memberships bigint, -- the maximum number of memberships that can be sold in the open sale
  membership_price_currency text not null,
  membership_pricing_type burn_membership_pricing_type not null,
  membership_price_tier_1 float,
  membership_price_tier_2 float,
  membership_price_tier_3 float,
  share_memberships_lottery integer, -- the percentage of memberships that will be reserved for lottery winners (i.e. when the lottery is drawn, max_memberships*share_memberships_lottery/100 will be chosen, max_memberships*share_memberships_low_income/100 of which are low-income)
  share_memberships_low_income integer, -- the percentage of memberships that will be reserved for low-income individuals (tier 1)
  stripe_secret_api_key text,
  stripe_webhook_secret text,
  stripe_membership_price_tier_1_price_id text,
  stripe_membership_price_tier_2_price_id text,
  stripe_membership_price_tier_3_price_id text,
  check (membership_price_currency ~ '^[A-Z]{3}$')
);

create table burn_lottery_tickets (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  project_id uuid references projects not null,
  owner_id uuid references profiles not null,
  first_name text not null,
  last_name text not null,
  birthdate text not null,
  is_low_income boolean default false,
  is_winner boolean default false,
  can_invite_plus_one boolean default false,
  added_to_waitlist_at timestamp with time zone, -- only relevant when no memberships are available in the open sale anymore, needed to determine the order of the waitlist; waiting list and open sale are identical
  unique (project_id, first_name, last_name, birthdate),
  check (birthdate ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$')
);

create table burn_memberships (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  project_id uuid references projects not null,
  owner_id uuid references profiles not null,
  first_name text not null,
  last_name text not null,
  birthdate text not null,
  reserved_until timestamp with time zone,
  reserved_by uuid references profiles, -- irrelevant if reserved_until is null or in the past
  price float,
  paid_at timestamp with time zone, -- only actually valid when this is set
  checked_in_at timestamp with time zone, -- this is set when the user checks in at the event
  unique (project_id, first_name, last_name, birthdate),
  check (birthdate ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$')
);

-- This trigger automatically creates a profile entry when a new user signs up via Supabase Auth.
-- See https://supabase.com/docs/guides/auth/managing-user-data#using-triggers for more details.
create function public.handle_new_user()
returns trigger
set search_path = ''
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- from https://github.com/orgs/supabase/discussions/4547
REVOKE ALL PRIVILEGES ON DATABASE "postgres" FROM "anon";
REVOKE ALL PRIVILEGES ON SCHEMA "public" FROM "anon";
REVOKE ALL PRIVILEGES ON SCHEMA "storage" FROM "anon";
REVOKE ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA "public" FROM "anon";
REVOKE ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA "storage" FROM "anon";
REVOKE ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA "public" FROM "anon";
REVOKE ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA "storage" FROM "anon";
REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA "public" FROM "anon";
REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA "storage" FROM "anon";
REVOKE ALL ON ALL ROUTINES IN SCHEMA public FROM PUBLIC;
