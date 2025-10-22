'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import GoogleAd from '@/components/GoogleAd';

type Category = 'workplace' | 'relationship' | 'social' | null;

export default function Home() {
  const [situation, setSituation] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [usageCount, setUsageCount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<Category>(null);

  const categories = [
    { id: 'workplace' as Category, name: '직장', desc: '회의, 협상, 갈등' },
    { id: 'relationship' as Category, name: '연애', desc: '데이트, 썸, 관계' },
    { id: 'social' as Category, name: '대인관계', desc: '친구, 가족, 지인' },
  ];

  const analyze = async () => {
    if (!situation.trim()) {
      alert('상황을 입력해주세요');
      return;
    }

    if (usageCount >= 3) {
      alert('오늘의 무료 분석 횟수를 모두 사용했습니다. 프리미엄으로 업그레이드하세요!');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ situation }),
      });

      const data = await response.json();
      setResult(data);
      setUsageCount(prev => prev + 1);
    } catch (error) {
      console.error('분석 실패:', error);
      alert('분석 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* 헤더 */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
            AI 행동 심리학 코칭
          </h1>
          <p className="text-xl text-gray-300">
            말이 아닌 <span className="font-bold text-purple-400">행동</span>으로 상황을 바꾸세요
          </p>
          <div className="mt-4 inline-block bg-gray-800/50 backdrop-blur-sm px-6 py-2 rounded-full border border-purple-500/30">
            <span className="text-sm text-gray-300">
              무료 분석 <span className="font-bold text-purple-400">{3 - usageCount}/3</span>
            </span>
          </div>
        </header>

        {/* 상단 광고 배너 */}
        <div className="mb-8">
          <GoogleAd
            slot="1234567890"
            format="horizontal"
            className="rounded-xl overflow-hidden"
          />
        </div>

        {/* 카테고리 선택 */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-3 text-gray-300">
            카테고리 선택
          </label>
          <div className="grid grid-cols-3 gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-purple-600/20 border-purple-500 shadow-lg shadow-purple-500/30'
                    : 'bg-gray-800/30 border-gray-700 hover:border-purple-500/50'
                }`}
              >
                <div className="font-bold text-gray-100 mb-1">{cat.name}</div>
                <div className="text-xs text-gray-400">{cat.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 입력 영역 */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 mb-8 border border-purple-500/20">
          <label className="block text-lg font-semibold mb-3 text-gray-200">
            상황 설명
          </label>
          <textarea
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            placeholder="상황을 구체적으로 설명해주세요.&#10;&#10;예시:&#10;- 데이트 중인데 상대가 계속 핸드폰만 봅니다&#10;- 회의에서 제 아이디어를 동료가 자기 것처럼 발표했습니다&#10;- 썸 타는데 연락이 애매합니다"
            className="w-full h-32 p-4 bg-gray-900/50 border-2 border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none resize-none text-gray-200 placeholder-gray-500"
          />

          <button
            onClick={analyze}
            disabled={loading}
            className="mt-4 w-full bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white py-4 px-8 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '분석 중...' : '행동 전략 분석하기'}
          </button>
        </div>

        {/* 결과 영역 */}
        {result && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 mb-8 border border-purple-500/20">
            <h2 className="text-2xl font-bold mb-6 text-gray-100 border-b border-gray-700 pb-3">
              분석 결과
            </h2>

            <div className="prose prose-invert max-w-none">
              <ReactMarkdown
                className="text-gray-300 leading-relaxed"
                components={{
                  h3: ({node, ...props}) => <h3 className="text-xl font-bold mt-6 mb-3 text-purple-400" {...props} />,
                  p: ({node, ...props}) => <p className="mb-4 text-gray-300" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc ml-6 mb-4 space-y-2 text-gray-300" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal ml-6 mb-4 space-y-2 text-gray-300" {...props} />,
                  strong: ({node, ...props}) => <strong className="font-bold text-pink-400" {...props} />,
                }}
              >
                {result.analysis}
              </ReactMarkdown>
            </div>

            {/* 유료 업그레이드 CTA */}
            <div className="mt-8 p-6 bg-gradient-to-r from-purple-900/40 to-pink-900/40 rounded-xl border-2 border-purple-500/30 backdrop-blur-sm">
              <h3 className="text-lg font-bold mb-2 text-gray-100">
                더 강력한 전략이 필요하신가요?
              </h3>
              <p className="text-gray-300 mb-4">
                프리미엄 업그레이드: 비디오 가이드, 시뮬레이션, 무제한 분석
              </p>
              <button className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-lg font-bold hover:shadow-2xl hover:shadow-orange-500/50 transform hover:-translate-y-0.5 transition-all">
                프리미엄 시작하기 (월 29,900원)
              </button>
            </div>
          </div>
        )}

        {/* 중간 광고 (결과 후) */}
        {result && (
          <div className="mb-8">
            <GoogleAd
              slot="9876543210"
              format="auto"
              className="rounded-xl overflow-hidden"
            />
          </div>
        )}

        {/* 하단 광고 */}
        <div className="mb-8">
          <GoogleAd
            slot="5555555555"
            format="horizontal"
            className="rounded-xl overflow-hidden"
          />
        </div>

        {/* 사이드바 광고 (데스크톱) */}
        <div className="hidden lg:block fixed right-4 top-1/2 -translate-y-1/2 w-40">
          <GoogleAd
            slot="7777777777"
            format="vertical"
            responsive={false}
            className="rounded-xl overflow-hidden"
          />
        </div>
      </div>
    </div>
  );
}
