import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Users, ShieldCheck, Box, Layers, FileText, ExternalLink } from 'lucide-react';
import creditsData from '@/data/credits.json';
import { CreditsData } from '@/types/animal';

export const CreditsPage: React.FC = () => {
  const navigate = useNavigate();
  const credits: CreditsData = creditsData as CreditsData;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      {/* Top Header matching Mockup 9 */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 safe-top px-4 py-3 shadow-xs">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-xs active:scale-95 transition cursor-pointer"
            aria-label="Kembali ke Galeri"
          >
            <ChevronLeft className="w-4 h-4 text-slate-600" />
            <span>Kembali</span>
          </button>

          <h1 className="text-sm font-extrabold tracking-wider text-slate-900 uppercase">
            KREDIT
          </h1>
        </div>
      </header>

      {/* Main Content matching Mockup 9 layout */}
      <main className="flex-1 max-w-md mx-auto w-full px-4 py-5 space-y-4 pb-12">
        {/* Section 1: Tim Pengembang matching Mockup 9 */}
        <section className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-100/80 flex items-center justify-center text-amber-700 shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">
                Tim Pengembang
              </h2>
              <p className="text-[11px] text-slate-500">
                Penyusun dan pengembang aplikasi Jelajah Satwa Nusantara
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {credits.team.map((member, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100/80 text-center hover:bg-slate-100/70 transition"
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

        {/* Section 2: Sumber Data matching Mockup 9 */}
        <section className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-100/80 flex items-center justify-center text-amber-700 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">
                Sumber Data
              </h2>
              <p className="text-[11px] text-slate-500">
                Rujukan ilmiah status perlindungan dan konservasi satwa
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {credits.dataSources.map((source, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100/80 text-center hover:bg-slate-100/70 transition"
              >
                <div className="text-xs font-bold text-slate-900">
                  {source.name}
                </div>
                {source.description && (
                  <div className="text-[11px] text-slate-500 font-normal mt-0.5 leading-snug">
                    {source.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Kredit Model 3D (Final Approved License) */}
        <section className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100/80 flex items-center justify-center text-amber-700 shrink-0">
              <Box className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">
                Kredit Model 3D
              </h2>
              <p className="text-[11px] text-slate-500">
                Aset 3D orisinal karya 3D Modeler tim (Guna)
              </p>
            </div>
          </div>

          {/* Master License Banner with verified link to MODEL-LICENSE.md */}
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200/80 mb-3.5">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-emerald-900">
                    Lisensi Resmi Model: All Rights Reserved
                  </div>
                  <div className="text-[11px] text-emerald-700 font-medium">
                    © 2026 Guna. All Rights Reserved.
                  </div>
                </div>
              </div>

              <a
                href="/models/MODEL-LICENSE.md"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold shadow-xs transition active:scale-95 shrink-0"
                aria-label="Buka dokumen lisensi MODEL-LICENSE.md"
              >
                <span>Lihat Dokumen</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-[10px] text-emerald-800/90 mt-1.5 leading-snug">
              Lisensi ini berlaku secara eksklusif untuk enam model 3D orisinal buatan Guna dalam proyek Jelajah Satwa Nusantara.
            </p>
          </div>

          <div className="space-y-3">
            {credits.models3d?.map((m, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100/80 space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="text-xs font-bold text-slate-900">
                    {m.animalName}
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300/60">
                    All Rights Reserved
                  </span>
                </div>

                <div className="text-[11px] text-slate-600 leading-tight">
                  <span className="font-semibold text-slate-700">{m.title}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                  <div>
                    Kreator: <span className="font-semibold text-slate-800">{m.creator}</span>
                  </div>
                  <div>
                    Software: <span className="font-semibold text-slate-800">{m.software}</span>
                  </div>
                </div>

                <div className="text-[10px] text-slate-500">
                  Sumber: <span className="text-slate-700 font-medium">{m.source}</span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px] text-slate-500">
                  <span className="font-medium text-slate-600">{m.license?.copyright || '© 2026 Guna. All Rights Reserved.'}</span>
                  <a
                    href={m.license?.documentUrl || '/models/MODEL-LICENSE.md'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-semibold"
                  >
                    <span>Dokumen Lisensi</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Aset Pendukung & Pustaka Teknologi */}
        <section className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-100/80 flex items-center justify-center text-amber-700 shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">
                Aset Pendukung & Pustaka
              </h2>
              <p className="text-[11px] text-slate-500">
                Pustaka kode sumber terbuka, ikon, dan tipografi
              </p>
            </div>
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
                  Kreator / Sumber: <span className="font-medium text-slate-800">{item.creator}</span> ({item.source})
                </div>
                <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                  Lisensi: {item.license}
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
