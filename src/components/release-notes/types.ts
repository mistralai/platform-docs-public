export type ReleaseNoteType =
  | 'Improvement'
  | 'Feature'
  | 'Fix'
  | 'Deprecation'
  | 'Security'
  | 'Other'
  | 'Amélioration';

export type ReleaseNoteAvailability = string;

export type ReleaseNoteArea =
  | 'Vibe Work'
  | 'Vibe Code'
  | 'Studio'
  | 'API'
  | 'Models'
  | 'Cloud';

export type ReleaseNote = {
  title: string;
  date: string;
  type: ReleaseNoteType;
  area: ReleaseNoteArea;
  availability: ReleaseNoteAvailability;
  hosting: string;
  summary: string;
  whatsNew: string;
  keyCapabilities: string[];
  getStarted?: {
    label: string;
    href?: {
      label: string;
      url: string;
    } | null;
  };
  media?: {
    type: 'image';
    url: string;
    alt?: string;
  };
};
