import type { VercelRequest, VercelResponse } from '@vercel/node';

interface SajuInput {
  surname: string;
  dayMaster: string;
  dayMasterElement: string;
  ohpiengDistribution: Record<string, number>;
  deficientElements: string[];
  gender: 'male' | 'female';
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  const { surname, dayMaster, dayMasterElement, ohpiengDistribution, deficientElements, gender } = req.body as SajuInput;

  if (!surname || !dayMaster) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const genderText = gender === 'male' ? '남아' : '여아';
  const deficientText = deficientElements.length > 0
    ? deficientElements.join(', ')
    : '없음 (고르게 분포)';

  const prompt = `당신은 한국 전통 작명 전문가입니다.
아래 아이의 사주 분석 결과를 바탕으로 이름 5개를 추천해주세요.

성씨: ${surname}
성별: ${genderText}
일간(Day Master): ${dayMaster} (${dayMasterElement})
오행 분포: 목 ${ohpiengDistribution['목'] ?? 0}, 화 ${ohpiengDistribution['화'] ?? 0}, 토 ${ohpiengDistribution['토'] ?? 0}, 금 ${ohpiengDistribution['금'] ?? 0}, 수 ${ohpiengDistribution['수'] ?? 0}
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

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 4096,
            thinkingConfig: { thinkingBudget: 0 },
          },
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      return res.status(502).json({ error: 'AI service error' });
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return res.status(502).json({ error: 'Empty response from AI' });
    }

    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.error('Failed to parse AI response:', text);
      return res.status(502).json({ error: 'Invalid AI response format' });
    }

    const names = JSON.parse(jsonMatch[0]);
    return res.status(200).json({ names });
  } catch (error) {
    console.error('Recommend API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
