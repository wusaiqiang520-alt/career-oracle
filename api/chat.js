export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({ status: 'ok', message: 'Career Oracle API 正常运行' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: '请使用POST请求' });
  }

  try {
    const { userInput } = req.body;

    if (!userInput) {
      return res.status(400).json({ error: '请输入您的情况描述' });
    }

    const API_KEY = 'sk-MqlYdYN4SmGPn1r0JjXL4QFtCq1PmehAmve7CMxIj7GwVJz9';

    const response = await fetch('https://api.moonshot.cn/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + API_KEY
      },
      body: JSON.stringify({
        model: 'moonshot-v1-8k',
        messages: [
          {
            role: 'system',
            content: '你是 Career Oracle，一位顶级的AI职业顾问。请基于用户情况，提供Markdown格式的职业分析报告，包含：核心优势评估、潜在机会、风险与挑战、行动方案（短期/中期/长期）、关键建议。语气专业且鼓舞人心。'
          },
          { role: 'user', content: userInput }
        ],
        temperature: 0.3
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    return res.status(200).json({ report: data.choices[0].message.content });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
