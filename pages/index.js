import { useEffect, useState } from 'react';

export default function Home() {
  const [data, setData] = useState({ profit30d: 0, pricingPower: 0, reviewTrust: 0, plan: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard')
      .then(r => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-4xl">Loading your SellerBrain data…</div>;

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <h1 className="text-6xl font-bold text-center mb-12">SellerBrain AI – Your Results</h1>
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="bg-slate-800 p-8 rounded-xl">
          <p className="text-slate-400">30-day Net Profit</p>
          <p className="text-5xl font-bold text-green-400">${data.profit30d.toLocaleString()}</p>
        </div>
        <div className="bg-slate-800 p-8 rounded-xl">
          <p className="text-slate-400">Pricing Power</p>
          <p className="text-5xl font-bold text-blue-400">{data.pricingPower}/100</p>
        </div>
        <div className="bg-slate-800 p-8 rounded-xl">
          <p className="text-slate-400">Review Trust</p>
          <p className="text-5xl font-bold text-purple-400">{data.reviewTrust}/100</p>
        </div>
      </div>
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-xl p-8">
        <h2 className="text-4xl font-bold mb-6 text-center">72-Hour Profit Plan</h2>
        <div className="text-xl space-y-4">
          {data.plan.map((p, i) => (
            <div key={i} className="bg-slate-800 p-6 rounded-lg">
              • {p.action} <span class="text-green-400 font-bold">{p.impact}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
