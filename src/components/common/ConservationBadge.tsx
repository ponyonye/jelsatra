import React from 'react';
import { ConservationStatusCode } from '@/types/animal';

export interface ConservationBadgeProps {
  status: ConservationStatusCode;
  showFullLabel?: boolean;
  className?: string;
}

export const iucnConfig: Record<
  ConservationStatusCode,
  {
    code: ConservationStatusCode;
    nameId: string;
    nameEn: string;
    bgClass: string;
    borderClass: string;
    textClass: string;
    description: string;
  }
> = {
  CR: {
    code: 'CR',
    nameId: 'Kritis',
    nameEn: 'Critically Endangered',
    bgClass: 'bg-red-600',
    borderClass: 'border-red-700',
    textClass: 'text-white',
    description: 'Menghadapi risiko kepunahan yang sangat tinggi di alam liar dalam waktu dekat.'
  },
  EN: {
    code: 'EN',
    nameId: 'Terancam',
    nameEn: 'Endangered',
    bgClass: 'bg-orange-600',
    borderClass: 'border-orange-700',
    textClass: 'text-white',
    description: 'Menghadapi risiko kepunahan yang tinggi di alam liar.'
  },
  VU: {
    code: 'VU',
    nameId: 'Rentan',
    nameEn: 'Vulnerable',
    bgClass: 'bg-amber-500',
    borderClass: 'border-amber-600',
    textClass: 'text-slate-950 font-bold',
    description: 'Menghadapi risiko penurunan populasi yang signifikan di alam liar.'
  },
  NT: {
    code: 'NT',
    nameId: 'Hampir Terancam',
    nameEn: 'Near Threatened',
    bgClass: 'bg-lime-600',
    borderClass: 'border-lime-700',
    textClass: 'text-white',
    description: 'Mendekati kualifikasi terancam punah dalam waktu dekat.'
  },
  LC: {
    code: 'LC',
    nameId: 'Risiko Rendah',
    nameEn: 'Least Concern',
    bgClass: 'bg-emerald-600',
    borderClass: 'border-emerald-700',
    textClass: 'text-white',
    description: 'Populasi relatif stabil dan belum berisiko tinggi terhadap kepunahan.'
  }
};

/**
 * Reusable Conservation Badge for IUCN Red List status.
 * Complies with WCAG accessibility by displaying explicit text and code,
 * ensuring colorblind users do not depend solely on color hues.
 */
export const ConservationBadge: React.FC<ConservationBadgeProps> = ({
  status,
  showFullLabel = false,
  className = ''
}) => {
  const config = iucnConfig[status] || iucnConfig.EN;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold shadow-xs select-none ${config.bgClass} ${config.textClass} ${className}`}
      title={`IUCN Red List: ${config.code} - ${config.nameEn} (${config.nameId})`}
      aria-label={`Status Konservasi IUCN ${config.code}: ${config.nameId}`}
    >
      <span className="font-extrabold tracking-wider uppercase px-1 py-0.2 rounded bg-black/20 text-[10px]">
        IUCN {config.code}
      </span>
      <span className="truncate">
        {showFullLabel ? `${config.nameEn} (${config.nameId})` : config.nameId}
      </span>
    </span>
  );
};

/**
 * Helper component rendering national protection status and IUCN status side-by-side,
 * maintaining clear distinction between Indonesian national regulation (Permen LHK)
 * and global scientific conservation status (IUCN).
 */
export const StatusPills: React.FC<{
  protectionStatus?: string;
  nationalPriority?: boolean;
  conservationStatus?: ConservationStatusCode;
  className?: string;
}> = ({
  protectionStatus = 'Satwa dilindungi',
  nationalPriority = true,
  conservationStatus = 'EN',
  className = ''
}) => {
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {protectionStatus && (
        <span
          className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-semibold bg-[#1c6442] text-white shadow-xs"
          title="Status Perlindungan Hukum Republik Indonesia (Permen LHK No. P.106/2018)"
        >
          {protectionStatus}
        </span>
      )}
      {nationalPriority && (
        <span
          className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-semibold bg-[#dc2626] text-white shadow-xs"
          title="Satwa Prioritas Konservasi Nasional (Bappenas / Renstra KLHK)"
        >
          Prioritas konservasi nasional
        </span>
      )}
      {conservationStatus && (
        <ConservationBadge status={conservationStatus} showFullLabel={false} />
      )}
    </div>
  );
};

export default ConservationBadge;
