import { SideBarTreeNode } from '@/components/layout/sidebar';
import sidebarMetadata from '../components/sidebar-metadata.json';
export type ApiSidebarMetadata = typeof sidebarMetadata;
export type ApiSidebarMetadataItem = ApiSidebarMetadata[number];
export type Tag = ApiSidebarMetadataItem['tags'][number];
export type Operation = Tag['operations'][number];

interface ApiSidebarEndpoint extends SideBarTreeNode {
  type: 'endpoint';
  method: Operation['method'];
  path: Operation['path'];
  elementId: Operation['elementId'];
}

interface ApiSidebarCategory extends SideBarTreeNode {
  type: 'category';
  children: ApiSidebarItem[];
}

export type ApiSidebarItem = ApiSidebarEndpoint | ApiSidebarCategory;
