import { EntityType, ITreeNode } from './tree.models';

/** Storage key for localStorage */
export const TREE_STORAGE_KEY = 'exelare_tree_state';

/**
 * Storage version - increment to reset localStorage when data structure changes
 * Version history:
 * - v1-3: Initial versions
 * - v4: Added type property to dropped nodes for subfolder movement
 * - v5: Refactored architecture, subfolders sorted to top
 */
export const TREE_STORAGE_VERSION = 5;

/** Icon mapping for entity types */
export const ENTITY_TYPE_ICONS: Readonly<Record<EntityType, string>> = {
  candidate: 'pi pi-fw pi-user',
  contact: 'pi pi-fw pi-id-card',
  job: 'pi pi-fw pi-briefcase',
  company: 'pi pi-fw pi-building',
} as const;

/** Default fallback icon */
export const DEFAULT_ICON = 'pi pi-fw pi-file';

/** Default tree structure */
export function getDefaultTreeItems(): ITreeNode[] {
  return [
    {
      id: 'saved-lists',
      label: 'Saved lists',
      icon: 'pi pi-fw pi-list',
      expanded: true,
      draggable: false,
      droppable: false,
      children: [
        {
          id: 'companies',
          label: 'Companies',
          icon: 'pi pi-fw pi-building',
          draggable: false,
          droppable: true,
          type: 'company',
          children: [],
        },
        {
          id: 'contacts',
          label: 'Contacts',
          icon: 'pi pi-fw pi-user',
          draggable: false,
          droppable: true,
          type: 'contact',
          children: [],
        },
        {
          id: 'candidates',
          label: 'Candidates',
          icon: 'pi pi-fw pi-user',
          draggable: false,
          droppable: true,
          type: 'candidate',
          link: '/candidates',
          children: [],
        },
        {
          id: 'jobs',
          label: 'Jobs',
          icon: 'pi pi-fw pi-briefcase',
          draggable: false,
          droppable: true,
          type: 'job',
          children: [],
        },
      ],
    },
  ];
}
