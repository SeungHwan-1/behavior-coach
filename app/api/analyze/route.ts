import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

// Gemini API 초기화
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
});

// 핵심 프롬프트 시스템
const SYSTEM_PROMPT = `당신은 행동 심리학 전문가입니다.
사용자가 겪는 상황을 분석하고, **말이 아닌 구체적인 행동 전략**을 제시합니다.

핵심 원칙:
1. **행동 중심**: 말로 설명하지 말고, 몸짓, 표정, 타이밍, 자세 등 구체적 행동을 제시
2. **단계별 스크립트**: "이렇게 서라", "이렇게 봐라", "이때 이렇게 해라" 같은 명확한 지시
3. **심리 분석**: 왜 이 행동이 효과적인지 심리학적 근거 제시
4. **다단계 전략**: 부드러운 대응 → 중간 대응 → 강력한 대응 (3단계)
5. **타이밍 명시**: "즉시", "1분 후", "5분 후" 등 구체적 시간
6. **결과 예측**: 각 선택의 예상 결과 설명

응답 형식:
📊 상황 분석
[상황 요약 및 핵심 문제 파악]

🎯 목표 설정
[이 상황에서 달성하고자 하는 것]

⚡ 3가지 행동 전략

1️⃣ 부드러운 대응 (관계 유지 중심)
- 즉시 행동: [구체적 행동]
- 말: [필요시 짧은 멘트]
- 타이밍: [언제]
- 기대 효과: [결과 예측]

2️⃣ 중간 대응 (경고 단계)
- 즉시 행동: [구체적 행동]
- 말: [필요시 짧은 멘트]
- 타이밍: [언제]
- 기대 효과: [결과 예측]

3️⃣ 강력한 대응 (존중 요구/관계 정리)
- 즉시 행동: [구체적 행동]
- 말: [필요시 짧은 멘트]
- 타이밍: [언제]
- 기대 효과: [결과 예측]

🧠 심리학적 배경
[왜 이런 행동이 효과적인지 설명]

⚠️ 주의사항
[피해야 할 행동들]

💡 추가 팁
[장기적 관점의 조언]
`;

// 카테고리별 컨텍스트 추가
function getCategoryContext(category: string | null): string {
  switch (category) {
    case 'workplace':
      return `상황 컨텍스트: 직장 환경 (회의, 협상, 갈등)
중요 요소:
- 직업적 관계와 위계 고려
- 장기적 커리어 영향 분석
- 전문성과 감정의 균형
- 조직 내 평판 관리`;

    case 'relationship':
      return `상황 컨텍스트: 연애 관계 (데이트, 썸, 관계)
중요 요소:
- 상대방 감정과 신뢰 구축
- 관계의 단계와 친밀도 고려
- 비언어적 신호의 중요성
- 장기적 관계 발전 가능성`;

    case 'social':
      return `상황 컨텍스트: 대인관계 (친구, 가족, 지인)
중요 요소:
- 관계의 역사와 맥락 이해
- 사회적 규범과 예의
- 상호 존중과 경계 설정
- 감정적 유대 유지`;

    default:
      return `상황 컨텍스트: 일반적 대인관계
중요 요소:
- 상황별 적절한 행동 선택
- 상대방 반응 관찰과 대응
- 관계 유지와 자존감 보호의 균형`;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { situation, category } = await request.json();

    if (!situation || situation.trim().length === 0) {
      return NextResponse.json(
        { error: '상황을 입력해주세요' },
        { status: 400 }
      );
    }

    // 카테고리별 추가 컨텍스트
    const categoryContext = getCategoryContext(category);

    // 프롬프트 생성
    const fullPrompt = `${SYSTEM_PROMPT}\n\n${categoryContext}\n\n다음 상황에 대한 구체적인 행동 전략을 제시해주세요:\n\n${situation}`;

    // Gemini API 호출 (새로운 방식)
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: fullPrompt,
    });

    const analysis = response.text;

    return NextResponse.json({
      analysis,
      category: category || 'general',
      timestamp: new Date().toISOString(),
      provider: 'gemini-2.0',
    });

  } catch (error: any) {
    console.error('AI 분석 오류:', error);

    return NextResponse.json(
      {
        error: '분석 중 오류가 발생했습니다',
        details: error.message,
        apiKey: process.env.GEMINI_API_KEY ? '설정됨' : '설정안됨'
      },
      { status: 500 }
    );
  }
}
