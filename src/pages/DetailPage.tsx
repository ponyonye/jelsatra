import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, MapPin, Utensils, Sparkles, Box, Info, RotateCcw, Volume2, Move, ZoomIn, Loader2 } from 'lucide-react';
import animalsData from '@/data/animals.json';
import { Animal } from '@/types/animal';
import { ConservationBadge } from '@/components/common/ConservationBadge';
import ModelViewer from '@/ar/ModelViewer';

export const DetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const viewerRef = useRef<any>(null);

  const animals: Animal[] = animalsData as Animal[];
  const animal = animals.find((a) => a.slug === slug);

  const [isModelReady, setIsModelReady] = useState<boolean>(false);
  const [loadPercent, setLoadPercent] = useState<number>(0);
  const [is3DFallbackOpen, setIs3DFallbackOpen] = useState<boolean>(false);
  const [arNoticeMessage, setArNoticeMessage] = useState<string>('');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

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

  /**
   * Launch AR directly from user interaction to preserve transient user activation.
   * If AR is supported and camera is available, WebXR / Scene Viewer / Quick Look starts directly.
   * If AR is unavailable, permission is denied, camera is busy, or device is desktop,
   * transitions to the 3D Fallback Mode matching Mockup 8.
   */
  const handleStartAR = () => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    if (viewer.canActivateAR) {
      try {
        const arPromise = viewer.activateAR();
        if (arPromise && typeof arPromise.catch === 'function') {
          arPromise.catch((err: any) => {
            console.warn('AR activation promise rejected:', err);
            setArNoticeMessage('Kamera AR tidak dapat diakses atau izin kamera ditolak. Menampilkan Tampilan 3D Interaktif.');
            setIs3DFallbackOpen(true);
          });
        }
      } catch (err) {
        console.warn('AR activation threw synchronously:', err);
        setArNoticeMessage('Mode AR tidak dapat diluncurkan pada peramban ini. Menampilkan Tampilan 3D Interaktif.');
        setIs3DFallbackOpen(true);
      }
    } else {
      // Device/browser does not support AR -> activate Fallback 3D Mode
      setArNoticeMessage('Perangkat atau peramban tidak mendukung WebXR / AR. Menampilkan Tampilan 3D Interaktif.');
      setIs3DFallbackOpen(true);
    }
  };

  const handleResetCamera = () => {
    const viewer = viewerRef.current;
    if (viewer) {
      viewer.cameraOrbit = animal.initialCameraOrbit || '0deg 75deg 105%';
      if (animal.modelOrientation) {
        viewer.orientation = animal.modelOrientation;
      }
      viewer.cameraTarget = 'auto auto auto';
      viewer.fieldOfView = 'auto';
      if (typeof viewer.jumpCameraToGoal === 'function') {
        viewer.jumpCameraToGoal();
      }
    }
  };

  const handlePlaySound = () => {
    if (animal.audioUrl) {
      if (isPlayingAudio && audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlayingAudio(false);
        return;
      }

      if (!audioRef.current) {
        audioRef.current = new Audio(animal.audioUrl);
        audioRef.current.onended = () => setIsPlayingAudio(false);
        audioRef.current.onerror = () => {
          setIsPlayingAudio(false);
          setArNoticeMessage(`Berkas audio suara ${animal.commonName} belum dapat dimuat.`);
        };
      }

      audioRef.current
        .play()
        .then(() => setIsPlayingAudio(true))
        .catch((err) => {
          console.warn('Audio playback error:', err);
          setIsPlayingAudio(false);
        });
    } else {
      setArNoticeMessage(`Berkas audio suara ${animal.commonName} sedang disiapkan oleh tim Assets.`);
    }
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
          Maintains the aspect-[16/10] space in the detail page flow.
          Renders 3D Model Viewer with heroImage as seamless poster.
          When is3DFallbackOpen is true, smoothly takes over the full viewport
          displaying the dark blue fallback mode matching Mockup 8.
        */}
        <div className="relative aspect-[16/10] w-full rounded-2xl bg-slate-100 mb-4 shadow-sm">
          <div
            className={
              is3DFallbackOpen
                ? "fixed inset-0 z-50 bg-slate-900 text-white flex flex-col justify-between overflow-hidden select-none"
                : "relative w-full h-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200/80"
            }
          >
            {/* Header when in Fallback 3D Mode matching Mockup 8 */}
            {is3DFallbackOpen && (
              <header className="relative z-20 flex items-center justify-between px-4 py-3 safe-top bg-slate-950/80 backdrop-blur border-b border-slate-800">
                <button
                  onClick={() => setIs3DFallbackOpen(false)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-slate-700 shadow-md active:scale-95 transition"
                  aria-label="Tutup Tampilan 3D"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Kembali</span>
                </button>

                <h2 className="text-xs font-bold tracking-wider uppercase text-slate-200">
                  SATWA (AR)
                </h2>

                <div className="w-16" />
              </header>
            )}

            {/* Notice Banner when in Fallback 3D Mode */}
            {is3DFallbackOpen && arNoticeMessage && (
              <div className="relative z-20 mx-4 mt-2">
                <div className="p-2.5 rounded-2xl bg-amber-950/80 border border-amber-500/40 text-amber-200 text-xs flex items-center justify-between gap-2.5 shadow-lg">
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-amber-400 shrink-0" />
                    <p className="leading-snug text-[11px]">{arNoticeMessage}</p>
                  </div>
                  <button
                    onClick={() => setArNoticeMessage('')}
                    className="text-amber-300 hover:text-white text-xs px-1.5 py-0.5 rounded cursor-pointer"
                    aria-label="Tutup pemberitahuan"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            {/* Gesture Hints Pill in Fallback Mode matching Mockup 8 */}
            {is3DFallbackOpen && (
              <div className="relative z-20 mx-auto px-4 w-full max-w-sm mt-3">
                <div className="flex items-center justify-center gap-4 py-2 px-4 rounded-full bg-slate-950/85 backdrop-blur border border-slate-800 text-xs text-slate-300 shadow-lg">
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
            )}

            {/* Decorative dashed circle reticle in background matching Mockup 8 */}
            {is3DFallbackOpen && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30">
                <div className="w-72 h-72 rounded-full border-2 border-dashed border-slate-600/60 flex items-center justify-center">
                  <div className="w-48 h-48 rounded-full border border-slate-700/40" />
                </div>
              </div>
            )}

            {/* Central 3D Model Viewer Web Component */}
            <div className="relative flex-1 w-full h-full flex items-center justify-center">
              <ModelViewer
                modelRef={viewerRef}
                src={modelSource}
                iosSrc={animal.modelUsdz}
                alt={`Model 3D ${animal.commonName}`}
                poster={animal.heroImage}
                autoRotate={false}
                cameraControls={true}
                ar={true}
                arPlacement="floor"
                arScale="auto"
                showArButton={false}
                orientation={animal.modelOrientation}
                cameraOrbit={animal.initialCameraOrbit}
                onLoad={() => setIsModelReady(true)}
                onProgress={(p) => setLoadPercent(p)}
                onArStatusChange={(status) => {
                  if (status === 'failed') {
                    setArNoticeMessage('Sesi AR gagal dimulai atau terhenti. Menampilkan Tampilan 3D Interaktif.');
                    setIs3DFallbackOpen(true);
                  }
                }}
                className="w-full h-full"
              />
            </div>

            {/* Bottom Controls when in Fallback Mode matching Mockup 8 */}
            {is3DFallbackOpen && (
              <footer className="relative z-20 px-4 pb-4 safe-bottom flex flex-col gap-3 max-w-md mx-auto w-full">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleResetCamera}
                    className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-100 text-xs font-semibold shadow-md active:scale-95 transition cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4 text-slate-300" />
                    <span>Reset Posisi</span>
                  </button>

                  <button
                    onClick={handlePlaySound}
                    className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold shadow-md active:scale-95 transition cursor-pointer ${
                      isPlayingAudio
                        ? 'bg-amber-600 text-white animate-pulse'
                        : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                    }`}
                    aria-label={isPlayingAudio ? 'Hentikan Suara Satwa' : 'Putar Suara Satwa'}
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>{isPlayingAudio ? 'Hentikan Suara' : 'Suara Satwa'}</span>
                  </button>
                </div>

                <div className="bg-white text-slate-900 rounded-2xl p-3.5 shadow-2xl text-center border border-slate-100">
                  <h3 className="text-base font-extrabold tracking-tight text-slate-900">
                    {animal.commonName}
                  </h3>
                  <p className="text-xs italic text-slate-500 font-medium mt-0.5">
                    {animal.scientificName}
                  </p>
                </div>
              </footer>
            )}
          </div>
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

      {/* Fixed Bottom Action Bar: Directly launches AR on compatible devices */}
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
    </div>
  );
};

export default DetailPage;
