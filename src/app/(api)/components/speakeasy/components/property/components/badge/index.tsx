import React, { useMemo } from 'react';
import { Badge, BadgeProps } from '@/components/ui/badge';
import {
  ParsedTypeStructure,
  ParsedTypeNode,
} from '@/app/(api)/util/parseTypeStructure';

function TypeElement({
  node,
  onClickType,
}: {
  node: ParsedTypeNode;
  onClickType: (e: React.MouseEvent<HTMLAnchorElement>, id: string) => void;
}) {
  const displayText = node.label;

  if (node.href) {
    return (
      <a
        href={node.href}
        className="hover:underline whitespace-nowrap border border-transparent focus-ring"
        onClick={e => {
          const hash = node.href!.split('#')[1] || '';
          onClickType(e, hash);
        }}
      >
        {displayText}
      </a>
    );
  }

  return <span className="whitespace-nowrap">{displayText}</span>;
}

function TypeRenderer({
  node,
  onClickType,
}: {
  node: ParsedTypeNode;
  onClickType: (e: React.MouseEvent<HTMLAnchorElement>, id: string) => void;
}) {
  if (!node.children || node.children.length === 0) {
    return <TypeElement node={node} onClickType={onClickType} />;
  }

  switch (node.type) {
    case 'container':
      return (
        <>
          <TypeElement node={node} onClickType={onClickType} />
          <span className="">&lt;</span>
          {node.children.map((child, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span className="">, </span>}
              <TypeRenderer node={child} onClickType={onClickType} />
            </React.Fragment>
          ))}
          <span className="">&gt;</span>
        </>
      );

    case 'union':
    case 'enum':
      return (
        <>
          {node.children.map((child, index) => (
            <React.Fragment key={child.hash || index}>
              {index > 0 && <span className="mx-1">|</span>}
              <TypeRenderer node={child} onClickType={onClickType} />
            </React.Fragment>
          ))}
        </>
      );
    default:
      return <TypeElement node={node} onClickType={onClickType} />;
  }
}

export function TypeBadge({
  displayStructure,
  onClickType,
  overrideVariant,
  size = 'sm',
}: {
  displayStructure: ParsedTypeStructure | undefined;
  onClickType: (e: React.MouseEvent<HTMLAnchorElement>, id: string) => void;
  size: BadgeProps['size'];
  overrideVariant?: BadgeProps['variant'];
}) {
  const variant = useMemo(() => {
    if (overrideVariant) return overrideVariant;

    if (!displayStructure) {
      return 'secondary';
    }
    if (
      displayStructure.root.label === 'integer' ||
      displayStructure.root.label === 'number'
    ) {
      return 'type-number';
    }
    if (displayStructure.root.label === 'union') {
      return 'type-union';
    }
    if (displayStructure.root.label === 'string') {
      return 'type-string';
    }
    if (displayStructure.root.label === 'array') {
      return 'type-array';
    }
    if (displayStructure.root.label === 'enum') {
      return 'type-enum';
    }
    if (displayStructure.root.label === 'boolean') {
      return 'type-boolean';
    }

    return 'secondary';
  }, [displayStructure]);

  return (
    <Badge
      size={size}
      className="font-mono gap-0 inline whitespace-pre-line [word-break:break-word] shrink"
      variant={variant}
    >
      <TypeRenderer
        node={displayStructure?.root || { type: 'primitive', label: 'unknown' }}
        onClickType={onClickType}
      />
    </Badge>
  );
}
