import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import GalleryPage from '@/pages/GalleryPage';
import { Loader2 } from 'lucide-react';

// Lazy-load secondary pages and AR viewers to prevent downloading 3D chunks on Gallery page
const DetailPage = lazy(() => import('@/pages/DetailPage'));
const ARViewerPage = lazy(() => import('@/pages/ARViewerPage'));
const PoCPage = lazy(() => import('@/pages/PoCPage'));
const CreditsPage = lazy(() => import('@/pages/CreditsPage'));

const PageFallback: React.FC = () => (
  <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white text-center">
    <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mb-3" />
    <p className="text-xs text-slate-300 font-medium">Memuat modul aplikasi...</p>
  </div>
);

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<GalleryPage />} />
          <Route path="/satwa/:slug" element={<DetailPage />} />
          <Route path="/satwa/:slug/ar" element={<ARViewerPage />} />
          <Route path="/poc" element={<PoCPage />} />
          <Route path="/kredit" element={<CreditsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
