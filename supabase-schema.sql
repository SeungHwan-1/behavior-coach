-- Supabase 벡터 DB 스키마
-- 이 SQL을 Supabase SQL Editor에서 실행하세요

-- 1. pgvector 확장 활성화
create extension if not exists vector;

-- 2. situations 테이블 생성
create table if not exists public.situations (
  id bigserial primary key,
  situation text not null,
  embedding vector(1536), -- OpenAI text-embedding-3-small의 차원
  category text not null,
  analysis text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  usage_count integer default 0
);

-- 3. 인덱스 생성 (벡터 검색 성능 향상)
create index on public.situations using ivfflat (embedding vector_cosine_ops)
with (lists = 100);

-- 4. 카테고리별 인덱스
create index idx_situations_category on public.situations(category);
create index idx_situations_created_at on public.situations(created_at desc);

-- 5. 벡터 유사도 검색 함수
create or replace function match_situations(
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (
  id bigint,
  situation text,
  category text,
  analysis text,
  similarity float
)
language sql stable
as $$
  select
    situations.id,
    situations.situation,
    situations.category,
    situations.analysis,
    1 - (situations.embedding <=> query_embedding) as similarity
  from situations
  where 1 - (situations.embedding <=> query_embedding) > match_threshold
  order by similarity desc
  limit match_count;
$$;

-- 6. RLS (Row Level Security) 설정
alter table public.situations enable row level security;

-- 모든 사용자가 읽을 수 있음
create policy "Anyone can read situations"
  on public.situations for select
  using (true);

-- 인증된 사용자만 삽입 가능 (또는 service_role)
create policy "Authenticated users can insert situations"
  on public.situations for insert
  with check (true);

-- 7. 사용 횟수 업데이트 함수
create or replace function increment_usage_count(situation_id bigint)
returns void
language sql
as $$
  update public.situations
  set usage_count = usage_count + 1
  where id = situation_id;
$$;

-- 8. 초기 샘플 데이터 (선택사항)
-- 실제 서비스에서는 사용자 데이터가 쌓이면서 자동으로 채워집니다
