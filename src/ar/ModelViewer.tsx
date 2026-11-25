import React, { useEffect, useRef, useState } from 'react';
import '@google/model-viewer';
import { Loader2, AlertCircle, RefreshCw, Eye, Sparkles, Smartphone, Check } from 'lucide-react';

interface ModelViewerProps {
  src: string;
  iosSrc?: string;
  alt: string;
  poster?: string;
  autoRotate?: boolean;
  cameraControls?: boolean;
  ar?: boolean;
  arModes?: string;
  arPlacement?: 'floor' | 'wall';
  arScale?: 'auto' | 'fixed';
  showArButton?: boolean;
  showCapabilityBadge?: boolean;
  orientation?: string;
  cameraOrbit?: string;
  minCameraOrbit?: string;
  maxCameraOrbit?: string;
  fieldOfView?: string;
  scale?: string;
  onArStatusChange?: (status: string) => void;
  onLoad?: () => void;
  onError?: (error: string) => void;
  onProgress?: (percent: number) => void;
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
  arModes = 'webxr scene-viewer quick-look',
  arPlacement = 'floor',
  arScale = 'auto',
  showArButton = true,
  showCapabilityBadge = false,
  orientation,
  cameraOrbit,
  minCameraOrbit,
  maxCameraOrbit,
  fieldOfView,
  scale,
  onArStatusChange,
  onLoad,
  onError,
  onProgress,
  className = '',
  modelRef: externalRef
}) => {
  const internalRef = useRef<any>(null);
  const viewerRef = externalRef || internalRef;

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadProgress, setLoadProgress] = useState<number>(0);
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isArSupported, setIsArSupported] = useState<boolean>(false);
  const [arStatus, setArStatus] = useState<string>('not-presenting');

  // Store latest callbacks in a ref to avoid re-subscribing useEffect when callbacks change identity
  const callbacksRef = useRef({ onLoad, onError, onProgress, onArStatusChange });
  useEffect(() => {
    callbacksRef.current = { onLoad, onError, onProgress, onArStatusChange };
  });

  useEffect(() => {
    const el = viewerRef.current;
    if (!el) return;

    const checkArSupport = () => {
      if (el.canActivateAR) {
        setIsArSupported(true);
      }
    };

    const handleProgress = (event: any) => {
      const progress = Math.round((event.detail?.totalProgress || 0) * 100);
      setLoadProgress(progress);
      callbacksRef.current.onProgress?.(progress);

      // If model has finished loading, dismiss loading indicator immediately
      if (el.loaded) {
        setIsLoading(false);
      }
    };

    const handleLoad = () => {
      setIsLoading(false);
      setHasError(false);
      setLoadProgress(100);
      checkArSupport();
      callbacksRef.current.onLoad?.();
    };

    const handleError = (event: any) => {
      setIsLoading(false);
      setHasError(true);
      const msg =
        event?.detail?.type === 'loadfailure'
          ? 'Gagal memuat model 3D. Format berkas tidak didukung atau berkas belum tersedia.'
          : 'Terjadi kendala saat mengunduh berkas model 3D.';
      setErrorMessage(msg);
      callbacksRef.current.onError?.(msg);
    };

    const handleArStatus = (event: any) => {
      const status = event.detail?.status || 'not-presenting';
      setArStatus(status);
      callbacksRef.current.onArStatusChange?.(status);
      if (status === 'failed') {
        setIsArSupported(false);
      }
    };

    // 1. Attach listeners before checking element state to prevent missing events
    el.addEventListener('progress', handleProgress);
    el.addEventListener('load', handleLoad);
    el.addEventListener('error', handleError);
    el.addEventListener('ar-status', handleArStatus);

    // 2. Immediate synchronization with model-viewer's native `loaded` property:
    // If the model is already in browser cache or already loaded, dismiss loading immediately
    if (el.loaded) {
      setIsLoading(false);
      setHasError(false);
      setLoadProgress(100);
      checkArSupport();
      callbacksRef.current.onLoad?.();
    } else {
      setIsLoading(true);
      setHasError(false);
      setLoadProgress(0);
    }

    checkArSupport();

    return () => {
      el.removeEventListener('progress', handleProgress);
      el.removeEventListener('load', handleLoad);
      el.removeEventListener('error', handleError);
      el.removeEventListener('ar-status', handleArStatus);
    };
  }, [src, viewerRef]);

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
        ar-modes={arModes}
        ar-placement={arPlacement}
        ar-scale={arScale}
        camera-controls={cameraControls}
        auto-rotate={autoRotate}
        orientation={orientation}
        camera-orbit={cameraOrbit}
        min-camera-orbit={minCameraOrbit}
        max-camera-orbit={maxCameraOrbit}
        field-of-view={fieldOfView}
        scale={scale}
        shadow-intensity="1.5"
        shadow-softness="0.7"
        exposure="1.0"
        touch-action="pan-y"
        style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}
      >
        {/* Official slot="ar-button": Model Viewer manages activation and platform display */}
        <button
          slot="ar-button"
          id="native-ar-button"
          className={
            showArButton
              ? "absolute bottom-3 right-3 z-10 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-700/90 hover:bg-emerald-600 text-white text-xs font-bold shadow-lg backdrop-blur active:scale-95 transition"
              : "hidden"
          }
          aria-label="Lihat dalam Augmented Reality"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
          <span>Lihat AR</span>
        </button>

        {/* Loading Poster Slot: Automatically hidden by model-viewer once the model is rendered */}
        <div slot="poster" className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
          {poster ? (
            <img src={poster} alt={alt} className="w-full h-full object-cover" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-slate-800/40 flex items-center justify-center text-slate-400">
              <Eye className="w-8 h-8 animate-pulse" />
            </div>
          )}
        </div>

        {/* WebXR In-AR Educational HUD DOM Overlay */}
        {(arStatus === 'session-started' || arStatus === 'object-placed') && (
          <div className="absolute top-4 inset-x-4 z-40 pointer-events-none flex flex-col items-center">
            <div className="bg-slate-900/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-700/80 shadow-2xl text-center text-white pointer-events-auto max-w-xs animate-in fade-in duration-200">
              <div className="flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-white">{alt}</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                {arStatus === 'object-placed'
                  ? 'Satwa berhasil ditempatkan! Anda dapat menggeser untuk memindahkan, memutar, atau mencubit untuk zoom.'
                  : 'Arahkan kamera ke permukaan lantai atau meja datar hingga satwa muncul...'}
              </p>
            </div>
          </div>
        )}
      </model-viewer>

      {/* Optional AR Capability Indicator Badge */}
      {showCapabilityBadge && (
        <div className="absolute top-3 left-4 z-10 pointer-events-none">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold backdrop-blur shadow-sm ${
              isArSupported
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/60'
                : 'bg-slate-950/80 text-slate-300 border border-slate-700/60'
            }`}
          >
            {isArSupported ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span>AR Siap (WebXR/Scene Viewer)</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3 h-3 text-slate-400" />
                <span>Mode 3D Interaktif</span>
              </>
            )}
          </span>
        </div>
      )}

      {/*
        Compact, Non-Intrusive Loading Indicator:
        Appears ONLY while the model is actively downloading.
        Positioned as a sleek badge in top-left so it NEVER dims, blurs, or covers the 3D model.
        Instantly disappears upon model load.
      */}
      {isLoading && !hasError && (
        <div className="absolute top-3 left-3 z-20 pointer-events-none transition-opacity duration-200">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/85 backdrop-blur-sm border border-slate-700/60 shadow-md text-white">
            <Loader2 className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
            <span className="text-[11px] font-medium text-slate-200">
              Memuat 3D{loadProgress > 0 && loadProgress < 100 ? ` (${loadProgress}%)` : '...'}
            </span>
          </div>
        </div>
      )}

      {/* Error / Fallback State: Visible only when model loading fails */}
      {hasError && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 bg-slate-950/90 backdrop-blur-md text-center text-white">
          <div className="p-3.5 rounded-full bg-red-900/40 border border-red-500/30 text-red-400 mb-3">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h3 className="text-sm font-bold text-white mb-1.5">Model 3D Belum Tersedia</h3>
          <p className="text-xs text-slate-300 max-w-xs leading-relaxed mb-4">
            {errorMessage || 'Aset 3D untuk satwa ini sedang disiapkan oleh tim Assets. Model alternatif atau placeholder dapat digunakan.'}
          </p>
          <button
            onClick={() => {
              if (viewerRef.current) {
                viewerRef.current.src = src;
              }
            }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg transition active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Coba Muat Ulang
          </button>
        </div>
      )}
    </div>
  );
};

export default ModelViewer;
