import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import type { Plugin } from 'vite';

function localApiPlugin(): Plugin {
  let geminiKey = '';

  return {
    name: 'local-api',
    configResolved(config) {
      const env = loadEnv(config.mode, config.root, '');
      geminiKey = env.GEMINI_API_KEY || '';
    },
    configureServer(server) {
      server.middlewares.use('/api/recommend', async (req, res) => {
        if (req.method === 'OPTIONS') {
          res.writeHead(204);
          res.end();
          return;
        }
        if (req.method !== 'POST') {
          res.writeHead(405);
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }
        if (!geminiKey) {
          res.writeHead(500);
          res.end(JSON.stringify({ error: 'GEMINI_API_KEY not set in .env.local' }));
          return;
        }

        let body = '';
        req.on('data', (chunk: Buffer) => { body += chunk.toString(); });
        req.on('end', async () => {
          try {
            const { surname, dayMaster, dayMasterElement, ohpiengDistribution, deficientElements, gender } = JSON.parse(body);

            const genderText = gender === 'male' ? '남아' : '여아';
            const deficientText = deficientElements?.length > 0
              ? deficientElements.join(', ')
              : '없음 (고르게 분포)';

            const prompt = `당신은 한국 전통 작명 전문가입니다.
아래 아이의 사주 분석 결과를 바탕으로 이름 5개를 추천해주세요.

성씨: ${surname}
성별: ${genderText}
일간(Day Master): ${dayMaster} (${dayMasterElement})
오행 분포: 목 ${ohpiengDistribution?.['목'] ?? 0}, 화 ${ohpiengDistribution?.['화'] ?? 0}, 토 ${ohpiengDistribution?.['토'] ?? 0}, 금 ${ohpiengDistribution?.['금'] ?? 0}, 수 ${ohpiengDistribution?.['수'] ?? 0}
부족한 오행: ${deficientText}

조건:
1. 부족한 오행을 보완하는 한자를 이름에 사용할 것
2. 대법원 인명용 한자만 사용할 것
3. 이름은 2글자로 할 것 (성 제외)
4. 음운이 자연스럽고 부르기 좋을 것
5. ${genderText}에게 어울리는 이름일 것
6. 각 이름의 한자 뜻과 선정 이유를 설명할 것

절대 중요: hangul과 hanja에 성씨(${surname})를 포함하지 마세요! 이름 2글자만 넣으세요!
예시 - 성씨가 "정"일 때: hangul은 "윤서"(O), "정윤서"(X)

반드시 아래 JSON 형식으로만 답하세요. 다른 텍스트 없이 JSON 배열만 출력하세요:
[{"hangul":"윤서","hanja":"潤瑞","meaning":"첫째자 뜻 + 둘째자 뜻","reason":"추천 이유 설명"}]`;

            const response = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  contents: [{ parts: [{ text: prompt }] }],
                  generationConfig: { temperature: 0.8, maxOutputTokens: 4096, thinkingConfig: { thinkingBudget: 0 } },
                }),
              },
            );

            if (!response.ok) {
              const errorText = await response.text();
              console.error('Gemini API error:', errorText);
              res.writeHead(502);
              res.end(JSON.stringify({ error: 'AI service error' }));
              return;
            }

            const data = await response.json();
            const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            const jsonMatch = text?.match(/\[[\s\S]*\]/);

            if (!jsonMatch) {
              console.error('Failed to parse:', text);
              res.writeHead(502);
              res.end(JSON.stringify({ error: 'Invalid AI response' }));
              return;
            }

            const names = JSON.parse(jsonMatch[0]);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ names }));
          } catch (err) {
            console.error('API error:', err);
            res.writeHead(500);
            res.end(JSON.stringify({ error: 'Internal server error' }));
          }
        });
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), localApiPlugin()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'lunar': ['lunar-typescript'],
          'hanja-data': ['./src/data/hanja.json'],
        },
      },
    },
  },
});
