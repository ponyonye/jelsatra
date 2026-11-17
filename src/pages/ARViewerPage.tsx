import React, { useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Move, ZoomIn, RotateCcw, Volume2, Sparkles, Info } from 'lucide-react';
import animalsData from '@/data/animals.json';
import { Animal } from '@/types/animal';
import ModelViewer from '@/ar/ModelViewer';

export const ARViewerPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const viewerRef = useRef<any>(null);
  const [isArSupported, setIsArSupported] = useState<boolean>(true);

  const animals: Animal[] = animalsData as Animal[];
  const animal = animals.find((a) => a.slug === slug);

  const modelSource = animal?.modelGlb || '/models/poc-sample.glb';

  const handleResetCamera = () => {
    if (viewerRef.current) {
      viewerRef.current.cameraOrbit = animal?.initialCameraOrbit || '0deg 75deg 105%';
      if (animal?.modelOrientation) {
        viewerRef.current.orientation = animal.modelOrientation;
      }
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
        setIsArSupported(false);
      }
    }
  };

  const handlePlaySound = () => {
    alert(`Suara satwa ${animal?.commonName || 'ini'} akan diputar saat berkas audio dari tim Assets siap.`);
  };

  if (!animal) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-lg font-bold">Satwa Tidak Ditemukan</h2>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-semibold"
        >
          Kembali ke Galeri
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-slate-900 text-white flex flex-col justify-between overflow-hidden select-none">
      {/* Top Header */}
      <header className="relative z-20 flex items-center justify-between px-4 py-3 safe-top bg-gradient-to-b from-slate-950/80 to-transparent">
        <button
          onClick={() => navigate(`/satwa/${animal.slug}`)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700/80 text-xs font-semibold text-white backdrop-blur border border-slate-700/60 shadow-md active:scale-95 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>

        <h1 className="text-xs font-bold tracking-wider uppercase text-slate-100">
          MODE 3D & AR
        </h1>

        <button
          onClick={handleLaunchAR}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white shadow-md active:scale-95 transition"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Mulai AR</span>
        </button>
      </header>

      {/* Non-AR notice if AR unsupported */}
      {!isArSupported && (
        <div className="relative z-20 mx-4 mt-1">
          <div className="p-2.5 rounded-xl bg-amber-950/80 border border-amber-600/50 text-amber-200 text-xs flex items-center gap-2">
            <Info className="w-4 h-4 shrink-0 text-amber-400" />
            <span>AR tidak didukung di peramban ini. Tampilan beralih ke Mode 3D.</span>
          </div>
        </div>
      )}

      {/* Gesture Hint Banner */}
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
        <ModelViewer
          modelRef={viewerRef}
          src={modelSource}
          iosSrc={animal.modelUsdz}
          alt={`Model 3D ${animal.commonName}`}
          poster={animal.thumbnail}
          autoRotate={false}
          cameraControls={true}
          ar={true}
          showArButton={false}
          orientation={animal.modelOrientation}
          cameraOrbit={animal.initialCameraOrbit}
          onArStatusChange={(status) => {
            if (status === 'failed') {
              setIsArSupported(false);
            }
          }}
          className="w-full h-full"
        />
      </main>

      {/* Bottom Controls and Info Card */}
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

        {/* Bottom Animal Name Card */}
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
