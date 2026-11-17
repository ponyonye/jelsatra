import React from 'react';
import { ConservationStatusCode } from '@/types/animal';

interface ConservationBadgeProps {
  status: ConservationStatusCode;
  showFullLabel?: boolean;
  className?: string;
}

const statusConfig: Record<
  ConservationStatusCode,
  { label: string; code: string; bgClass: string; textClass: string; borderClass: string }
> = {
  CR: {
    label: 'Critically Endangered (Kritis)',
    code: 'CR',
    bgClass: 'bg-red-600',
    textClass: 'text-white',
    borderClass: 'border-red-700'
  },
  EN: {
    label: 'Endangered (Terancam)',
    code: 'EN',
    bgClass: 'bg-orange-600',
    textClass: 'text-white',
    borderClass: 'border-orange-700'
  },
  VU: {
    label: 'Vulnerable (Rentan)',
    code: 'VU',
    bgClass: 'bg-amber-500',
    textClass: 'text-white',
    borderClass: 'border-amber-600'
  },
  NT: {
    label: 'Near Threatened (Hampir Terancam)',
    code: 'NT',
    bgClass: 'bg-lime-600',
    textClass: 'text-white',
    borderClass: 'border-lime-700'
  },
  LC: {
    label: 'Least Concern (Risiko Rendah)',
    code: 'LC',
    bgClass: 'bg-emerald-600',
    textClass: 'text-white',
    borderClass: 'border-emerald-700'
  }
};

export const ConservationBadge: React.FC<ConservationBadgeProps> = ({
  status,
  showFullLabel = false,
  className = ''
}) => {
  const config = statusConfig[status] || statusConfig.VU;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold shadow-sm ${config.bgClass} ${config.textClass} ${className}`}
      title={config.label}
    >
      <span className="font-extrabold tracking-wide mr-1">{config.code}</span>
      <span>•</span>
      <span className="ml-1 truncate">{showFullLabel ? config.label : config.code}</span>
    </span>
  );
};

export const StatusPills: React.FC<{
  protectionStatus?: string;
  nationalPriority?: boolean;
  conservationStatus?: ConservationStatusCode;
}> = ({
  protectionStatus = 'Satwa dilindungi',
  nationalPriority = true,
  conservationStatus = 'EN'
}) => {
  return (
    <div className="flex flex-wrap items-center gap-1.5 my-1.5">
      {protectionStatus && (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-800 text-white shadow-sm">
          {protectionStatus}
        </span>
      )}
      {nationalPriority && (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-red-600 text-white shadow-sm">
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

