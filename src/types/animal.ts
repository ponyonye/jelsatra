export type ConservationStatusCode = 'CR' | 'EN' | 'VU' | 'NT' | 'LC';

export interface FunFact {
  id: number;
  text: string;
}

export interface ModelCredits {
  creator: string;
  title: string;
  source: string;
  license: string;
  url?: string;
}

export interface Animal {
  id: string;
  slug: string;
  commonName: string;
  scientificName: string;
  thumbnail: string;
  heroImage: string;
  modelGlb: string;
  modelUsdz?: string;
  habitat: string;
  distribution: string;
  diet: string;
  funFacts: string[];
  conservationStatus: ConservationStatusCode;
  conservationLabel: string;
  protectionStatus: string;
  nationalPriority: boolean;
  audioUrl?: string;
  sources: string[];
  modelCredits?: ModelCredits;
}

export interface TeamMember {
  name: string;
  role: string;
}

export interface DataSource {
  name: string;
  description?: string;
  url?: string;
}

export interface AssetCredit {
  item: string;
  creator: string;
  source: string;
  license: string;
}

export interface CreditsData {
  team: TeamMember[];
  dataSources: DataSource[];
  assetCredits: AssetCredit[];
}
