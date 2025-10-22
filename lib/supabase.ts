import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// 서버용 클라이언트 (Service Role Key)
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// 벡터 검색 함수
export async function searchSimilarSituations(embedding: number[], limit = 3) {
  const { data, error } = await supabaseAdmin.rpc('match_situations', {
    query_embedding: embedding,
    match_threshold: 0.7,
    match_count: limit,
  });

  if (error) {
    console.error('벡터 검색 오류:', error);
    return [];
  }

  return data;
}

// 새로운 상황 저장
export async function saveSituation(
  situation: string,
  embedding: number[],
  category: string,
  analysis: string
) {
  const { data, error } = await supabaseAdmin.from('situations').insert({
    situation,
    embedding,
    category,
    analysis,
    created_at: new Date().toISOString(),
  });

  if (error) {
    console.error('상황 저장 오류:', error);
  }

  return data;
}
