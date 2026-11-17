import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, ShieldCheck, Box } from 'lucide-react';
import creditsData from '@/data/credits.json';
import { CreditsData } from '@/types/animal';

export const CreditsPage: React.FC = () => {
  const navigate = useNavigate();
  const credits: CreditsData = creditsData as CreditsData;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      {/* Top Header matching Mockup 9 */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100 safe-top px-4 py-3 shadow-xs">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-xs active:scale-95 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali</span>
          </button>

          <h1 className="text-sm font-extrabold tracking-wide text-slate-900 uppercase">
            KREDIT
          </h1>

          <div className="w-14" /> {/* Spacer */}
        </div>
      </header>

      {/* Main Content matching Mockup 9 layout */}
      <main className="flex-1 max-w-md mx-auto w-full px-4 py-5 space-y-4 pb-12">
        {/* Section 1: Tim Pengembang */}
        <section className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-2xl bg-amber-100/70 text-amber-700">
              <Users className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-slate-900">
              Tim Pengembang
            </h2>
          </div>

          <div className="space-y-2.5">
            {credits.team.map((member, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100/80 text-center"
              >
                <div className="text-sm font-bold text-slate-900">
                  {member.name}
                </div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">
                  {member.role}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Sumber Data */}
        <section className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-2xl bg-amber-100/70 text-amber-700">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-slate-900">
              Sumber Data
            </h2>
          </div>

          <div className="space-y-2.5">
            {credits.dataSources.map((source, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100/80 text-center"
              >
                <div className="text-xs font-bold text-slate-900">
                  {source.name}
                </div>
                {source.description && (
                  <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                    {source.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Aset Model & Teknologi */}
        <section className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-2xl bg-amber-100/70 text-amber-700">
              <Box className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-slate-900">
              Aset & Pustaka Teknologi
            </h2>
          </div>

          <div className="space-y-2.5">
            {credits.assetCredits.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-slate-50 border border-slate-100/80"
              >
                <div className="text-xs font-bold text-slate-900">
                  {item.item}
                </div>
                <div className="text-[11px] text-slate-600 mt-0.5">
                  Kreator/Pustaka: <span className="font-medium">{item.creator}</span>
                </div>
                <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                  Lisensi: {item.license} ({item.source})
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default CreditsPage;

