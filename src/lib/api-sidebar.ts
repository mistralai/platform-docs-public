import { ApiSidebarItem, ApiSidebarMetadataItem } from '@/app/(api)/schema/api-sidebar';

export const flattenSidebar = (
    sidebar: ApiSidebarMetadataItem[]
): ApiSidebarItem[] => {
    // Top-level categories to group endpoints logically
    const coreGroup: ApiSidebarItem = {
        type: 'category',
        label: 'Core API',
        href: '/api/endpoint/chat',
        children: [],
        clickable: false,
        pagination: { prev: undefined, next: undefined },
    };

    const betaGroup: ApiSidebarItem = {
        type: 'category',
        label: 'Beta Features',
        href: '/api/endpoint/beta/agents',
        children: [],
        clickable: true,
        pagination: { prev: undefined, next: undefined },
    };

    const deprecatedGroup: ApiSidebarItem = {
        type: 'category',
        label: 'Deprecated',
        href: '/api/endpoint/deprecated/fine-tuning',
        children: [],
        clickable: true,
        pagination: { prev: undefined, next: undefined },
    };

    const traverse = (node: ApiSidebarMetadataItem) => {
        let parentGroup = coreGroup;
        if (node.slug.includes('deprecated')) {
            parentGroup = deprecatedGroup;
        } else if (node.slug.includes('beta')) {
            parentGroup = betaGroup;
        }

        const categoryNode: ApiSidebarItem = {
            type: 'category',
            label: node.sidebarLabel,
            href: !node.slug ? '/api' : `/api/${node.slug}`,
            clickable: true,
            pagination: { prev: undefined, next: undefined },
            children: node.tags.flatMap(tag =>
                tag.operations.map(
                    operation =>
                        ({
                            type: 'endpoint',
                            label: operation.summary,
                            href: `/api/${node.slug}#${operation.elementId}`,
                            children: [],
                            method: operation.method,
                            path: operation.path,
                            elementId: operation.elementId,
                            clickable: true,
                            pagination: { prev: undefined, next: undefined },
                        }) satisfies ApiSidebarItem
                )
            ),
        };

        if (parentGroup.children) {
            parentGroup.children.push(categoryNode);
        }
    };

    for (const item of sidebar) {
        traverse(item);
    }

    const result: ApiSidebarItem[] = [];
    if (coreGroup.children && coreGroup.children.length > 0) {
        const endpointsParent: ApiSidebarItem = {
            type: 'category',
            label: 'Endpoints',
            href: '/api/endpoint/chat',
            children: coreGroup.children,
            clickable: true,
            pagination: { prev: undefined, next: undefined },
        };
        result.push(endpointsParent);
    }
    if (betaGroup.children && betaGroup.children.length > 0) result.push(betaGroup);
    if (deprecatedGroup.children && deprecatedGroup.children.length > 0) result.push(deprecatedGroup);

    const allItems: ApiSidebarItem[] = [];

    const collectItems = (items: ApiSidebarItem[]) => {
        for (const item of items) {
           allItems.push(item);
           if (item.children && item.children.length > 0) {
               collectItems(item.children as ApiSidebarItem[]);
           }
        }
    }
    
    // We only collect pagination sequentially
    // But since the sidebar might nest multiple levels now, flatten carefully for pagination
    const flattenForPagination = (items: ApiSidebarItem[]) => {
        const flat: ApiSidebarItem[] = [];
        const walk = (nodes: ApiSidebarItem[]) => {
            for (const n of nodes) {
                flat.push(n);
                if (n.children && n.children.length > 0) walk(n.children as ApiSidebarItem[]);
            }
        };
        walk(items);
        return flat;
    };

    const paginatedItems = flattenForPagination(result);

    for (let i = 0; i < paginatedItems.length; i++) {
        const current = paginatedItems[i];
        const prev = i > 0 ? paginatedItems[i - 1] : undefined;
        const next = i < paginatedItems.length - 1 ? paginatedItems[i + 1] : undefined;

        current.pagination = {
            prev: prev && prev.href ? { href: prev.href, title: prev.label } : undefined,
            next: next && next.href ? { href: next.href, title: next.label } : undefined,
        };
    }

    return result;
};
