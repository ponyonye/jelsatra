import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import GalleryPage from '@/pages/GalleryPage';
import DetailPage from '@/pages/DetailPage';
import ARViewerPage from '@/pages/ARViewerPage';
import PoCPage from '@/pages/PoCPage';
import CreditsPage from '@/pages/CreditsPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GalleryPage />} />
        <Route path="/satwa/:slug" element={<DetailPage />} />
        <Route path="/satwa/:slug/ar" element={<ARViewerPage />} />
        <Route path="/poc" element={<PoCPage />} />
        <Route path="/kredit" element={<CreditsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
