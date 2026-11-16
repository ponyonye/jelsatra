import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Info, ChevronRight, Sparkles, Compass } from 'lucide-react';
import animalsData from '@/data/animals.json';
import { Animal } from '@/types/animal';

export const GalleryPage: React.FC = () => {
  const navigate = useNavigate();
  const animals: Animal[] = animalsData as Animal[];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      {/* Top Header matching Mockup 1 */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm safe-top px-5 py-4">
        <div className="max-w-md mx-auto flex items-start justify-between gap-3">
          <div>
            <h1 className="text-lg font-extrabold tracking-tight text-slate-900 leading-tight">
              JELAJAH SATWA NUSANTARA
            </h1>
            <p className="text-xs font-bold text-emerald-700 tracking-wide mt-0.5">
              KENALI YANG LIAR, LINDUNGI YANG LANGKA.
            </p>
          </div>

          <button
            onClick={() => navigate('/kredit')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold shadow-xs active:scale-95 transition"
            aria-label="Halaman Kredit"
          >
            <Info className="w-3.5 h-3.5 text-slate-600" />
            <span>Kredit</span>
          </button>
        </div>
      </header>

      {/* Main Content: 2-Column Animal Card Grid */}
      <main className="flex-1 max-w-md mx-auto w-full px-4 py-5">
        {/* Banner for PoC AR Testing (PG-2 Quick Access) */}
        <div className="mb-5 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-800 to-teal-900 text-white shadow-md flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/10 backdrop-blur text-emerald-300">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                WebAR Proof of Concept
              </h2>
              <p className="text-[11px] text-slate-200">
                Uji model 3D & fitur WebAR kamera
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/poc')}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow transition active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Uji AR</span>
          </button>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-2 gap-3.5">
          {animals.map((animal) => (
            <article
              key={animal.id}
              onClick={() => navigate(`/satwa/${animal.slug}`)}
              className="group bg-white rounded-2xl border border-slate-100 p-2.5 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Animal Thumbnail Container */}
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-100">
                  <img
                    src={animal.thumbnail}
                    alt={animal.commonName}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* 3D AR Badge */}
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur text-[10px] font-bold text-white flex items-center gap-1">
                    <span>360</span>
                    <span>3D AR</span>
                  </span>
                </div>

                {/* Status Badges */}
                <div className="mt-2.5 flex flex-col gap-1">
                  <span className="inline-block self-start px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-800 text-white">
                    {animal.protectionStatus}
                  </span>
                  <span className="inline-block self-start px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-600 text-white truncate max-w-full">
                    Prioritas konservasi nasional
                  </span>
                </div>

                {/* Animal Names */}
                <div className="mt-2">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition leading-snug">
                    {animal.commonName}
                  </h3>
                  <p className="text-[11px] italic text-slate-500 font-medium leading-tight">
                    {animal.scientificName}
                  </p>
                </div>
              </div>

              {/* Card Footer Link */}
              <div className="mt-3 pt-2 border-t border-slate-50 flex items-center justify-between text-xs font-semibold text-emerald-700">
                <span>Lihat Info</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </article>
          ))}
        </div>
      </main>

      {/* Bottom Hint matching Mockup 1 */}
      <footer className="sticky bottom-0 z-20 bg-white/95 backdrop-blur-md border-t border-slate-100 py-3 safe-bottom text-center">
        <p className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
          <span>Tap Satwa untuk Info dan AR!</span>
        </p>
      </footer>
    </div>
  );
};

export default GalleryPage;
