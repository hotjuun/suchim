-- ================================
-- 스침 v2: 코인 & 과금 시스템
-- Supabase SQL Editor에서 실행
-- ================================

-- 1. 사용자 코인 잔액
create table if not exists user_coins (
  user_id uuid references auth.users(id) on delete cascade primary key,
  balance integer default 0 not null check (balance >= 0),
  updated_at timestamptz default now() not null
);

-- 2. 코인 거래 내역
create table if not exists coin_transactions (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now() not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  amount integer not null,
  reason text not null,
  balance_after integer not null
);

-- 3. 일일 사용량 추적
create table if not exists daily_usage (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  action_type text not null,
  date date default current_date not null,
  count integer default 0 not null,
  unique(user_id, action_type, date)
);

-- 4. 힌트 구매 내역
create table if not exists hint_purchases (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now() not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  match_request_id uuid references match_requests(id) on delete cascade not null,
  hint_level integer not null check (hint_level between 1 and 3),
  unique(user_id, match_request_id, hint_level)
);

-- 5. 연락처 교환 내역
create table if not exists contact_exchanges (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now() not null,
  room_id uuid references chat_rooms(id) on delete cascade not null,
  initiated_by uuid references auth.users(id) on delete cascade not null,
  contact_type text not null,
  contact_value text not null
);

-- 인덱스
create index if not exists idx_daily_usage_lookup on daily_usage(user_id, action_type, date);
create index if not exists idx_coin_transactions_user on coin_transactions(user_id, created_at desc);
create index if not exists idx_hint_purchases_user on hint_purchases(user_id, match_request_id);

-- RLS
alter table user_coins enable row level security;
alter table coin_transactions enable row level security;
alter table daily_usage enable row level security;
alter table hint_purchases enable row level security;
alter table contact_exchanges enable row level security;

-- 본인만 접근
create policy "own_coins" on user_coins for all using (auth.uid() = user_id);
create policy "own_transactions" on coin_transactions for all using (auth.uid() = user_id);
create policy "own_usage" on daily_usage for all using (auth.uid() = user_id);
create policy "own_hints" on hint_purchases for all using (auth.uid() = user_id);
create policy "own_exchanges" on contact_exchanges for all using (
  auth.uid() = initiated_by or
  auth.uid() in (
    select user1_id from chat_rooms where id = room_id
    union
    select user2_id from chat_rooms where id = room_id
  )
);

-- 코인 차감 함수
create or replace function spend_coins(p_user_id uuid, p_amount integer, p_reason text)
returns void as $$
declare
  v_balance integer;
begin
  select balance into v_balance from user_coins where user_id = p_user_id for update;
  if v_balance is null then
    raise exception 'No coin balance found';
  end if;
  if v_balance < p_amount then
    raise exception 'Insufficient coins';
  end if;
  update user_coins set balance = balance - p_amount, updated_at = now() where user_id = p_user_id;
  insert into coin_transactions (user_id, amount, reason, balance_after)
  values (p_user_id, -p_amount, p_reason, v_balance - p_amount);
end;
$$ language plpgsql security definer;

-- 코인 충전 함수
create or replace function add_coins(p_user_id uuid, p_amount integer, p_reason text)
returns void as $$
declare
  v_balance integer;
begin
  insert into user_coins (user_id, balance) values (p_user_id, 0)
  on conflict (user_id) do nothing;
  select balance into v_balance from user_coins where user_id = p_user_id for update;
  update user_coins set balance = balance + p_amount, updated_at = now() where user_id = p_user_id;
  insert into coin_transactions (user_id, amount, reason, balance_after)
  values (p_user_id, p_amount, p_reason, v_balance + p_amount);
end;
$$ language plpgsql security definer;

-- 신규 가입 시 초기 코인 지급 트리거
create or replace function handle_new_user_coins()
returns trigger as $$
begin
  insert into user_coins (user_id, balance) values (new.id, 30);
  insert into coin_transactions (user_id, amount, reason, balance_after)
  values (new.id, 30, '가입 축하 코인', 30);
  return new;
end;
$$ language plpgsql security definer;

-- 트리거 (이미 존재하면 무시)
do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'on_auth_user_created_coins') then
    create trigger on_auth_user_created_coins
      after insert on auth.users
      for each row execute function handle_new_user_coins();
  end if;
end;
$$;

-- 일일 사용량 원자적 증가 함수 (race condition 방지)
create or replace function increment_daily_usage(
  p_user_id uuid,
  p_action_type text,
  p_date date
)
returns void as $$
begin
  insert into daily_usage (user_id, action_type, date, count)
  values (p_user_id, p_action_type, p_date, 1)
  on conflict (user_id, action_type, date)
  do update set count = daily_usage.count + 1;
end;
$$ language plpgsql security definer;
