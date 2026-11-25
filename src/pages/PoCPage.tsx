import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Move, ZoomIn, RotateCcw, Volume2, Sparkles, CheckCircle2 } from 'lucide-react';
import ModelViewer from '@/ar/ModelViewer';

export const PoCPage: React.FC = () => {
  const navigate = useNavigate();
  const viewerRef = useRef<any>(null);

  // Allow switching between valid sample model and broken model to demonstrate error handling
  const [modelUrl, setModelUrl] = useState<string>('/models/poc-sample.glb');

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

  return (
    <div className="relative w-full h-screen bg-slate-900 text-white flex flex-col justify-between overflow-hidden select-none">
      {/* Top Navigation Bar */}
      <header className="relative z-20 flex items-center justify-between px-4 py-3 safe-top bg-gradient-to-b from-slate-950/80 to-transparent">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700/80 text-xs font-semibold text-white backdrop-blur border border-slate-700/60 shadow-md active:scale-95 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>

        <div className="text-center">
          <h1 className="text-sm font-bold tracking-wider uppercase text-slate-100">
            AR PROOF OF CONCEPT (PG-2)
          </h1>
          <span className="text-[10px] text-emerald-400 font-medium">@google/model-viewer v4</span>
        </div>

        <button
          onClick={handleLaunchAR}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white shadow-md active:scale-95 transition"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Mulai AR</span>
        </button>
      </header>

      {/* Gesture Hint Banner (Mockup 8) */}
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

      {/* Central 3D Canvas / AR Viewport */}
      <main className="relative flex-1 w-full flex items-center justify-center">
        {/* Decorative AR Placement Reticle in background */}
        <div className="absolute w-72 h-72 rounded-full border border-dashed border-slate-700/50 pointer-events-none flex items-center justify-center animate-pulse opacity-40">
          <div className="w-48 h-48 rounded-full border border-slate-700/30" />
        </div>

        <ModelViewer
          modelRef={viewerRef}
          src={modelUrl}
          alt="3D AR Proof of Concept Model"
          poster="/images/animals/komodo.png"
          autoRotate={false}
          cameraControls={true}
          ar={true}
          arPlacement="floor"
          arScale="auto"
          className="w-full h-full"
        />
      </main>

      {/* Bottom Controls and Info Overlay */}
      <footer className="relative z-20 px-4 pb-4 safe-bottom flex flex-col gap-3 max-w-md mx-auto w-full">
        {/* Test Controls for Verification (Dev/QA Bar) */}
        <div className="flex items-center justify-between text-[11px] bg-slate-950/70 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-800/80">
          <span className="text-slate-400">Test Mode:</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setModelUrl('/models/poc-sample.glb')}
              className={`px-2 py-0.5 rounded text-[10px] font-medium transition ${
                modelUrl === '/models/poc-sample.glb'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Model Valid
            </button>
            <button
              onClick={() => setModelUrl('/models/non-existent.glb')}
              className={`px-2 py-0.5 rounded text-[10px] font-medium transition ${
                modelUrl.includes('non-existent')
                  ? 'bg-red-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Test Error State
            </button>
          </div>
        </div>

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
            onClick={() => alert('Fitur audio satwa akan dihubungkan saat file audio dari tim Assets siap.')}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md active:scale-95 transition"
          >
            <Volume2 className="w-4 h-4 text-slate-950" />
            <span>Suara Satwa</span>
          </button>
        </div>

        {/* Animal Info Card (Mockup 8) */}
        <div className="bg-white text-slate-900 rounded-2xl p-4 shadow-2xl text-center border border-slate-100">
          <h2 className="text-base font-extrabold tracking-tight text-slate-900">
            Satwa Contoh (PoC Model)
          </h2>
          <p className="text-xs italic text-slate-500 font-medium mt-0.5">
            Model 3D Uji Coba WebAR Khronos Standard
          </p>
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-center gap-3 text-[11px] text-slate-600">
            <span className="flex items-center gap-1 text-emerald-700 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" /> WebXR Ready
            </span>
            <span>•</span>
            <span className="text-slate-500">Scene Viewer (Android)</span>
            <span>•</span>
            <span className="text-slate-500">Quick Look (iOS)</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PoCPage;
