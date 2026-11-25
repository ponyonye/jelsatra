export type ConservationStatusCode = 'CR' | 'EN' | 'VU' | 'NT' | 'LC';

export interface FunFact {
  id: number;
  text: string;
}

export interface LicenseInfo {
  status: 'active' | 'undecided' | 'pending_approval' | 'decided';
  name: string | null;
  copyright?: string;
  note?: string;
  documentUrl?: string;
}

export interface ModelCredits {
  creator: string;
  title: string;
  software?: string;
  source: string;
  license: string | LicenseInfo;
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
  modelOrientation?: string;
  initialCameraOrbit?: string;
  habitat: string;
  distribution: string;
  habitatDistributionText?: string;
  diet: string;
  funFacts: string[];
  funFactNarrative?: string;
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

export interface Model3DCredit {
  animalName: string;
  slug: string;
  title: string;
  creator: string;
  software: string;
  source: string;
  assetPath: string;
  license: LicenseInfo;
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
  models3d: Model3DCredit[];
  assetCredits: AssetCredit[];
}

