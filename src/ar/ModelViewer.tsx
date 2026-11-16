import React, { useEffect, useRef, useState } from 'react';
import '@google/model-viewer';
import { Loader2, AlertCircle, RefreshCw, Eye } from 'lucide-react';

interface ModelViewerProps {
  src: string;
  iosSrc?: string;
  alt: string;
  poster?: string;
  autoRotate?: boolean;
  cameraControls?: boolean;
  ar?: boolean;
  onArStatusChange?: (status: string) => void;
  className?: string;
  modelRef?: React.MutableRefObject<any>;
}

export const ModelViewer: React.FC<ModelViewerProps> = ({
  src,
  iosSrc,
  alt,
  poster,
  autoRotate = false,
  cameraControls = true,
  ar = true,
  onArStatusChange,
  className = '',
  modelRef: externalRef
}) => {
  const internalRef = useRef<any>(null);
  const viewerRef = externalRef || internalRef;

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadProgress, setLoadProgress] = useState<number>(0);
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const el = viewerRef.current;
    if (!el) return;

    setIsLoading(true);
    setHasError(false);
    setLoadProgress(0);

    const handleProgress = (event: any) => {
      const progress = Math.round((event.detail?.totalProgress || 0) * 100);
      setLoadProgress(progress);
    };

    const handleLoad = () => {
      setIsLoading(false);
      setHasError(false);
    };

    const handleError = (event: any) => {
      setIsLoading(false);
      setHasError(true);
      setErrorMessage(
        event?.detail?.type === 'loadfailure'
          ? 'Gagal memuat model 3D. Format tidak didukung atau berkas belum tersedia.'
          : 'Terjadi kendala saat memuat berkas model 3D.'
      );
    };

    const handleArStatus = (event: any) => {
      const status = event.detail?.status;
      if (onArStatusChange) {
        onArStatusChange(status);
      }
    };

    el.addEventListener('progress', handleProgress);
    el.addEventListener('load', handleLoad);
    el.addEventListener('error', handleError);
    el.addEventListener('ar-status', handleArStatus);

    return () => {
      el.removeEventListener('progress', handleProgress);
      el.removeEventListener('load', handleLoad);
      el.removeEventListener('error', handleError);
      el.removeEventListener('ar-status', handleArStatus);
    };
  }, [src, viewerRef, onArStatusChange]);

  return (
    <div className={`relative w-full h-full flex items-center justify-center overflow-hidden ${className}`}>
      {/* 3D Model Viewer Web Component */}
      <model-viewer
        ref={viewerRef}
        src={src}
        ios-src={iosSrc}
        alt={alt}
        poster={poster}
        loading="lazy"
        reveal="auto"
        ar={ar}
        ar-modes="webxr scene-viewer quick-look"
        ar-scale="auto"
        camera-controls={cameraControls}
        auto-rotate={autoRotate}
        shadow-intensity="1.2"
        shadow-softness="0.8"
        exposure="1.0"
        touch-action="pan-y"
        style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}
      >
        {/* Custom AR Launch button (can be slotted) */}
        <button
          slot="ar-button"
          className="hidden"
          id="default-ar-button"
          aria-label="Lihat dalam AR"
        >
          AR
        </button>

        {/* Loading Poster Slot */}
        <div slot="poster" className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
          {poster ? (
            <img src={poster} alt={alt} className="w-48 h-48 object-cover rounded-2xl opacity-60 filter blur-sm" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-slate-800/40 flex items-center justify-center text-slate-400">
              <Eye className="w-10 h-10 animate-pulse" />
            </div>
          )}
        </div>
      </model-viewer>

      {/* Loading Progress Indicator Overlay */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/60 backdrop-blur-sm pointer-events-none transition-opacity duration-300">
          <div className="flex flex-col items-center p-6 rounded-2xl bg-slate-900/90 border border-slate-700/60 shadow-xl max-w-xs text-center text-white">
            <Loader2 className="w-10 h-10 text-emerald-400 animate-spin mb-3" />
            <h4 className="text-sm font-semibold tracking-wide">Memuat Model 3D</h4>
            <p className="text-xs text-slate-300 mt-1">Mengunduh aset satwa untuk pengalaman WebAR...</p>
            {loadProgress > 0 && (
              <div className="w-full mt-4">
                <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${loadProgress}%` }}
                  />
                </div>
                <span className="text-[11px] text-slate-400 mt-1.5 block">{loadProgress}%</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error / Fallback State */}
      {hasError && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 bg-slate-950/85 backdrop-blur-md text-center text-white">
          <div className="p-4 rounded-full bg-red-900/40 border border-red-500/30 text-red-400 mb-4">
            <AlertCircle className="w-10 h-10" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">Model 3D Belum Tersedia</h3>
          <p className="text-xs text-slate-300 max-w-xs leading-relaxed mb-5">
            {errorMessage || 'Aset 3D untuk satwa ini sedang disiapkan oleh tim Assets. Model alternatif atau placeholder dapat digunakan.'}
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (viewerRef.current) {
                  viewerRef.current.src = src;
                }
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg transition active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Coba Muat Ulang
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelViewer;
