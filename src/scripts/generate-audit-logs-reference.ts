import { execFileSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join } from 'node:path';
import { load } from 'js-yaml';

const ROOT = process.cwd();
const DASHBOARD_REF =
  process.env.DASHBOARD_REF ?? '55e27978c032171155a815eb16e0dec7a50db13c';
const AUDIT_LOGS_DIR = join(
  ROOT,
  'src/content/en/docs/admin/monitor-comply/audit-logs'
);
const OVERVIEW_DIR = join(AUDIT_LOGS_DIR, 'overview');
const ROOT_PAGE = join(AUDIT_LOGS_DIR, 'page.mdx');
const OVERVIEW_PAGE = join(OVERVIEW_DIR, 'page.mdx');
const CATEGORY_FILE = join(AUDIT_LOGS_DIR, '_category_.json');
const OUTPUT_FILE = join(AUDIT_LOGS_DIR, 'reference/page.mdx');
const LOCAL_OPENAPI_FILE = join(ROOT, 'openapi.yaml');
const CATEGORY_CONTENT = `{
  "label": "Audit logs",
  "position": 1,
  "link": "/admin/monitor-comply/audit-logs/overview"
}
`;

const DASHBOARD_FILES = {
  openapi: 'dashboard/specs/openapi-admin.json',
  pythonConstants: 'kazekit/kazekit/enterprise_audit_logs/constants.py',
  typescriptConstants:
    'ts/packages/dashboard-api-client/src/userAdmin/types.ts',
};

type OpenApiSchema = {
  type?: string;
  title?: string;
  description?: string;
  enum?: string[];
  format?: string;
  properties?: Record<string, OpenApiSchema>;
  required?: string[];
  additionalProperties?: OpenApiSchema;
  anyOf?: OpenApiSchema[];
  allOf?: OpenApiSchema[];
  items?: OpenApiSchema;
  $ref?: string;
};

type OpenApiSpec = {
  paths?: Record<string, Record<string, unknown>>;
  components?: {
    schemas?: Record<string, OpenApiSchema>;
  };
};

type AuditLogData = {
  actors: string[];
  events: string[];
  targets: string[];
  fields: FieldRow[];
  filters: FilterRow[];
  source: string;
};

type FieldRow = {
  name: string;
  type: string;
  required: boolean;
  description: string;
};

type FilterRow = {
  name: string;
  type: string;
  defaultValue: string;
  description: string;
};

const FIELD_ORDER = [
  'created_at',
  'actor_type',
  'actor_metadata',
  'event_type',
  'event_metadata',
  'target_type',
  'target_metadata',
  'log_id',
  'organization_uuid',
  'workspace_uuid',
];

const EVENT_GROUPS = [
  {
    title: 'User management events',
    match: (event: string) =>
      event.startsWith('user.') ||
      event.startsWith('organization.') ||
      event.startsWith('workspace.') ||
      event.startsWith('user_group.'),
  },
  {
    title: 'Billing events',
    match: (event: string) => event.startsWith('billing.'),
  },
  {
    title: 'le Chat events',
    match: (event: string) => event.startsWith('le_chat.'),
  },
  {
    title: 'Studio events',
    match: (event: string) =>
      event.startsWith('admin_api_key.') ||
      event.startsWith('api_key.') ||
      event.startsWith('secret_store.') ||
      event.startsWith('agent.') ||
      event.startsWith('skill.') ||
      event.startsWith('prompt.') ||
      event.startsWith('custom_voice.') ||
      event.startsWith('feature_permission.') ||
      event.startsWith('la_plateforme.'),
  },
  {
    title: 'Jobs and files events',
    match: (event: string) =>
      event.startsWith('fine_tuning_job.') ||
      event.startsWith('batch_job.') ||
      event.startsWith('data_capture.') ||
      event.startsWith('dataset.'),
  },
  {
    title: 'Library and integration events',
    match: (event: string) =>
      event.startsWith('library.') ||
      event.startsWith('integration.') ||
      event.startsWith('indexing.') ||
      event.startsWith('connection.') ||
      event.startsWith('connectors_gateway.') ||
      event.startsWith('crawler.'),
  },
];

const ACTOR_DESCRIPTIONS: Record<string, string> = {
  HUMAN:
    'A person performed the action in the dashboard, Studio, le Chat, or an authenticated product surface.',
  API_KEY: 'An API key performed the action.',
  OTHER:
    'A system process, external system, or Mistral staff operation performed the action.',
};

const TARGET_DESCRIPTIONS: Record<string, string> = {
  USER: 'A user account.',
  USER_GROUP: 'A user group used for access management.',
  ORGANIZATION: 'An Organization.',
  WORKSPACE: 'A Workspace.',
  API_KEY: 'An API key.',
  ADMIN_API_KEY: 'An Admin API key.',
  AGENT: 'An agent in Studio.',
  SKILL: 'A skill in Studio.',
  PROMPT: 'A prompt in Studio.',
  CUSTOM_VOICE: 'A custom voice.',
  DATASET: 'A dataset used for files, batch jobs, or fine-tuning.',
  FINE_TUNING_JOB: 'A fine-tuning job.',
  BATCH_JOB: 'A batch job.',
  DATA_CAPTURE_EXTRACT_JOB: 'A data capture extract job.',
  LE_CHAT_CONVERSATION: 'A le Chat conversation.',
  LE_CHAT_MEMORIES: 'le Chat memory settings.',
  LE_CHAT_FLASH_ANSWERS: 'le Chat flash answer settings.',
  LE_CHAT_LOCALISATION: 'le Chat localisation sharing settings.',
  LE_CHAT_DATA: 'le Chat data training settings.',
  INVOICE: 'A billing invoice.',
  WALLET: 'A billing wallet or credit balance.',
  MONTHLY_LIMIT: 'An Organization monthly spend limit.',
  WORKSPACE_MONTHLY_LIMIT: 'A Workspace monthly spend limit.',
  SHARED_BUDGET: 'A shared budget.',
  AUTO_RECHARGE: 'Auto recharge billing settings.',
  PAYMENT_METHOD: 'A billing payment method.',
  SUBSCRIPTION: 'A billing subscription.',
  BILLING_INFO: 'Billing profile information.',
  LIBRARY: 'A Library.',
  LIBRARY_DOCUMENT: 'A Library document.',
  INTEGRATION: 'An integration or Connector configuration.',
  CONNECTORS_GATEWAY: 'A Connectors gateway tool call.',
  FEATURE_PERMISSION: 'A feature permission override.',
  SECRET_STORE_ENTRY: 'A secret store entry.',
  CRAWLER_CONFIG: 'A crawler configuration.',
};

const METADATA_ROWS = [
  {
    key: 'user_uuid',
    appearsIn: 'Actor metadata',
    meaning:
      'User ID for the human actor. The dashboard can enrich this value with `uuid`, `email`, and `name`.',
  },
  {
    key: 'enterprise_account_uuid',
    appearsIn: 'Actor metadata',
    meaning:
      'Enterprise account ID for an API key actor. The dashboard can enrich this value with `uuid` and `name`.',
  },
  {
    key: 'organization_uuid',
    appearsIn: 'Actor, event, or target metadata',
    meaning:
      'Organization ID related to the actor, action, or affected resource. The dashboard can enrich this value with `uuid` and `name`.',
  },
  {
    key: 'workspace_uuid',
    appearsIn: 'Actor, event, or target metadata',
    meaning:
      'Workspace ID related to the actor, action, or affected resource. The dashboard can enrich this value with `uuid`, `name`, `description`, `icon`, and `is_default`.',
  },
  {
    key: 'uuid',
    appearsIn: 'Enriched metadata',
    meaning:
      'ID of the enriched user, Organization, Workspace, or enterprise account.',
  },
  {
    key: 'email',
    appearsIn: 'Enriched actor metadata',
    meaning: 'Email address for an enriched human actor.',
  },
  {
    key: 'name',
    appearsIn: 'Enriched metadata',
    meaning:
      'Display name for an enriched user, Organization, Workspace, or enterprise account.',
  },
  {
    key: 'description',
    appearsIn: 'Enriched Workspace metadata',
    meaning: 'Workspace description.',
  },
  {
    key: 'icon',
    appearsIn: 'Enriched Workspace metadata',
    meaning: 'Workspace icon value.',
  },
  {
    key: 'is_default',
    appearsIn: 'Enriched Workspace metadata',
    meaning: 'Whether the Workspace is the default Workspace.',
  },
];

function readDashboardFile(filePath: string): string | null {
  const apiPath = `repos/mistralai/dashboard/contents/${filePath}?ref=${DASHBOARD_REF}`;

  try {
    const encoded = execFileSync('gh', ['api', apiPath, '--jq', '.content'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    return Buffer.from(encoded.replace(/\s/g, ''), 'base64').toString('utf8');
  } catch {
    return null;
  }
}

function readOpenApiSpec(): { spec: OpenApiSpec; source: string } {
  const remoteSpec = readDashboardFile(DASHBOARD_FILES.openapi);

  if (remoteSpec) {
    return {
      spec: JSON.parse(remoteSpec) as OpenApiSpec,
      source: `dashboard OpenAPI Admin schema at ${DASHBOARD_REF}`,
    };
  }

  if (!existsSync(LOCAL_OPENAPI_FILE)) {
    throw new Error(
      'Could not fetch dashboard OpenAPI Admin schema and openapi.yaml was not found.'
    );
  }

  return {
    spec: load(readFileSync(LOCAL_OPENAPI_FILE, 'utf8')) as OpenApiSpec,
    source: 'local openapi.yaml',
  };
}

function schemaByName(
  schemas: Record<string, OpenApiSchema>,
  names: string[]
): OpenApiSchema {
  const foundName = names.find(name => schemas[name]);

  if (!foundName) {
    throw new Error(`Missing schema. Tried: ${names.join(', ')}`);
  }

  return schemas[foundName];
}

function parsePythonEnums(source: string): Record<string, string[]> {
  return {
    ActorType: parsePythonEnum(source, 'ActorType'),
    EventType: parsePythonEnum(source, 'EventType'),
    TargetType: parsePythonEnum(source, 'TargetType'),
  };
}

function parsePythonEnum(source: string, name: string): string[] {
  const classMatch = source.match(
    new RegExp(`class ${name}\\(StrEnum\\):([\\s\\S]*?)(?:\\nclass |\\ndef |$)`)
  );
  if (!classMatch) return [];

  return [...classMatch[1].matchAll(/=\s*"([^"]+)"/g)].map(match => match[1]);
}

function parseTypescriptEnums(source: string): Record<string, string[]> {
  return {
    ActorType: parseTypescriptEnum(source, 'ActorType'),
    EventType: parseTypescriptEnum(source, 'EventType'),
    TargetType: parseTypescriptEnum(source, 'TargetType'),
  };
}

function parseTypescriptEnum(source: string, name: string): string[] {
  const objectMatch = source.match(
    new RegExp(`export const ${name} = \\{([\\s\\S]*?)\\n\\} as const;`)
  );
  if (!objectMatch) return [];

  return [...objectMatch[1].matchAll(/:\s*"([^"]+)"/g)].map(match => match[1]);
}

function compareLists(
  label: string,
  expected: string[],
  actual: string[]
): void {
  const expectedSet = new Set(expected);
  const actualSet = new Set(actual);
  const missing = expected.filter(value => !actualSet.has(value));
  const extra = actual.filter(value => !expectedSet.has(value));

  if (missing.length || extra.length) {
    throw new Error(
      `${label} mismatch. Missing: ${missing.join(', ') || 'none'}. Extra: ${
        extra.join(', ') || 'none'
      }.`
    );
  }
}

function validateRemoteConstants(data: AuditLogData): void {
  const pythonSource = readDashboardFile(DASHBOARD_FILES.pythonConstants);
  const tsSource = readDashboardFile(DASHBOARD_FILES.typescriptConstants);

  if (pythonSource) {
    const pythonEnums = parsePythonEnums(pythonSource);
    compareLists('Python ActorType', data.actors, pythonEnums.ActorType);
    compareLists('Python EventType', data.events, pythonEnums.EventType);
    compareLists('Python TargetType', data.targets, pythonEnums.TargetType);
  }

  if (tsSource) {
    const tsEnums = parseTypescriptEnums(tsSource);
    compareLists('TypeScript ActorType', data.actors, tsEnums.ActorType);
    compareLists('TypeScript EventType', data.events, tsEnums.EventType);
    compareLists('TypeScript TargetType', data.targets, tsEnums.TargetType);
  }
}

function getData(): AuditLogData {
  const { spec, source } = readOpenApiSpec();
  const schemas = spec.components?.schemas ?? {};
  const auditLogOut = schemaByName(schemas, ['AuditLogOut']);
  const actorType = schemaByName(schemas, ['ActorType']);
  const eventType = schemaByName(schemas, ['EventType', 'AuditLogEventType']);
  const targetType = schemaByName(schemas, ['TargetType']);

  if (!actorType.enum || !eventType.enum || !targetType.enum) {
    throw new Error('Audit log enum schemas are missing enum values.');
  }

  const fields = buildFieldRows(schemas, auditLogOut);
  const filters = buildFilterRows(spec, schemas);
  const data = {
    actors: actorType.enum,
    events: eventType.enum,
    targets: targetType.enum,
    fields,
    filters,
    source,
  };

  validateRemoteConstants(data);

  return data;
}

function buildFieldRows(
  schemas: Record<string, OpenApiSchema>,
  auditLogOut: OpenApiSchema
): FieldRow[] {
  const properties = auditLogOut.properties ?? {};
  const required = new Set(auditLogOut.required ?? []);

  return FIELD_ORDER.filter(name => properties[name]).map(name => ({
    name,
    type: schemaToType(properties[name], schemas),
    required: required.has(name),
    description: properties[name].description ?? '',
  }));
}

function buildFilterRows(
  spec: OpenApiSpec,
  schemas: Record<string, OpenApiSchema>
): FilterRow[] {
  const auditLogsPath = Object.keys(spec.paths ?? {}).find(p => p.endsWith('/admin/audit-logs'));
  const operation = (auditLogsPath ? spec.paths?.[auditLogsPath]?.get : undefined) as
    | { parameters?: unknown[] }
    | undefined;
  const parameters = operation?.parameters ?? [];

  return parameters.map(parameter => {
    const typedParameter = parameter as {
      name: string;
      description?: string;
      schema?: OpenApiSchema & { default?: unknown };
    };
    const schema = typedParameter.schema ?? {};

    return {
      name: typedParameter.name,
      type: schemaToType(schema, schemas),
      defaultValue:
        schema.default === undefined ? 'None' : String(schema.default),
      description: typedParameter.description ?? schema.description ?? '',
    };
  });
}

function schemaToType(
  schema: OpenApiSchema | undefined,
  schemas: Record<string, OpenApiSchema>
): string {
  if (!schema) return 'unknown';
  if (schema.$ref) return refName(schema.$ref);
  if (schema.enum) return schema.enum.join(' | ');
  if (schema.format === 'date-time') return 'date-time string';
  if (schema.format === 'uuid') return 'UUID string';
  if (schema.type === 'array')
    return `${schemaToType(schema.items, schemas)}[]`;
  if (schema.additionalProperties) {
    return `object<string, ${schemaToType(schema.additionalProperties, schemas)}>`;
  }
  if (schema.anyOf) return unionType(schema.anyOf, schemas);
  if (schema.allOf)
    return schema.allOf.map(item => schemaToType(item, schemas)).join(' | ');

  return schema.type ?? 'object';
}

function unionType(
  items: OpenApiSchema[],
  schemas: Record<string, OpenApiSchema>
): string {
  const types = items.map(item => schemaToType(item, schemas));
  return [...new Set(types)].join(' | ');
}

function refName(ref: string): string {
  return ref.split('/').at(-1) ?? ref;
}

function generatePage(data: AuditLogData): string {
  const lines: string[] = [];

  lines.push('---');
  lines.push('title: Audit logs reference');
  lines.push('sidebar_label: Reference');
  lines.push('sidebar_position: 2');
  lines.push(
    "description: 'Audit log response fields, filters, actor types, target types, and event types.'"
  );
  lines.push('---');
  lines.push('');

  lines.push('# Audit logs reference');
  lines.push('');
  lines.push(
    'This reference lists the fields, filters, actor types, target types, and events that can appear in audit logs.'
  );
  lines.push('');
  lines.push(
    'Audit log entries are generated from the Admin API schema and dashboard audit log constants. Metadata fields vary by event and resource type.'
  );
  lines.push('');
  lines.push('## Response fields');
  lines.push('');
  lines.push('| Field | Type | Required | Meaning |');
  lines.push('|---|---|---|---|');
  for (const field of data.fields) {
    lines.push(
      `| \`${field.name}\` | ${codeType(field.type)} | ${
        field.required ? 'Yes' : 'No'
      } | ${escapeTable(field.description)} |`
    );
  }
  lines.push('');
  lines.push('## Metadata fields');
  lines.push('');
  lines.push(
    '`actor_metadata`, `event_metadata`, and `target_metadata` are objects. They contain extra data about the actor, action, and affected resource.'
  );
  lines.push('');
  lines.push(
    'The raw API schema accepts string values. The dashboard can enrich known IDs into objects for display.'
  );
  lines.push('');
  lines.push('| Key | Appears in | Meaning |');
  lines.push('|---|---|---|');
  for (const row of METADATA_ROWS) {
    lines.push(
      `| \`${row.key}\` | ${row.appearsIn} | ${escapeTable(row.meaning)} |`
    );
  }
  lines.push('');
  lines.push('## Filters');
  lines.push('');
  lines.push(
    'Use these query parameters with the [Admin API audit logs endpoint](/api/endpoint/beta/admin/audit-logs).'
  );
  lines.push('');
  lines.push('| Filter | Type | Default | Meaning |');
  lines.push('|---|---|---|---|');
  for (const filter of data.filters) {
    lines.push(
      `| \`${filter.name}\` | ${codeType(filter.type)} | \`${filter.defaultValue}\` | ${escapeTable(filter.description)} |`
    );
  }
  lines.push('');
  lines.push('## Actor types');
  lines.push('');
  lines.push('| Actor type | Meaning |');
  lines.push('|---|---|');
  for (const actor of data.actors) {
    lines.push(
      `| \`${actor}\` | ${escapeTable(
        ACTOR_DESCRIPTIONS[actor] ?? `Actor type ${actor}.`
      )} |`
    );
  }
  lines.push('');
  lines.push('## Target types');
  lines.push('');
  lines.push('| Target type | Meaning |');
  lines.push('|---|---|');
  for (const target of data.targets) {
    lines.push(
      `| \`${target}\` | ${escapeTable(
        TARGET_DESCRIPTIONS[target] ?? `A ${humanizeValue(target)} resource.`
      )} |`
    );
  }
  lines.push('');
  lines.push('## Event types');
  lines.push('');
  lines.push(
    'Each `event_type` names the action recorded in the audit log. Deprecated events can still appear for older logs.'
  );

  const usedEvents = new Set<string>();
  for (const group of EVENT_GROUPS) {
    const events = data.events.filter(event => group.match(event));
    if (!events.length) continue;

    for (const event of events) usedEvents.add(event);

    lines.push('');
    lines.push(`### ${group.title}`);
    lines.push('');
    lines.push('| Event type | Meaning |');
    lines.push('|---|---|');
    for (const event of events) {
      lines.push(`| \`${event}\` | ${escapeTable(describeEvent(event))} |`);
    }
  }

  const otherEvents = data.events.filter(event => !usedEvents.has(event));
  if (otherEvents.length) {
    lines.push('');
    lines.push('### Other events');
    lines.push('');
    lines.push('| Event type | Meaning |');
    lines.push('|---|---|');
    for (const event of otherEvents) {
      lines.push(`| \`${event}\` | ${escapeTable(describeEvent(event))} |`);
    }
  }

  lines.push('');
  lines.push(`{/* Source: ${data.source}. */}`);
  lines.push('');

  return `${lines.join('\n')}\n`;
}

function codeType(type: string): string {
  return type
    .split(' | ')
    .map(part => `\`${part}\``)
    .join(' or ');
}

function escapeTable(value: string): string {
  return value.replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

function describeEvent(event: string): string {
  const parts = event.split('.');
  const action = parts.at(-1) ?? event;
  const subjectParts = parts.slice(0, -1);
  const subject = humanizeSubject(subjectParts);

  if (event === 'user.log_in') return 'Records when a user signs in.';
  if (event === 'user.log_out') return 'Records when a user signs out.';
  if (event === 'organization.invite.send') {
    return 'Records when an Organization invitation is sent.';
  }
  if (event === 'organization.invite.accepted') {
    return 'Records when an Organization invitation is accepted.';
  }
  if (event === 'organization.invite.rejected') {
    return 'Records when an Organization invitation is rejected.';
  }
  if (event === 'organization.invite.revoked') {
    return 'Records when an Organization invitation is revoked.';
  }
  if (event === 'organization.join_by_email_domain') {
    return 'Records when a user joins an Organization through an allowed email domain.';
  }
  if (event === 'user.phone_number.verify') {
    return 'Records when a user verifies a phone number.';
  }
  if (event === 'user.organization.leave') {
    return 'Records when a user leaves an Organization.';
  }
  if (event === 'user.organization.delete') {
    return 'Records when a user is removed from an Organization.';
  }
  if (event === 'user.organization.join') {
    return 'Records when a user joins an Organization.';
  }
  if (event === 'user.create') return 'Records when a user is created.';
  if (event === 'user.delete') return 'Records when a user is deleted.';
  if (event === 'workspace.member.add') {
    return 'Records when a Workspace member is added.';
  }
  if (event === 'workspace.member.remove') {
    return 'Records when a Workspace member is removed.';
  }
  if (event === 'user_group.create') {
    return 'Records when a user group is created.';
  }
  if (event === 'user_group.delete') {
    return 'Records when a user group is deleted.';
  }
  if (event === 'billing.subscription.subscribe') {
    return 'Records when a billing subscription starts.';
  }
  if (event === 'billing.subscription.unsubscribe') {
    return 'Records when a billing subscription is set to end.';
  }
  if (event === 'billing.subscription.cancel_unsubscribe') {
    return 'Records when a scheduled subscription cancellation is canceled.';
  }
  if (event === 'billing.seat.grant') {
    return 'Records when a billing seat is granted.';
  }
  if (event === 'billing.seat.revoke') {
    return 'Records when a billing seat is revoked.';
  }
  if (event === 'billing.subscription.add_seats') {
    return 'Records when seats are added to a billing subscription.';
  }
  if (event === 'billing.subscription.remove_seats') {
    return 'Records when seats are removed from a billing subscription.';
  }
  if (event === 'billing.payment_method.added') {
    return 'Records when a billing payment method is added.';
  }
  if (event === 'billing.payment_method.removed') {
    return 'Records when a billing payment method is removed.';
  }
  if (event === 'billing.credits.added') {
    return 'Records when billing credits are added.';
  }
  if (event === 'le_chat.actions.external_link') {
    return 'Records when a user opens an external link from le Chat actions.';
  }
  if (event === 'le_chat.data.training_enabled') {
    return 'Records when le Chat data training is enabled.';
  }
  if (event === 'le_chat.data.training_disabled') {
    return 'Records when le Chat data training is disabled.';
  }
  if (event === 'le_chat.conversation.created') {
    return 'Records when a le Chat conversation is created.';
  }
  if (event === 'le_chat.conversation.deleted') {
    return 'Records when a le Chat conversation is deleted.';
  }
  if (event.endsWith('.tool_called')) {
    return `Records when ${subject} tool is called.`;
  }
  if (event === 'connection.admin.setup_index') {
    return 'Records when an admin connection index is set up.';
  }
  if (event === 'indexing.workflow.completed') {
    return 'Records when a legacy indexing workflow completes.';
  }
  if (event === 'indexing.deleted') {
    return 'Records when a legacy index is deleted.';
  }
  if (event === 'library.document.create') {
    return 'Records when a Library document is created.';
  }
  if (event === 'library.document.delete') {
    return 'Records when a Library document is deleted.';
  }
  if (event === 'library.document.bulk_delete') {
    return 'Records when Library documents are deleted in bulk.';
  }
  if (event === 'library.document.update') {
    return 'Records when a Library document changes.';
  }
  if (event === 'library.document.reprocess') {
    return 'Records when a Library document is reprocessed.';
  }
  if (event === 'integration.activated_for_org') {
    return 'Records when an integration is activated for an Organization.';
  }
  if (event === 'integration.deactivated_for_org') {
    return 'Records when an integration is deactivated for an Organization.';
  }
  if (event === 'integration.activated_for_workspace') {
    return 'Records when an integration is activated for a Workspace.';
  }
  if (event === 'integration.deactivated_for_workspace') {
    return 'Records when an integration is deactivated for a Workspace.';
  }
  if (event === 'integration.activated_for_user') {
    return 'Records when an integration is activated for a user.';
  }
  if (event === 'integration.deactivated_for_user') {
    return 'Records when an integration is deactivated for a user.';
  }
  if (event.startsWith('user_group.workspace.')) {
    return `Records when ${subject} ${humanizeAction(action)} occurs.`;
  }
  if (event === 'agent.update') return 'Records when an agent changes.';
  if (event === 'skill.update') return 'Records when a skill changes.';
  if (event === 'prompt.update') return 'Records when a prompt changes.';
  if (event === 'custom_voice.update') {
    return 'Records when a custom voice changes.';
  }
  if (event === 'library.update') return 'Records when a Library changes.';
  if (event === 'integration.credentials.created_or_updated') {
    return 'Records when integration credentials change.';
  }
  if (event === 'integration.preferences.created_or_updated') {
    return 'Records when integration preferences change.';
  }
  if (event === 'crawler.config.update') {
    return 'Records when a crawler configuration changes.';
  }
  if (event === 'integration.credentials.deleted') {
    return 'Records when integration credentials are deleted.';
  }
  if (event === 'integration.preferences.deleted') {
    return 'Records when integration preferences are deleted.';
  }

  switch (action) {
    case 'create':
    case 'created':
      return `Records when ${withArticle(subject)} is created.`;
    case 'delete':
    case 'deleted':
      return `Records when ${withArticle(subject)} is deleted.`;
    case 'update':
    case 'updated':
    case 'default_changed':
    case 'created_or_updated':
      return `Records when ${subject} changes.`;
    case 'enable':
    case 'enabled':
      return `Records when ${subject} is enabled.`;
    case 'disable':
    case 'disabled':
      return `Records when ${subject} is disabled.`;
    case 'add':
    case 'added':
      return `Records when ${withArticle(subject)} is added.`;
    case 'remove':
    case 'removed':
      return `Records when ${withArticle(subject)} is removed.`;
    case 'rotate':
      return `Records when ${withArticle(subject)} is rotated.`;
    case 'cancel':
      return `Records when ${withArticle(subject)} is canceled.`;
    case 'share':
      return `Records when ${withArticle(subject)} is shared.`;
    case 'unshare':
      return `Records when ${withArticle(subject)} is unshared.`;
    case 'load':
      return `Records when ${withArticle(subject)} is loaded.`;
    case 'force_load':
      return `Records when ${withArticle(subject)} is force loaded.`;
    case 'reprocess':
      return `Records when ${withArticle(subject)} is reprocessed.`;
    case 'connected':
      return `Records when ${withArticle(subject)} is connected.`;
    case 'disconnected':
      return `Records when ${withArticle(subject)} is disconnected.`;
    case 'retried':
      return `Records when ${withArticle(subject)} is retried.`;
    case 'used':
      return `Records when ${withArticle(subject)} is used.`;
    default:
      return `Records when ${subject} action \`${action}\` occurs.`;
  }
}

function humanizeSubject(parts: string[]): string {
  if (!parts.length) return 'audit log event';
  return parts.map(humanizeToken).join(' ');
}

function humanizeValue(value: string): string {
  return value.toLowerCase().split('_').map(humanizeToken).join(' ');
}

function humanizeAction(action: string): string {
  return action.replace(/_/g, ' ');
}

function humanizeToken(token: string): string {
  const replacements: Record<string, string> = {
    admin_api_key: 'Admin API key',
    api_key: 'API key',
    auto_recharge: 'auto recharge',
    batch_job: 'batch job',
    billing: 'billing',
    connectors_gateway: 'Connectors gateway',
    crawler: 'crawler',
    custom_voice: 'custom voice',
    data: 'data',
    data_capture: 'data capture',
    default_changed: 'default change',
    domain_verification: 'domain verification',
    email_domain_authentication: 'email domain authentication',
    extract_job: 'extract job',
    feature_permission: 'feature permission',
    fine_tuning_job: 'fine-tuning job',
    flash_answers: 'flash answers',
    force_load: 'force load',
    gift_code: 'gift code',
    information: 'information',
    invite: 'invitation',
    la_plateforme: 'La Plateforme',
    le_chat: 'le Chat',
    library: 'Library',
    localisation_sharing: 'localisation sharing',
    monthly_limit: 'monthly limit',
    organization: 'Organization',
    payment_method: 'payment method',
    public_sharing: 'public sharing',
    run: 'run',
    saml_authentication: 'SAML authentication',
    secret_store: 'secret store',
    seat_auto_assign: 'seat auto assignment',
    shared_budget: 'shared budget',
    shared_budget_override: 'shared budget override',
    sso_seat_auto_assign: 'SSO seat auto assignment',
    sso_user_provisioning: 'SSO user provisioning',
    subscription: 'subscription',
    termination_date: 'termination date',
    training_enabled: 'training enabled',
    training_disabled: 'training disabled',
    user: 'user',
    user_group: 'user group',
    workspace: 'Workspace',
    workspace_monthly_limit: 'Workspace monthly limit',
  };

  if (replacements[token]) return replacements[token];

  return token.replace(/_/g, ' ');
}

function withArticle(subject: string): string {
  if (
    subject.startsWith('billing ') ||
    subject.startsWith('le Chat ') ||
    subject.startsWith('La Plateforme ') ||
    subject.startsWith('Library ') ||
    subject.startsWith('Organization ') ||
    subject.startsWith('Workspace ')
  ) {
    return subject;
  }

  const lowerSubject = subject.toLowerCase();
  if (lowerSubject.startsWith('user')) return subject;

  const first = subject.at(0)?.toLowerCase() ?? 'a';
  const article = ['a', 'e', 'i', 'o', 'u'].includes(first) ? 'an' : 'a';
  return `${article} ${subject}`;
}

function ensureAuditLogsFolder(): void {
  if (!existsSync(OVERVIEW_PAGE) && existsSync(ROOT_PAGE)) {
    mkdirSync(OVERVIEW_DIR, { recursive: true });
    renameSync(ROOT_PAGE, OVERVIEW_PAGE);
  }

  writeFileSync(CATEGORY_FILE, CATEGORY_CONTENT);
}

function main(): void {
  ensureAuditLogsFolder();

  const data = getData();
  const page = generatePage(data);

  mkdirSync(dirname(OUTPUT_FILE), { recursive: true });
  writeFileSync(OUTPUT_FILE, page);
  execFileSync(
    'pnpm',
    ['exec', 'prettier', '--write', CATEGORY_FILE, OUTPUT_FILE],
    {
      stdio: 'inherit',
    }
  );

  console.log(
    `Generated ${OUTPUT_FILE} with ${data.events.length} events, ${data.targets.length} target types, and ${data.actors.length} actor types.`
  );
}

main();
