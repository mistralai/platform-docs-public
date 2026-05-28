import type { DisplayTypeInfo } from '../types/shared';

export type ParsedTypeNode = {
  type: 'primitive' | 'container' | 'union' | 'enum' | 'discriminated-union';
  label: string;
  linkedLabel?: string;
  href?: string;
  displayText?: string;
  hash?: string;
  children?: ParsedTypeNode[];
  isNullable?: boolean;
  discriminator?: {
    property: string;
    values: string[];
  };
};

export type ParsedTypeStructure = {
  root: ParsedTypeNode;
  allNodes: ParsedTypeNode[];
  complexity: 'simple' | 'medium' | 'complex';
};

function parseLinkedLabel(linkedLabel: string): {
  href?: string;
  displayText: string;
} {
  if (!linkedLabel) {
    return { displayText: '' };
  }

  const anchorMatch = linkedLabel.match(
    /<a\s+href="([^"]*)"[^>]*>([^<]*)<\/a>/
  );
  if (anchorMatch) {
    return {
      href: anchorMatch[1],
      displayText: anchorMatch[2],
    };
  }

  return { displayText: linkedLabel };
}

function createTypeNode(
  typeInfo: DisplayTypeInfo,
  allNodes: ParsedTypeNode[] = []
): ParsedTypeNode {
  const { href, displayText } = parseLinkedLabel(typeInfo.linkedLabel);

  const node: ParsedTypeNode = {
    type: getTypeCategory(typeInfo.label, typeInfo),
    label: typeInfo.label,
    linkedLabel: typeInfo.linkedLabel,
    href,
    displayText,
    hash: generateHash(typeInfo),
    isNullable:
      typeInfo.label.includes('null') || typeInfo.label.includes('undefined'),
  };

  if (typeInfo.children && typeInfo.children.length > 0) {
    node.children = typeInfo.children.map(child =>
      createTypeNode(child, allNodes)
    );
  }

  allNodes.push(node);
  return node;
}

function getTypeCategory(
  label: string,
  typeInfo?: DisplayTypeInfo
): ParsedTypeNode['type'] {
  switch (label) {
    case 'array':
    case 'map':
    case 'set':
    case 'event-stream':
    case 'jsonl':
      return 'container';
    case 'union':
      return 'union';
    case 'enum':
      return 'enum';
    default:
      return 'primitive';
  }
}

function generateHash(typeInfo: DisplayTypeInfo): string {
  const hashBase = `${typeInfo.label}-${typeInfo.linkedLabel || ''}`;
  return btoa(hashBase).slice(0, 8);
}

function calculateComplexity(
  allNodes: ParsedTypeNode[]
): ParsedTypeStructure['complexity'] {
  const hasContainers = allNodes.some(node => node.type === 'container');
  const hasUnions = allNodes.some(node => node.type === 'union');
  const nodeCount = allNodes.length;

  if (nodeCount === 1 && !hasContainers && !hasUnions) {
    return 'simple';
  }
  if (nodeCount <= 3 && (hasContainers || hasUnions)) {
    return 'medium';
  }
  return 'complex';
}

export function parseTypeStructure(
  typeInfo: DisplayTypeInfo
): ParsedTypeStructure {
  const allNodes: ParsedTypeNode[] = [];
  const root = createTypeNode(typeInfo, allNodes);
  const complexity = calculateComplexity(allNodes);

  return {
    root,
    allNodes,
    complexity,
  };
}

export function flattenTypeLabels(structure: ParsedTypeStructure): string[] {
  return structure.allNodes.map(node => node.label);
}

export function getTypeByHash(
  structure: ParsedTypeStructure,
  hash: string
): ParsedTypeNode | undefined {
  return structure.allNodes.find(node => node.hash === hash);
}

export function isDiscriminatedUnion(node: ParsedTypeNode): boolean {
  return node.type === 'discriminated-union' && !!node.discriminator;
}

export function getDiscriminatedUnionInfo(structure: ParsedTypeStructure): {
  hasDiscriminatedUnions: boolean;
  discriminators: Array<{
    property: string;
    values: string[];
    nodeHash: string;
  }>;
} {
  const discriminatedUnions = structure.allNodes.filter(isDiscriminatedUnion);

  return {
    hasDiscriminatedUnions: discriminatedUnions.length > 0,
    discriminators: discriminatedUnions.map(node => ({
      property: node.discriminator!.property,
      values: node.discriminator!.values,
      nodeHash: node.hash!,
    })),
  };
}

// it should build an example of how it looks like in the UI (arra<sarasa | other | x> enum<sarasa | other | x> - a | b | c, etc...)
export const buildSingleLineDisplayType = (
  structure: ParsedTypeStructure
): string => {
  return buildTypeNodeDisplay(structure.root);
};

function buildTypeNodeDisplay(node: ParsedTypeNode): string {
  if (!node.children || node.children.length === 0) {
    return node.displayText || node.label;
  }

  switch (node.type) {
    case 'container':
      const containerChildren = node.children
        .map(buildTypeNodeDisplay)
        .join(', ');
      return `${node.displayText || node.label}<${containerChildren}>`;

    case 'union':
    case 'enum':
      return node.children.map(buildTypeNodeDisplay).join(' | ');

    default:
      return node.displayText || node.label;
  }
}
