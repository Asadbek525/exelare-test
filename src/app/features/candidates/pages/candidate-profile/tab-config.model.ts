export interface TabConfig {
  id: string;
  label: string;
  visible: boolean;
  order: number;
}

export const DEFAULT_TABS: TabConfig[] = [
  { id: 'resume', label: 'Resume', visible: true, order: 0 },
  { id: 'activities', label: 'Activities', visible: true, order: 1 },
  { id: 'history', label: 'History/Notes/Mails', visible: true, order: 2 },
  { id: 'pipeline', label: 'Pipeline', visible: true, order: 3 },
  { id: 'documents', label: 'Documents', visible: true, order: 4 },
];

export const TABS_STORAGE_KEY = 'candidate-profile-tabs';
