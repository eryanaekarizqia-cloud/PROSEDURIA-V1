/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type GameStage =
  | 'OPENING'
  | 'WORLD_MAP'
  | 'LEMBAH_INFORMASI'
  | 'MISSION_01'
  | 'SEQUENCE_PUZZLE'
  | 'PROCEDURE_GLITCH'
  | 'EVIDENCE_BOARD'
  | 'REPAIR'
  | 'TEST'
  | 'REWARD'
  | 'PROCEDURE_FORGE'
  | 'MASTERY'
  | 'FINAL_CASE';

export interface StageMetadata {
  id: GameStage;
  number: number;
  label: string;
  bloomLevel: string;
  bloomTaxonomy: 'C1' | 'C2' | 'C3' | 'C4' | 'C5' | 'C6' | 'PROLOGUE' | 'HUB' | 'SPECIAL';
  subtitle: string;
  iconName: string;
  accentColor: string;
}

export const STAGE_CONFIGS: StageMetadata[] = [
  {
    id: 'OPENING',
    number: 1,
    label: 'Prolog Aksara',
    bloomLevel: 'Prologue',
    bloomTaxonomy: 'PROLOGUE',
    subtitle: 'Awakening & Orientasi',
    iconName: 'Sparkles',
    accentColor: '#00F2FE',
  },
  {
    id: 'WORLD_MAP',
    number: 2,
    label: 'Peta Benua',
    bloomLevel: 'World Hub',
    bloomTaxonomy: 'HUB',
    subtitle: 'Navigasi Zona Nusantara',
    iconName: 'Map',
    accentColor: '#D4AF37',
  },
  {
    id: 'LEMBAH_INFORMASI',
    number: 3,
    label: 'Lembah Informasi',
    bloomLevel: 'C1 Mengingat & C2 Memahami',
    bloomTaxonomy: 'C2',
    subtitle: 'Struktur & Ciri Kebahasaan',
    iconName: 'Compass',
    accentColor: '#00F2FE',
  },
  {
    id: 'MISSION_01',
    number: 4,
    label: 'Briefing Misi',
    bloomLevel: 'C2 Memahami Konteks',
    bloomTaxonomy: 'C2',
    subtitle: 'Deteksi Krisis Protokol Reaktor',
    iconName: 'FileText',
    accentColor: '#FFE082',
  },
  {
    id: 'SEQUENCE_PUZZLE',
    number: 5,
    label: 'Urutan Logis',
    bloomLevel: 'C3 Menerapkan (Applying)',
    bloomTaxonomy: 'C3',
    subtitle: 'Susun Runtun Konjungsi Kronologis',
    iconName: 'Layers',
    accentColor: '#38BDF8',
  },
  {
    id: 'PROCEDURE_GLITCH',
    number: 6,
    label: 'Deteksi Glitch',
    bloomLevel: 'C4 Menganalisis (Analyzing)',
    bloomTaxonomy: 'C4',
    subtitle: 'Temukan Kerancuan Kalimat & Ukuran',
    iconName: 'AlertTriangle',
    accentColor: '#F43F5E',
  },
  {
    id: 'EVIDENCE_BOARD',
    number: 7,
    label: 'Papan Bukti',
    bloomLevel: 'C4 Menganalisis Korelasi',
    bloomTaxonomy: 'C4',
    subtitle: 'Hubungkan Kesalahan dengan Kaidah',
    iconName: 'Network',
    accentColor: '#A855F7',
  },
  {
    id: 'REPAIR',
    number: 8,
    label: 'Bengkel Rekonstruksi',
    bloomLevel: 'C5 Mengevaluasi & Memperbaiki',
    bloomTaxonomy: 'C5',
    subtitle: 'Sunting Kalimat Imperatif Baku',
    iconName: 'Wrench',
    accentColor: '#10B981',
  },
  {
    id: 'TEST',
    number: 9,
    label: 'Uji Simulasi',
    bloomLevel: 'C5 Menguji Efektivitas',
    bloomTaxonomy: 'C5',
    subtitle: 'Jalankan Protokol Mesin Reaktor',
    iconName: 'PlayCircle',
    accentColor: '#06B6D4',
  },
  {
    id: 'REWARD',
    number: 10,
    label: 'Selebrasi Relik',
    bloomLevel: 'Achievement',
    bloomTaxonomy: 'SPECIAL',
    subtitle: 'Perolehan Lencana Penyelaras',
    iconName: 'Award',
    accentColor: '#F59E0B',
  },
  {
    id: 'PROCEDURE_FORGE',
    number: 11,
    label: 'Procedure Forge',
    bloomLevel: 'C6 Mencipta (Creating)',
    bloomTaxonomy: 'C6',
    subtitle: 'Rancang Teks Prosedur Orisinal',
    iconName: 'Flame',
    accentColor: '#EC4899',
  },
  {
    id: 'MASTERY',
    number: 12,
    label: 'Evaluasi & Refleksi',
    bloomLevel: 'Mastery Debrief',
    bloomTaxonomy: 'SPECIAL',
    subtitle: 'Laporan Capaian Kompetensi',
    iconName: 'CheckCircle2',
    accentColor: '#10B981',
  },
  {
    id: 'FINAL_CASE',
    number: 13,
    label: 'Kasus Pamungkas',
    bloomLevel: 'Boss Challenge',
    bloomTaxonomy: 'SPECIAL',
    subtitle: 'Protokol Darurat Reaktor Antariksa',
    iconName: 'Zap',
    accentColor: '#E11D48',
  },
];

export interface PlayerStats {
  name: string;
  title: string;
  level: number;
  xp: number;
  nextLevelXp: number;
  accuracyRate: number;
  completedMissions: number;
  badges: string[];
}
