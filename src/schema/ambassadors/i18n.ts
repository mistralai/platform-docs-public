import type { Lingo } from '@lingo.dev/react';
import {
  AMBASSADOR_BENEFITS,
  AMBASSADOR_RESPONSIBILITIES,
  AMBASSADOR_REQUIREMENTS,
  APPLICATION_CRITERIA,
} from './data';
import type { Benefit, Criterion, Requirement, Responsibility } from './index';

// ------------------------------------------------------------
// Specialties (enum-style). Not yet rendered on the page, but
// wired so future rendering can go through a locale-aware helper.
// ------------------------------------------------------------

export type AmbassadorSpecialty =
  | 'Machine Learning'
  | 'AI Development'
  | 'Community Building'
  | 'Community'
  | 'Innovation'
  | 'Collaboration';

export function ambassadorSpecialty(key: string, l: Lingo): string {
  switch (key as AmbassadorSpecialty) {
    case 'Machine Learning':
      return l.text('Machine Learning', { context: 'Topic area for a Mistral ambassador' });
    case 'AI Development':
      return l.text('AI Development', { context: 'Topic area for a Mistral ambassador' });
    case 'Community Building':
      return l.text('Community Building', { context: 'Topic area for a Mistral ambassador' });
    case 'Community':
      return l.text('Community', { context: 'Topic area for a Mistral ambassador' });
    case 'Innovation':
      return l.text('Innovation', { context: 'Topic area for a Mistral ambassador' });
    case 'Collaboration':
      return l.text('Collaboration', { context: 'Topic area for a Mistral ambassador' });
  }
  return key;
}

// ------------------------------------------------------------
// Benefits / Responsibilities / Requirements / Criteria
// ------------------------------------------------------------

function benefitTitle(id: string, l: Lingo): string {
  switch (id) {
    case 'free-credits':
      return l.text('Free credits', { context: 'Benefit of the Mistral ambassador program' });
    case 'feature-preview':
      return l.text('Feature preview', { context: 'Benefit of the Mistral ambassador program' });
    case 'recognition':
      return l.text('Recognition', { context: 'Benefit of the Mistral ambassador program' });
    case 'vip-experience':
      return l.text('VIP experience', { context: 'Benefit of the Mistral ambassador program' });
  }
  return id;
}

function benefitDescription(id: string, l: Lingo): string {
  switch (id) {
    case 'free-credits':
      return l.text('Mistral Ambassadors will receive free API credits on Studio.', { context: 'Description of a Mistral ambassador program benefit' });
    case 'feature-preview':
      return l.text('Mistral Ambassadors will be part of our early access program, can directly engage with our product teams through feature discussions, and provide valuable feedback to our products.', { context: 'Description of a Mistral ambassador program benefit' });
    case 'recognition':
      return l.text('Public recognition and features on our website and on our Discord.', { context: 'Description of a Mistral ambassador program benefit' });
    case 'vip-experience':
      return l.text('Ambassadors will receive early invites and access to our events and will have a dedicated channel on Discord and Slack to engage with Mistral team members and fellow Ambassadors.', { context: 'Description of a Mistral ambassador program benefit' });
  }
  return '';
}

function responsibilityTitle(id: string, l: Lingo): string {
  switch (id) {
    case 'community-support':
      return l.text('Community Support', { context: 'Responsibility of a Mistral ambassador' });
    case 'content-creation':
      return l.text('Content Creation', { context: 'Responsibility of a Mistral ambassador' });
    case 'feedback-provider':
      return l.text('Feedback Provider', { context: 'Responsibility of a Mistral ambassador' });
    case 'event-participation':
      return l.text('Event Participation', { context: 'Responsibility of a Mistral ambassador' });
  }
  return id;
}

function responsibilityDescription(id: string, l: Lingo): string {
  switch (id) {
    case 'community-support':
      return l.text('Actively participate in community discussions and help fellow developers with Mistral AI questions.', { context: 'Description of a Mistral ambassador responsibility' });
    case 'content-creation':
      return l.text('Create tutorials, blog posts, or other educational content showcasing Mistral AI capabilities.', { context: 'Description of a Mistral ambassador responsibility' });
    case 'feedback-provider':
      return l.text('Provide valuable feedback on new features and help shape the future of Mistral AI products.', { context: 'Description of a Mistral ambassador responsibility' });
    case 'event-participation':
      return l.text('Participate in Mistral AI events, webinars, and community gatherings as a representative.', { context: 'Description of a Mistral ambassador responsibility' });
  }
  return '';
}

function requirementTitle(id: string, l: Lingo): string {
  switch (id) {
    case 'experience':
      return l.text('Technical Experience', { context: 'Requirement for joining the Mistral ambassador program' });
    case 'community-involvement':
      return l.text('Community Involvement', { context: 'Requirement for joining the Mistral ambassador program' });
    case 'communication':
      return l.text('Communication Skills', { context: 'Requirement for joining the Mistral ambassador program' });
    case 'commitment':
      return l.text('Time Commitment', { context: 'Requirement for joining the Mistral ambassador program' });
  }
  return id;
}

function requirementDescription(id: string, l: Lingo): string {
  switch (id) {
    case 'experience':
      return l.text('Demonstrated experience with AI/ML technologies and familiarity with Mistral AI models.', { context: 'Description of a requirement for joining the Mistral ambassador program' });
    case 'community-involvement':
      return l.text('Active participation in AI/ML communities through forums, social media, or open source contributions.', { context: 'Description of a requirement for joining the Mistral ambassador program' });
    case 'communication':
      return l.text('Strong written and verbal communication skills to effectively engage with community members.', { context: 'Description of a requirement for joining the Mistral ambassador program' });
    case 'commitment':
      return l.text('Ability to dedicate time regularly to ambassador activities and community engagement.', { context: 'Description of a requirement for joining the Mistral ambassador program' });
  }
  return '';
}

function criterionTitle(id: string, l: Lingo): string {
  switch (id) {
    case 'passion':
      return l.text('Passion', { context: 'Criterion used to evaluate ambassador applications' });
    case 'expertise':
      return l.text('Expertise', { context: 'Criterion used to evaluate ambassador applications' });
    case 'mistral-advocacy':
      return l.text('Mistral advocacy', { context: 'Criterion used to evaluate ambassador applications' });
    case 'commitment':
      return l.text('Commitment', { context: 'Criterion used to evaluate ambassador applications' });
  }
  return id;
}

function criterionDescription(id: string, l: Lingo): string {
  switch (id) {
    case 'passion':
      return l.text('Genuine passion for Mistral AI.', { context: 'Description of a criterion used to evaluate ambassador applications' });
    case 'expertise':
      return l.text('Knowledge and experience in AI, machine learning, or a related field.', { context: 'Description of a criterion used to evaluate ambassador applications' });
    case 'mistral-advocacy':
      return l.text('Has previously advocated for Mistral AI.', { context: 'Description of a criterion used to evaluate ambassador applications' });
    case 'commitment':
      return l.text('Willingness to commit to the program for at least 6 months.', { context: 'Description of a criterion used to evaluate ambassador applications' });
  }
  return '';
}

export function getAmbassadorBenefits(l: Lingo): Benefit[] {
  return AMBASSADOR_BENEFITS.map(benefit => ({
    id: benefit.id,
    icon: benefit.icon,
    title: benefitTitle(benefit.id, l),
    description: benefitDescription(benefit.id, l),
  }));
}

export function getAmbassadorResponsibilities(l: Lingo): Responsibility[] {
  return AMBASSADOR_RESPONSIBILITIES.map(responsibility => ({
    id: responsibility.id,
    icon: responsibility.icon,
    title: responsibilityTitle(responsibility.id, l),
    description: responsibilityDescription(responsibility.id, l),
  }));
}

export function getAmbassadorRequirements(l: Lingo): Requirement[] {
  return AMBASSADOR_REQUIREMENTS.map(requirement => ({
    id: requirement.id,
    icon: requirement.icon,
    title: requirementTitle(requirement.id, l),
    description: requirementDescription(requirement.id, l),
  }));
}

export function getApplicationCriteria(l: Lingo): Criterion[] {
  return APPLICATION_CRITERIA.map(criterion => ({
    id: criterion.id,
    icon: criterion.icon,
    title: criterionTitle(criterion.id, l),
    description: criterionDescription(criterion.id, l),
  }));
}
