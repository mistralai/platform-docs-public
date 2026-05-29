'use client';

import * as React from 'react';
import { useLingo } from '@lingo.dev/react';
import { Badge } from '@/components/ui/badge';

export function Tag({
  model,
  api,
  other,
  deprecated,
  fixed,
  security,
  children,
  ...props
}: {
  model?: boolean;
  api?: boolean;
  other?: boolean;
  deprecated?: boolean;
  fixed?: boolean;
  security?: boolean;
  children?: React.ReactNode;
}) {
  const l = useLingo();
  let variant:
    | 'model'
    | 'api'
    | 'other'
    | 'deprecated'
    | 'fixed'
    | 'security'
    | undefined;
  let text = '';

  if (model) {
    variant = 'model';
    text = l.text('MODEL RELEASED', { context: 'Changelog entry badge indicating a new model was released' });
  } else if (api) {
    variant = 'api';
    text = l.text('API UPDATED', { context: 'Changelog entry badge indicating an API change' });
  } else if (other) {
    variant = 'other';
    text = l.text('OTHER', { context: 'Changelog entry badge for miscellaneous changes' });
  } else if (deprecated) {
    variant = 'deprecated';
    text = l.text('DEPRECATED', { context: 'Changelog entry badge indicating something was deprecated' });
  } else if (fixed) {
    variant = 'fixed';
    text = l.text('FIXED', { context: 'Changelog entry badge indicating a bug fix' });
  } else if (security) {
    variant = 'security';
    text = l.text('SECURITY', { context: 'Changelog entry badge indicating a security-related change' });
  }

  return (
    <Badge variant={variant} size="sm" {...props}>
      {text || children}
    </Badge>
  );
}
