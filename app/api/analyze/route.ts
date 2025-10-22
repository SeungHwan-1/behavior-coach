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

export async function POST(request: NextRequest) {
  try {
    const { situation } = await request.json();

    if (!situation || situation.trim().length === 0) {
      return NextResponse.json(
        { error: '상황을 입력해주세요' },
        { status: 400 }
      );
    }

    // 프롬프트 생성
    const fullPrompt = `${SYSTEM_PROMPT}\n\n다음 상황에 대한 구체적인 행동 전략을 제시해주세요:\n\n${situation}`;

    // Gemini API 호출 (새로운 방식)
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: fullPrompt,
    });

    const analysis = response.text;

    // 상황 분류
    const category = categorize(situation);

    return NextResponse.json({
      analysis,
      category,
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

// 간단한 카테고리 분류 함수
function categorize(situation: string): string {
  const workplace = ['회의', '직장', '상사', '동료', '업무', '협상', '연봉'];
  const relationship = ['데이트', '연애', '썸', '애인', '남자친구', '여자친구', '만남'];
  const social = ['친구', '가족', '지인', '모임', '대화'];

  const lower = situation.toLowerCase();

  if (workplace.some(keyword => lower.includes(keyword))) return 'workplace';
  if (relationship.some(keyword => lower.includes(keyword))) return 'relationship';
  if (social.some(keyword => lower.includes(keyword))) return 'social';

  return 'general';
}
