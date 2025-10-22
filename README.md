# 🎯 AI 행동 심리학 코칭 서비스

**말이 아닌 행동으로 상황을 바꾸는 AI 코치**

실전에서 바로 사용할 수 있는 구체적인 행동 전략을 제시하는 AI 서비스입니다.

---

## ✨ 주요 기능

- 🎭 **행동 중심 전략**: 말이 아닌 몸짓, 표정, 타이밍 등 구체적 행동 제시
- 🧠 **심리학적 분석**: 왜 이 행동이 효과적인지 과학적 근거 제공
- 📊 **3단계 전략**: 부드러운 → 중간 → 강력한 대응 선택지
- 🔍 **벡터 검색**: 유사한 상황을 학습하여 더 나은 답변 제공
- 💎 **티어 시스템**: 무료 (3회/일) → 프리미엄 → VIP

---

## 🚀 빠른 시작

### 1. 프로젝트 클론 및 설치

```bash
# 의존성 설치
cd behavior-coach
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 값들을 설정하세요:

```env
# Google Gemini API Key (완전 무료!)
GEMINI_API_KEY=your-gemini-api-key

# Google AdSense (선택사항)
NEXT_PUBLIC_GOOGLE_ADSENSE_ID=ca-pub-YOUR_PUBLISHER_ID
```

#### 🎉 Gemini API 키 받기 (5분, 무료!)

1. [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey) 방문
2. Google 계정으로 로그인
3. "Create API key" 클릭
4. 키 복사해서 `.env.local`에 붙여넣기

**무료 제한**: 하루 1,500회 (테스트 및 초기 론칭에 완벽!)

자세한 가이드: [GEMINI_SETUP.md](GEMINI_SETUP.md)

### 3. Supabase 설정

1. [Supabase](https://supabase.com) 계정 생성
2. 새 프로젝트 생성
3. SQL Editor에서 `supabase-schema.sql` 실행
4. API Keys를 `.env.local`에 복사

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 열기

---

## 📁 프로젝트 구조

```
behavior-coach/
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts          # AI 분석 API 엔드포인트
│   ├── layout.tsx                # 루트 레이아웃
│   ├── page.tsx                  # 메인 페이지 (UI)
│   └── globals.css               # 글로벌 스타일
├── lib/
│   ├── embeddings.ts             # OpenAI 임베딩 생성
│   └── supabase.ts               # Supabase 벡터 DB 연결
├── supabase-schema.sql           # DB 스키마
├── .env.local                    # 환경 변수 (생성 필요)
└── package.json
```

---

## 🔧 기술 스택

### Frontend
- **Next.js 15** - React 프레임워크
- **TypeScript** - 타입 안정성
- **Tailwind CSS** - 스타일링
- **React Markdown** - 마크다운 렌더링

### Backend
- **Next.js API Routes** - 서버리스 API
- **OpenAI API** - AI 분석 및 임베딩
- **Supabase** - PostgreSQL + pgvector (벡터 DB)

### AI 시스템
- **GPT-4o-mini** - 빠르고 저렴한 AI 모델
- **text-embedding-3-small** - 벡터 임베딩 생성
- **벡터 검색** - 유사 상황 기반 답변 개선

---

## 💡 작동 원리

### 1. 사용자 입력
사용자가 상황을 입력합니다.
```
"데이트 중인데 상대가 핸드폰만 봐요"
```

### 2. 벡터 임베딩 생성
OpenAI API로 텍스트를 벡터로 변환합니다.

### 3. 유사 상황 검색
Supabase Vector DB에서 코사인 유사도로 유사 상황을 검색합니다.

### 4. AI 분석
GPT-4o-mini가 다음을 생성합니다:
- 📊 상황 분석
- 🎯 목표 설정
- ⚡ 3단계 행동 전략
- 🧠 심리학적 배경
- ⚠️ 주의사항
- 💡 추가 팁

### 5. DB 저장
분석 결과를 벡터 DB에 저장하여 다음 사용자에게 활용합니다.

---

## 🎨 프롬프트 시스템

핵심 프롬프트는 다음을 강조합니다:

1. **행동 중심**: 말이 아닌 구체적 행동
2. **단계별 스크립트**: "이렇게 서라", "이때 이렇게 해라"
3. **심리 분석**: 왜 효과적인지 설명
4. **다단계 전략**: 부드러운 → 중간 → 강력한
5. **타이밍 명시**: "즉시", "1분 후", "5분 후"
6. **결과 예측**: 각 선택의 예상 결과

---

## 💰 수익 모델

### 무료 티어
- 1일 3회 분석
- 기본 행동 전략

### 프리미엄 (월 29,900원)
- 무제한 분석
- 비디오 가이드
- 시뮬레이션
- 히스토리 저장

### VIP (월 99,000원)
- 프리미엄 모든 기능
- 1:1 영상 코칭
- 실전 피드백
- 우선 지원

---

## 📊 비용 분석

### OpenAI API 비용
- **GPT-4o-mini**: $0.150 / 1M input tokens, $0.600 / 1M output tokens
- **평균 분석**: ~1,000 input + 1,500 output tokens = $0.0011 / 분석
- **text-embedding-3-small**: $0.020 / 1M tokens = ~$0.00002 / 임베딩

### 예상 수익 (월 기준)
- 프리미엄 가입자 1,000명: **2,990만원**
- VIP 가입자 100명: **990만원**
- 무료 사용자 10,000명 분석 비용: ~**15만원**
- **순수익**: 약 **3,800만원/월**

---

## 🚀 배포

### Vercel 배포 (권장)

```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel

# 환경 변수 설정
vercel env add OPENAI_API_KEY
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
```

---

## 📈 향후 개선 사항

- [ ] 사용자 인증 시스템 (Supabase Auth)
- [ ] 결제 시스템 (Stripe)
- [ ] 비디오 가이드 생성
- [ ] 시뮬레이션 기능
- [ ] 히스토리 저장
- [ ] 카테고리별 필터링
- [ ] 평가 시스템 (좋아요/싫어요)
- [ ] 공유 기능
- [ ] 모바일 앱 (React Native)

---

## 🤝 기여

이 프로젝트는 오픈소스입니다. 기여를 환영합니다!

---

## 📄 라이선스

MIT License

---

## 💬 문의

문제가 있거나 질문이 있으시면 이슈를 생성해주세요.

---

**만든이**: AI Behavior Coach Team
**버전**: 0.1.0 (MVP)
**날짜**: 2025-01-22
