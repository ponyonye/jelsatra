import React, { useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Move, ZoomIn, RotateCcw, Volume2, Sparkles } from 'lucide-react';
import animalsData from '@/data/animals.json';
import { Animal } from '@/types/animal';
import ModelViewer from '@/ar/ModelViewer';

export const ARViewerPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const viewerRef = useRef<any>(null);

  const animals: Animal[] = animalsData as Animal[];
  const animal = animals.find((a) => a.slug === slug);

  // If the specific 3D model doesn't exist yet on disk, use the PoC sample or test model
  // As per PRD: Assets team is producing the finalized models.
  const modelSource = animal?.modelGlb || '/models/poc-sample.glb';

  const handleResetCamera = () => {
    if (viewerRef.current) {
      viewerRef.current.cameraOrbit = '0deg 75deg 105%';
      viewerRef.current.cameraTarget = 'auto auto auto';
      viewerRef.current.fieldOfView = 'auto';
      if (typeof viewerRef.current.jumpCameraToGoal === 'function') {
        viewerRef.current.jumpCameraToGoal();
      }
    }
  };

  const handleLaunchAR = () => {
    if (viewerRef.current && typeof viewerRef.current.activateAR === 'function') {
      try {
        viewerRef.current.activateAR();
      } catch (err) {
        console.warn('AR launch fallback:', err);
      }
    }
  };

  const handlePlaySound = () => {
    alert(`Suara satwa ${animal?.commonName || 'ini'} akan diputar saat berkas audio dari tim Assets siap.`);
  };

  if (!animal) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-lg font-bold">Satwa Tidak Ditemukan</h2>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold"
        >
          Kembali ke Galeri
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-slate-900 text-white flex flex-col justify-between overflow-hidden select-none">
      {/* Top Header matching Mockup 8 */}
      <header className="relative z-20 flex items-center justify-between px-4 py-3 safe-top bg-gradient-to-b from-slate-950/80 to-transparent">
        <button
          onClick={() => navigate(`/satwa/${animal.slug}`)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700/80 text-xs font-semibold text-white backdrop-blur border border-slate-700/60 shadow-md active:scale-95 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>

        <h1 className="text-sm font-bold tracking-wider uppercase text-slate-100">
          SATWA (AR)
        </h1>

        <button
          onClick={handleLaunchAR}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white shadow-md active:scale-95 transition"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Buka AR</span>
        </button>
      </header>

      {/* Gesture Hint Banner matching Mockup 8 */}
      <div className="relative z-20 mx-auto px-4 w-full max-w-sm mt-1">
        <div className="flex items-center justify-center gap-4 py-2 px-4 rounded-full bg-slate-950/80 backdrop-blur border border-slate-800 text-xs text-slate-300 shadow-lg">
          <div className="flex items-center gap-1.5">
            <Move className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px]">Geser satu jari untuk memutar</span>
          </div>
          <span className="text-slate-600">•</span>
          <div className="flex items-center gap-1.5">
            <ZoomIn className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px]">Cubit untuk memperbesar</span>
          </div>
        </div>
      </div>

      {/* 3D Model Viewer Web Component Center Area */}
      <main className="relative flex-1 w-full flex items-center justify-center">
        {/* Subtle decorative AR target indicator */}
        <div className="absolute w-64 h-64 rounded-full border border-dashed border-slate-700/40 pointer-events-none flex items-center justify-center opacity-30">
          <div className="w-44 h-44 rounded-full border border-slate-700/20" />
        </div>

        <ModelViewer
          modelRef={viewerRef}
          src={modelSource}
          iosSrc={animal.modelUsdz}
          alt={`Model 3D ${animal.commonName}`}
          poster={animal.thumbnail}
          autoRotate={false}
          cameraControls={true}
          ar={true}
          className="w-full h-full"
        />
      </main>

      {/* Bottom Controls and Info Card matching Mockup 8 */}
      <footer className="relative z-20 px-4 pb-4 safe-bottom flex flex-col gap-3 max-w-md mx-auto w-full">
        {/* Action Buttons: Reset Posisi & Suara Satwa */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleResetCamera}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-600 bg-slate-800/80 hover:bg-slate-700/80 text-slate-100 text-xs font-semibold shadow-md active:scale-95 transition"
          >
            <RotateCcw className="w-4 h-4 text-slate-300" />
            <span>Reset Posisi</span>
          </button>

          <button
            onClick={handlePlaySound}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md active:scale-95 transition"
          >
            <Volume2 className="w-4 h-4 text-slate-950" />
            <span>Suara Satwa</span>
          </button>
        </div>

        {/* Bottom Animal Name Card matching Mockup 8 */}
        <div className="bg-white text-slate-900 rounded-2xl p-3.5 shadow-2xl text-center border border-slate-100">
          <h2 className="text-base font-extrabold tracking-tight text-slate-900">
            {animal.commonName}
          </h2>
          <p className="text-xs italic text-slate-500 font-medium mt-0.5">
            {animal.scientificName}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ARViewerPage;
