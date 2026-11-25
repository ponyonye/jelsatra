import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import animalsData from '@/data/animals.json';
import { Animal } from '@/types/animal';
import CameraARViewer from '@/ar/CameraARViewer';

export const ARViewerPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const animals: Animal[] = animalsData as Animal[];
  const animal = animals.find((a) => a.slug === slug);

  if (!animal) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-lg font-bold">Satwa Tidak Ditemukan</h2>
        <p className="text-xs text-slate-400 mt-1 mb-4">
          Data satwa yang dituju tidak ditemukan.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-semibold shadow active:scale-95 transition cursor-pointer"
        >
          Kembali ke Galeri
        </button>
      </div>
    );
  }

  return (
    <CameraARViewer
      animal={animal}
      onClose={() => navigate(`/satwa/${animal.slug}`)}
      showNativeARButton={true}
    />
  );
};

export default ARViewerPage;
