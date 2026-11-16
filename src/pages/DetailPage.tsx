import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Utensils, Sparkles, Box } from 'lucide-react';
import animalsData from '@/data/animals.json';
import { Animal } from '@/types/animal';
import { ConservationBadge } from '@/components/common/ConservationBadge';

export const DetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const animals: Animal[] = animalsData as Animal[];
  const animal = animals.find((a) => a.slug === slug);

  if (!animal) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-lg font-bold text-slate-800">Satwa Tidak Ditemukan</h2>
        <p className="text-xs text-slate-500 mt-1 mb-4">
          Tautan satwa yang Anda tuju mungkin belum tersedia atau salah ketik.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-semibold shadow"
        >
          Kembali ke Galeri
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      {/* Top Header matching Mockup 2-7 */}
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
            DETAIL SATWA
          </h1>

          <div className="w-14" /> {/* Spacer for balance */}
        </div>
      </header>

      {/* Main Detail Content */}
      <main className="flex-1 max-w-md mx-auto w-full px-4 py-4 pb-28">
        {/* Animal Hero Image Banner */}
        <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-sm bg-slate-100">
          <img
            src={animal.heroImage}
            alt={animal.commonName}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Status Pills */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-800 text-white shadow-xs">
            {animal.protectionStatus}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-600 text-white shadow-xs">
            Prioritas konservasi nasional
          </span>
          <ConservationBadge status={animal.conservationStatus} showFullLabel={true} />
        </div>

        {/* Animal Titles */}
        <div className="mt-3 text-center">
          <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
            {animal.commonName}
          </h2>
          <p className="text-sm italic text-slate-500 font-medium">
            {animal.scientificName}
          </p>
        </div>

        {/* Info Cards */}
        <div className="mt-5 space-y-3">
          {/* Card 1: Habitat & Persebaran */}
          <section className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Habitat dan wilayah persebaran
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {animal.habitat}. Satwa ini tersebar di: {animal.distribution}.
              </p>
            </div>
          </section>

          {/* Card 2: Makanan */}
          <section className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 shrink-0">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Makanan
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {animal.diet}
              </p>
            </div>
          </section>

          {/* Card 3: Fakta Unik */}
          <section className="bg-white rounded-2xl p-4 border border-amber-100 bg-amber-50/20 shadow-sm flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Fakta unik
              </h3>
              <ul className="text-xs text-slate-600 mt-1 space-y-1.5 leading-relaxed list-disc list-inside">
                {animal.funFacts.map((fact, idx) => (
                  <li key={idx}>{fact}</li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </main>

      {/* Fixed Bottom Action Bar matching Mockup 2 */}
      <aside className="fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-100 p-4 safe-bottom">
        <div className="max-w-md mx-auto">
          <button
            onClick={() => navigate(`/satwa/${animal.slug}/ar`)}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-900/20 active:scale-[0.98] transition"
          >
            <Box className="w-5 h-5" />
            <span>Lihat dalam AR (3D)</span>
          </button>
        </div>
      </aside>
    </div>
  );
};

export default DetailPage;
