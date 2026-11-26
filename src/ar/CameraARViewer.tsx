import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  ChevronLeft,
  Camera,
  CameraOff,
  RefreshCw,
  RotateCcw,
  Volume2,
  Move,
  ZoomIn,
  AlertCircle,
  Loader2,
  FlipHorizontal,
  Sparkles,
  Box
} from 'lucide-react';
import { Animal } from '@/types/animal';
import { ConservationBadge } from '@/components/common/ConservationBadge';
import ModelViewer from './ModelViewer';

interface CameraARViewerProps {
  animal: Animal;
  onClose: () => void;
  showNativeARButton?: boolean;
}

export const CameraARViewer: React.FC<CameraARViewerProps> = ({
  animal,
  onClose,
  showNativeARButton = true
}) => {
  const viewerRef = useRef<any>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Camera stream state - defaults to inactive Fallback 3D Mode until user explicitly starts webcam
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [isCameraLoading, setIsCameraLoading] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string>('');
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [currentDeviceIndex, setCurrentDeviceIndex] = useState<number>(0);
  const [isMirrored, setIsMirrored] = useState<boolean>(true);
  const [showFloorReticle, setShowFloorReticle] = useState<boolean>(true);

  // Model & Audio state
  const [scaleMultiplier, setScaleMultiplier] = useState<number>(1.0);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [audioNotice, setAudioNotice] = useState<string>('');
  const [canActivateNativeAR, setCanActivateNativeAR] = useState<boolean>(false);

  /**
   * Stop active media tracks to immediately turn off physical camera hardware LED.
   */
  const stopWebcam = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (e) {
          console.warn('Track stop error:', e);
        }
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  }, []);

  /**
   * Request laptop webcam or device camera stream via getUserMedia.
   */
  const startWebcam = useCallback(
    async (preferredDeviceId?: string) => {
      try {
        setIsCameraLoading(true);
        setCameraError('');

        stopWebcam();

        const constraints: MediaStreamConstraints = {
          video: preferredDeviceId
            ? { deviceId: { exact: preferredDeviceId } }
            : {
                facingMode: { ideal: 'user' },
                width: { ideal: 1920 },
                height: { ideal: 1080 }
              },
          audio: false
        };

        let stream: MediaStream;
        try {
          stream = await navigator.mediaDevices.getUserMedia(constraints);
        } catch {
          // Fallback to basic unconstrained video if resolution constraints fail
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        }

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          try {
            await videoRef.current.play();
          } catch (playErr) {
            console.warn('Video play error:', playErr);
          }
        }

        setIsCameraActive(true);
        setIsCameraLoading(false);

        // Enumerate video devices to support switching if multiple cameras exist
        if (navigator.mediaDevices?.enumerateDevices) {
          try {
            const allDevices = await navigator.mediaDevices.enumerateDevices();
            const inputs = allDevices.filter((d) => d.kind === 'videoinput');
            setVideoDevices(inputs);

            // Determine if the stream is using front/user or environment camera
            const activeTrack = stream.getVideoTracks()[0];
            const settings = activeTrack?.getSettings?.();
            if (settings?.facingMode === 'environment') {
              setIsMirrored(false);
            }
          } catch (devErr) {
            console.warn('enumerateDevices error:', devErr);
          }
        }
      } catch (err: any) {
        console.warn('getUserMedia error:', err);
        setIsCameraLoading(false);
        setIsCameraActive(false);

        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setCameraError(
            'Izin akses kamera browser ditolak. Mohon izinkan akses kamera pada pengaturan browser untuk melihat satwa di ruangan Anda.'
          );
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          setCameraError('Tidak ditemukan perangkat kamera pada laptop/komputer Anda.');
        } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
          setCameraError('Kamera sedang digunakan oleh aplikasi lain (seperti Zoom, Teams, atau Google Meet). Tutup aplikasi tersebut dan coba lagi.');
        } else {
          setCameraError(err.message || 'Gagal memulai kamera perangkat.');
        }
      }
    },
    [stopWebcam]
  );

  /**
   * Switch between available cameras (e.g. laptop webcam vs external camera)
   */
  const handleSwitchCamera = useCallback(() => {
    if (videoDevices.length <= 1) return;
    const nextIndex = (currentDeviceIndex + 1) % videoDevices.length;
    setCurrentDeviceIndex(nextIndex);
    const nextDevice = videoDevices[nextIndex];
    startWebcam(nextDevice.deviceId);
  }, [currentDeviceIndex, videoDevices, startWebcam]);

  /**
   * Toggle camera stream on / off
   */
  const handleToggleCamera = useCallback(() => {
    if (isCameraActive) {
      stopWebcam();
    } else {
      startWebcam(videoDevices[currentDeviceIndex]?.deviceId);
    }
  }, [isCameraActive, stopWebcam, startWebcam, videoDevices, currentDeviceIndex]);

  /**
   * Reset 3D model orientation, orbit, and zoom
   */
  const handleResetCamera = useCallback(() => {
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
    setScaleMultiplier(1.0);
  }, [animal]);

  /**
   * Play / Pause animal sound
   */
  const handlePlaySound = useCallback(() => {
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
          setAudioNotice(`Berkas audio suara ${animal.commonName} belum dapat dimuat.`);
        };
      }

      audioRef.current
        .play()
        .then(() => setIsPlayingAudio(true))
        .catch((err) => {
          console.warn('Audio play error:', err);
          setIsPlayingAudio(false);
        });
    } else {
      setAudioNotice(`Berkas audio suara ${animal.commonName} sedang disiapkan oleh tim Assets.`);
    }
  }, [animal, isPlayingAudio]);

  /**
   * Launch native WebXR / Scene Viewer / Quick Look if supported by device
   */
  const handleLaunchNativeAR = useCallback(() => {
    const viewer = viewerRef.current;
    if (viewer && typeof viewer.activateAR === 'function') {
      try {
        viewer.activateAR();
      } catch (err) {
        console.warn('Native AR activation error:', err);
      }
    }
  }, []);

  // Setup keyboard shortcuts and cleanup media tracks on unmount
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      stopWebcam();
      window.removeEventListener('keydown', handleKeyDown);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [stopWebcam, onClose]);

  const modelSource = animal.modelGlb || '/models/poc-sample.glb';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col justify-between overflow-hidden select-none">
      {/* 1. Live Laptop Webcam Stream Background */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-500 ${
          isCameraActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        style={{
          transform: isMirrored ? 'scaleX(-1)' : 'none'
        }}
      />

      {/* 2. Studio Dark Background Vignette (Visible when camera is off or loading) */}
      {!isCameraActive && (
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 flex flex-col items-center justify-center pointer-events-none">
          <div className="w-[500px] h-[500px] rounded-full bg-emerald-950/20 blur-3xl" />
        </div>
      )}

      {/* 3. 3D Visual Placement Guide Reticle (Visual guide only, not physical plane detection) */}
      {showFloorReticle && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
          <div
            className="w-72 h-72 sm:w-96 sm:h-96 rounded-full border-2 border-dashed flex items-center justify-center transition-all duration-500"
            style={{
              transform: 'perspective(700px) rotateX(68deg) translateY(135px)',
              borderColor: isCameraActive ? 'rgba(52, 211, 153, 0.7)' : 'rgba(148, 163, 184, 0.35)',
              boxShadow: isCameraActive
                ? '0 0 50px rgba(16, 185, 129, 0.35), inset 0 0 35px rgba(16, 185, 129, 0.2)'
                : '0 0 30px rgba(51, 65, 85, 0.25)'
            }}
          >
            <div
              className="w-52 h-52 sm:w-68 sm:h-68 rounded-full border flex items-center justify-center transition-colors duration-500"
              style={{
                borderColor: isCameraActive ? 'rgba(110, 231, 183, 0.5)' : 'rgba(100, 116, 139, 0.3)'
              }}
            >
              <div
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border flex items-center justify-center transition-colors duration-500"
                style={{
                  borderColor: isCameraActive ? 'rgba(167, 243, 208, 0.4)' : 'rgba(71, 85, 105, 0.25)'
                }}
              >
                <div
                  className={`w-3 h-3 rounded-full ${
                    isCameraActive ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Top Header HUD Bar */}
      <header className="relative z-30 flex items-center justify-between px-4 py-3 safe-top bg-slate-950/75 backdrop-blur-md border-b border-slate-800/80">
        {/* Back Button */}
        <button
          onClick={onClose}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/90 hover:bg-slate-700 text-xs font-semibold text-white border border-slate-700 shadow-md backdrop-blur active:scale-95 transition cursor-pointer"
          aria-label="Tutup Tampilan AR"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>

        {/* Central Status Badge */}
        <div className="flex items-center gap-2">
          {isCameraLoading ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700 text-slate-300 text-[11px] font-medium backdrop-blur shadow-md">
              <Loader2 className="w-3 h-3 text-emerald-400 animate-spin" />
              <span>Menghubungkan Kamera...</span>
            </div>
          ) : isCameraActive ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/90 border border-emerald-500/60 text-emerald-300 text-[11px] font-semibold backdrop-blur shadow-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Kamera Overlay (Eksperimental)</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700 text-slate-300 text-[11px] font-medium backdrop-blur shadow-md">
              <Box className="w-3 h-3 text-emerald-400" />
              <span>Mode 3D Interaktif (Fallback)</span>
            </div>
          )}
        </div>

        {/* Right Action Icons: Camera Toggle, Switch Camera, Mirror Toggle */}
        <div className="flex items-center gap-1.5">
          {/* Explicit User Toggle: Camera Overlay */}
          <button
            onClick={handleToggleCamera}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold shadow-md backdrop-blur active:scale-95 transition cursor-pointer ${
              isCameraActive
                ? 'bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 border-emerald-600/70'
                : 'bg-slate-800/90 hover:bg-slate-700 text-slate-200 border-slate-600'
            }`}
            title={isCameraActive ? 'Matikan Kamera (Kembali ke Mode 3D Studio)' : 'Aktifkan Kamera Laptop (Mode Overlay Eksperimental)'}
            aria-label={isCameraActive ? 'Matikan Kamera Laptop' : 'Aktifkan Kamera Laptop'}
          >
            {isCameraActive ? (
              <>
                <CameraOff className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden sm:inline">Matikan Kamera</span>
              </>
            ) : (
              <>
                <Camera className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Kamera Laptop</span>
              </>
            )}
          </button>

          {/* Switch Camera if multiple cameras detected */}
          {videoDevices.length > 1 && (
            <button
              onClick={handleSwitchCamera}
              className="p-2 rounded-full bg-slate-800/90 hover:bg-slate-700 text-white border border-slate-700 shadow-md backdrop-blur active:scale-95 transition cursor-pointer"
              title="Ganti Perangkat Kamera"
              aria-label="Ganti Perangkat Kamera"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}

          {/* Mirror Flip Toggle */}
          {isCameraActive && (
            <button
              onClick={() => setIsMirrored((prev) => !prev)}
              className={`p-2 rounded-full border text-xs font-semibold shadow-md backdrop-blur active:scale-95 transition cursor-pointer ${
                isMirrored
                  ? 'bg-slate-800/90 text-emerald-300 border-emerald-600/60'
                  : 'bg-slate-900/90 text-slate-400 border-slate-800'
              }`}
              title={isMirrored ? 'Cermin Aktif (Klik untuk membalik)' : 'Cermin Mati'}
              aria-label="Balik Cermin Kamera"
            >
              <FlipHorizontal className="w-4 h-4" />
            </button>
          )}

          {/* Native Mobile WebXR AR Button (If device supports it) */}
          {showNativeARButton && canActivateNativeAR && (
            <button
              onClick={handleLaunchNativeAR}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md active:scale-95 transition cursor-pointer"
              title="Buka Google Scene Viewer / Quick Look"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">AR Native</span>
            </button>
          )}
        </div>
      </header>

      {/* 5. Camera Permission Notice / Error Banner */}
      {cameraError && (
        <div className="relative z-30 mx-4 mt-2 max-w-lg mx-auto w-full">
          <div className="p-3 rounded-2xl bg-amber-950/90 border border-amber-500/50 text-amber-200 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xl backdrop-blur-md">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-100">Kamera Belum Aktif</p>
                <p className="text-[11px] text-amber-300/90 leading-relaxed mt-0.5">{cameraError}</p>
              </div>
            </div>
            <button
              onClick={() => startWebcam()}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shrink-0 self-end sm:self-auto cursor-pointer shadow active:scale-95 transition"
            >
              Coba Akses Kamera
            </button>
          </div>
        </div>
      )}

      {/* 6. Audio Notification Banner */}
      {audioNotice && (
        <div className="relative z-30 mx-4 mt-2 max-w-md mx-auto w-full">
          <div className="p-2.5 rounded-xl bg-amber-950/90 border border-amber-500/50 text-amber-200 text-xs flex items-center justify-between gap-2 shadow-lg backdrop-blur">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 shrink-0 text-amber-400" />
              <span className="text-[11px]">{audioNotice}</span>
            </div>
            <button
              onClick={() => setAudioNotice('')}
              className="text-amber-300 hover:text-white text-xs px-1.5 py-0.5 rounded cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* 7. Mouse & Touch Gesture Hints Pill */}
      <div className="relative z-30 mx-auto px-4 w-full max-w-md mt-2">
        <div className="flex items-center justify-center gap-3 py-1.5 px-3 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-800 text-[11px] text-slate-300 shadow-lg">
          <div className="flex items-center gap-1.5">
            <Move className="w-3.5 h-3.5 text-emerald-400" />
            <span>Geser mouse untuk memutar</span>
          </div>
          <span className="text-slate-600">•</span>
          <div className="flex items-center gap-1.5">
            <ZoomIn className="w-3.5 h-3.5 text-emerald-400" />
            <span>Scroll roda mouse untuk zoom</span>
          </div>
        </div>
      </div>

      {/* 8. Scale Size Controls & Target Toggle */}
      <div className="relative z-30 mx-auto px-4 w-full max-w-md mt-1.5 flex items-center justify-center gap-2 text-[11px]">
        <div className="flex items-center gap-1 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-800">
          <span className="text-slate-400 font-medium mr-1">Skala Satwa:</span>
          {[0.75, 1.0, 1.25, 1.5].map((scale) => (
            <button
              key={scale}
              onClick={() => setScaleMultiplier(scale)}
              className={`px-2 py-0.5 rounded-md font-bold transition cursor-pointer text-[10px] ${
                scaleMultiplier === scale
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              {scale}x
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowFloorReticle((prev) => !prev)}
          className={`px-2.5 py-1 rounded-full border text-[10px] font-medium backdrop-blur-md transition cursor-pointer ${
            showFloorReticle
              ? 'bg-slate-900/90 text-emerald-300 border-emerald-600/50'
              : 'bg-slate-950/80 text-slate-400 border-slate-800'
          }`}
          title="Tampilkan / Sembunyikan Retikel Panduan Posisi Visual (Bukan Deteksi Lantai Fisik)"
        >
          {showFloorReticle ? 'Panduan Visual: On' : 'Panduan: Off'}
        </button>
      </div>

      {/* 9. Central 3D Model Viewer Layer (Transparent background superimposed over webcam) */}
      <main className="relative flex-1 w-full h-full flex items-center justify-center z-20">
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
          scale={`${scaleMultiplier} ${scaleMultiplier} ${scaleMultiplier}`}
          showArButton={false}
          orientation={animal.modelOrientation}
          cameraOrbit={animal.initialCameraOrbit}
          onLoad={() => {
            if (viewerRef.current?.canActivateAR) {
              setCanActivateNativeAR(true);
            }
          }}
          className="w-full h-full"
        />
      </main>

      {/* 10. Bottom Controls & Satwa Info Card */}
      <footer className="relative z-30 px-4 pb-4 safe-bottom flex flex-col gap-2.5 max-w-md mx-auto w-full">
        {/* Action Buttons: Reset Posisi & Suara Satwa */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleResetCamera}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-700 bg-slate-900/90 hover:bg-slate-800 text-slate-100 text-xs font-semibold shadow-lg backdrop-blur active:scale-95 transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-slate-300" />
            <span>Reset Posisi</span>
          </button>

          <button
            onClick={handlePlaySound}
            className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold shadow-lg backdrop-blur active:scale-95 transition cursor-pointer ${
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

        {/* Animal Identification Card */}
        <div className="bg-slate-950/85 backdrop-blur-md text-white rounded-2xl p-3.5 shadow-2xl border border-slate-800 flex items-center justify-between">
          <div className="text-left">
            <h2 className="text-sm font-extrabold tracking-tight text-white">
              {animal.commonName}
            </h2>
            <p className="text-xs italic text-slate-400 font-medium">
              {animal.scientificName}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {animal.conservationStatus && (
              <ConservationBadge status={animal.conservationStatus} showFullLabel={false} />
            )}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CameraARViewer;
