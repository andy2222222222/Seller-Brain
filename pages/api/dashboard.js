const { SellingPartner } = require('amazon-sp-api');

export default async function handler(req, res) {
  const spApi = new SellingPartner({
    region: 'na',
    refreshToken: process.env.REFRESH_TOKEN,
  });

  try {
    const orders = await spApi.callAPI({
      operation: 'getOrders',
      endpoint: 'orders',
      params: { MarketplaceIds: ['ATVPDKIKX0DER'], CreatedAfter: '2025-10-01' }
    });

    const inventory = await spApi.callAPI({
      operation: 'getInventorySummaries',
      endpoint: 'fbaInventory',
      params: { details: true, granularityType: 'Summary', marketplaceIds: ['ATVPDKIKX0DER'] }
    });

    const payload = { orders, inventory };

    const groqResp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${process.env.GROQ_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama-3.1-70b-versatile",
        messages: [
          { role: "system", content: "Return ONLY valid JSON: {profit30d:number, pricingPower:0-100, reviewTrust:0-100, plan:[{action:string, impact:string}]}" },
          { role: "user", content: JSON.stringify(payload) }
        ]
      })
    });
    const groq = await groqResp.json();
    const result = JSON.parse(groq.choices[0].message.content || "{}");

    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
