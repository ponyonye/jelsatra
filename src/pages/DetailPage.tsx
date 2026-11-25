import React, { useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, MapPin, Utensils, Sparkles, Box, Loader2 } from 'lucide-react';
import animalsData from '@/data/animals.json';
import { Animal } from '@/types/animal';
import { ConservationBadge } from '@/components/common/ConservationBadge';
import ModelViewer from '@/ar/ModelViewer';
import CameraARViewer from '@/ar/CameraARViewer';

export const DetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const viewerRef = useRef<any>(null);

  const animals: Animal[] = animalsData as Animal[];
  const animal = animals.find((a) => a.slug === slug);

  const [isModelReady, setIsModelReady] = useState<boolean>(false);
  const [loadPercent, setLoadPercent] = useState<number>(0);
  const [isAROpen, setIsAROpen] = useState<boolean>(false);

  if (!animal) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-lg font-bold text-slate-800">Satwa Tidak Ditemukan</h2>
        <p className="text-xs text-slate-500 mt-1 mb-4">
          Tautan satwa yang Anda tuju mungkin belum tersedia atau salah ketik.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-semibold shadow active:scale-95 transition"
        >
          Kembali ke Galeri
        </button>
      </div>
    );
  }

  const modelSource = animal.modelGlb || '/models/poc-sample.glb';

  const handleStartAR = () => {
    setIsAROpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      {/* Top Header matching Figma Mockup 2-7 */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 safe-top px-4 py-3 shadow-xs">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-xs active:scale-95 transition"
            aria-label="Kembali ke Galeri"
          >
            <ChevronLeft className="w-4 h-4 text-slate-600" />
            <span>Kembali</span>
          </button>

          <h1 className="text-sm font-extrabold tracking-wider text-slate-900 uppercase">
            DETAIL SATWA
          </h1>
        </div>
      </header>

      {/* Main Detail Content */}
      <main className="flex-1 max-w-md mx-auto w-full px-4 py-4 pb-28">
        {/*
          Hero Visual Slot:
          Maintains aspect-[16/10] space in the detail page flow.
          Renders 3D Model Viewer with heroImage as seamless poster.
        */}
        <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200/80 mb-4 shadow-sm">
          <ModelViewer
            modelRef={viewerRef}
            src={modelSource}
            iosSrc={animal.modelUsdz}
            alt={`Model 3D ${animal.commonName}`}
            poster={animal.heroImage}
            autoRotate={false}
            cameraControls={true}
            ar={false}
            showArButton={false}
            orientation={animal.modelOrientation}
            cameraOrbit={animal.initialCameraOrbit}
            onLoad={() => setIsModelReady(true)}
            onProgress={(p) => setLoadPercent(p)}
            className="w-full h-full"
          />
        </div>

        {/* Status Badges matching Figma Mockup 2-7 */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-[#1c6442] text-white shadow-xs">
            {animal.protectionStatus}
          </span>
          <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-[#dc2626] text-white shadow-xs">
            Prioritas konservasi nasional
          </span>
          {animal.conservationStatus && (
            <ConservationBadge status={animal.conservationStatus} showFullLabel={true} />
          )}
        </div>

        {/* Animal Names */}
        <div className="mt-2.5 text-center">
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 leading-tight">
            {animal.commonName}
          </h2>
          <p className="text-sm italic text-slate-500 font-normal mt-0.5">
            {animal.scientificName}
          </p>
        </div>

        {/* Info Cards matching Figma Mockups 2-7 */}
        <div className="mt-4 space-y-3">
          {/* Card 1: Habitat & Wilayah Persebaran */}
          <section className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-100/90 flex items-center justify-center text-amber-700 shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-slate-900">
                Habitat dan wilayah persebaran
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {animal.habitatDistributionText ||
                  `${animal.commonName} hidup di ${animal.habitat.toLowerCase()}. Satwa ini dapat ditemukan secara alami di ${animal.distribution}.`}
              </p>
            </div>
          </section>

          {/* Card 2: Makanan */}
          <section className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-100/90 flex items-center justify-center text-amber-700 shrink-0">
              <Utensils className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-slate-900">
                Makanan
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {animal.diet}
              </p>
            </div>
          </section>

          {/* Card 3: Fakta Unik */}
          <section className="bg-amber-50/30 rounded-2xl p-4 border border-amber-200/60 shadow-xs flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-slate-900">
                Fakta unik
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {animal.funFactNarrative || animal.funFacts.join(' ')}
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* Fixed Bottom Action Bar: Directly launches Fullscreen AR with Laptop Webcam */}
      <aside className="fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-100 p-4 safe-bottom">
        <div className="max-w-md mx-auto">
          <button
            onClick={handleStartAR}
            disabled={!isModelReady && loadPercent < 100 && !viewerRef.current?.loaded}
            className={`w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl font-bold text-sm shadow-lg transition active:scale-[0.98] cursor-pointer ${
              !isModelReady && loadPercent < 100 && !viewerRef.current?.loaded
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                : 'bg-[#1c6442] hover:bg-emerald-700 text-white shadow-emerald-950/15'
            }`}
            aria-label="Lihat dalam AR (3D)"
          >
            {!isModelReady && loadPercent < 100 && !viewerRef.current?.loaded ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
                <span>Menyiapkan Model 3D ({loadPercent}%)...</span>
              </>
            ) : (
              <>
                <Box className="w-5 h-5 text-emerald-200" />
                <span>Lihat dalam AR (3D)</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Fullscreen Webcam Passthrough AR Experience */}
      {isAROpen && (
        <CameraARViewer
          animal={animal}
          onClose={() => setIsAROpen(false)}
          showNativeARButton={true}
        />
      )}
    </div>
  );
};

export default DetailPage;
