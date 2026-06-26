export interface Student {
  id: string;
  roll: string;
  name: string;
  marks: number;
  tags?: string[];
  notes?: string;
  password?: string;
}

export type ActiveScreen = 'dashboard' | 'students' | 'portal' | 'reports' | 'help';

export interface ChaosMetric {
  title: string;
  value: string | number;
  subtext: string;
  iconName: string;
  color: string;
}

export interface ChaosLog {
  id: string;
  time: string;
  event: string;
  severity: 'mild' | 'moderate' | 'catastrophic';
}
