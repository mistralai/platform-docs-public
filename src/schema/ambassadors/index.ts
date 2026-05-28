import {
  AMBASSADORS_DATA,
  APPLICATION_INFO,
  type AmbassadorData,
  type AmbassadorBenefit,
  type AmbassadorResponsibility,
  type AmbassadorRequirement,
  type ApplicationCriterion,
} from './data';

export interface Ambassador {
  id: string;
  name: string;
  image: string | null;
  link: string;
  bio: string;
  specialties: string[];
  social?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
  isPlaceholder?: boolean;
}

export interface Benefit {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Responsibility {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Requirement {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface ApplicationInfo {
  cohort: string;
  deadline: string;
  notification: string;
  frequency: string;
  applicationUrl: string;
  discordUrl: string;
}

export interface Criterion {
  id: string;
  title: string;
  description: string;
  icon: string;
}

// Process ambassador data
const allAmbassadors: Ambassador[] = AMBASSADORS_DATA.map(ambassador => ({
  ...ambassador,
  image: ambassador.image,
  specialties: [...ambassador.specialties],
  social: 'social' in ambassador ? ambassador.social : undefined,
  isPlaceholder:
    'isPlaceholder' in ambassador ? ambassador.isPlaceholder : false,
}));

export const currentAmbassadors = allAmbassadors.filter(
  ambassador => !ambassador.isPlaceholder
);

export const placeholderAmbassador = allAmbassadors.find(
  ambassador => ambassador.isPlaceholder
);

export const applicationInfo: ApplicationInfo = {
  ...APPLICATION_INFO,
};

// Locale-aware getters (titles + descriptions)
export {
  getAmbassadorBenefits,
  getAmbassadorResponsibilities,
  getAmbassadorRequirements,
  getApplicationCriteria,
  ambassadorSpecialty,
} from './i18n';

// Export types from data
export type {
  AmbassadorData,
  AmbassadorBenefit,
  AmbassadorResponsibility,
  AmbassadorRequirement,
  ApplicationCriterion,
};
