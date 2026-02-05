import { EntityType, ITreeNode } from './tree.models';

/** Storage key for localStorage */
export const TREE_STORAGE_KEY = 'exelare_tree_state';

/**
 * Storage version - increment to reset localStorage when data structure changes
 * Version history:
 * - v1-3: Initial versions
 * - v4: Added type property to dropped nodes for subfolder movement
 * - v5: Refactored architecture, subfolders sorted to top
 * - v6: Added Dynamic Views section per entity
 */
export const TREE_STORAGE_VERSION = 6;

/** Icon mapping for entity types */
export const ENTITY_TYPE_ICONS: Readonly<Record<EntityType, string>> = {
  candidate: 'pi pi-fw pi-user',
  contact: 'pi pi-fw pi-id-card',
  job: 'pi pi-fw pi-briefcase',
  company: 'pi pi-fw pi-building',
} as const;

/** Default fallback icon */
export const DEFAULT_ICON = 'pi pi-fw pi-file';

/** Default tree structure with Dynamic Views and Saved Lists per entity */
export function getDefaultTreeItems(): ITreeNode[] {
  return [
    {
      id: 'candidates',
      label: 'Candidates',
      icon: 'pi pi-fw pi-users',
      expanded: true,
      draggable: false,
      droppable: false,
      type: 'candidate',
      children: [
        {
          id: 'candidates-dynamic-views',
          label: 'Dynamic Views',
          icon: 'pi pi-fw pi-filter',
          expanded: true,
          draggable: false,
          droppable: false,
          children: [
            {
              id: 'candidates-new-updated',
              label: 'New/Updated Online',
              icon: 'pi pi-fw pi-star',
              draggable: false,
              droppable: false,
            },
            {
              id: 'candidates-active',
              label: 'Active',
              icon: 'pi pi-fw pi-star',
              draggable: false,
              droppable: false,
            },
            {
              id: 'candidates-my-active',
              label: 'My Active',
              icon: 'pi pi-fw pi-star-fill',
              draggable: false,
              droppable: false,
            },
            {
              id: 'candidates-submitted',
              label: 'Submitted',
              icon: 'pi pi-fw pi-send',
              draggable: false,
              droppable: false,
            },
            {
              id: 'candidates-interviewed',
              label: 'Interviewed',
              icon: 'pi pi-fw pi-calendar',
              draggable: false,
              droppable: false,
            },
            {
              id: 'candidates-hired',
              label: 'Hired',
              icon: 'pi pi-fw pi-verified',
              draggable: false,
              droppable: false,
            },
            {
              id: 'candidates-former',
              label: 'Former Employee',
              icon: 'pi pi-fw pi-user-minus',
              draggable: false,
              droppable: false,
            },
            {
              id: 'candidates-dnu',
              label: 'DNU',
              icon: 'pi pi-fw pi-ban',
              draggable: false,
              droppable: false,
            },
          ],
        },
        {
          id: 'candidates-saved-lists',
          label: 'Saved Lists',
          icon: 'pi pi-fw pi-folder',
          expanded: true,
          draggable: false,
          droppable: true,
          type: 'candidate',
          children: [],
        },
      ],
    },
    {
      id: 'jobs',
      label: 'Jobs',
      icon: 'pi pi-fw pi-briefcase',
      expanded: false,
      draggable: false,
      droppable: false,
      type: 'job',
      children: [
        {
          id: 'jobs-dynamic-views',
          label: 'Dynamic Views',
          icon: 'pi pi-fw pi-filter',
          expanded: true,
          draggable: false,
          droppable: false,
          children: [
            {
              id: 'jobs-open',
              label: 'Open',
              icon: 'pi pi-fw pi-folder-open',
              draggable: false,
              droppable: false,
            },
            {
              id: 'jobs-my-jobs',
              label: 'My Jobs',
              icon: 'pi pi-fw pi-star-fill',
              draggable: false,
              droppable: false,
            },
            {
              id: 'jobs-on-hold',
              label: 'On Hold',
              icon: 'pi pi-fw pi-pause',
              draggable: false,
              droppable: false,
            },
            {
              id: 'jobs-filled',
              label: 'Filled',
              icon: 'pi pi-fw pi-check-circle',
              draggable: false,
              droppable: false,
            },
            {
              id: 'jobs-closed',
              label: 'Closed',
              icon: 'pi pi-fw pi-times-circle',
              draggable: false,
              droppable: false,
            },
          ],
        },
        {
          id: 'jobs-saved-lists',
          label: 'Saved Lists',
          icon: 'pi pi-fw pi-folder',
          expanded: true,
          draggable: false,
          droppable: true,
          type: 'job',
          children: [],
        },
      ],
    },
    {
      id: 'contacts',
      label: 'Contacts',
      icon: 'pi pi-fw pi-id-card',
      expanded: false,
      draggable: false,
      droppable: false,
      type: 'contact',
      children: [
        {
          id: 'contacts-dynamic-views',
          label: 'Dynamic Views',
          icon: 'pi pi-fw pi-filter',
          expanded: true,
          draggable: false,
          droppable: false,
          children: [
            {
              id: 'contacts-all',
              label: 'All Contacts',
              icon: 'pi pi-fw pi-users',
              draggable: false,
              droppable: false,
            },
            {
              id: 'contacts-my',
              label: 'My Contacts',
              icon: 'pi pi-fw pi-star-fill',
              draggable: false,
              droppable: false,
            },
            {
              id: 'contacts-recent',
              label: 'Recently Added',
              icon: 'pi pi-fw pi-clock',
              draggable: false,
              droppable: false,
            },
          ],
        },
        {
          id: 'contacts-saved-lists',
          label: 'Saved Lists',
          icon: 'pi pi-fw pi-folder',
          expanded: true,
          draggable: false,
          droppable: true,
          type: 'contact',
          children: [],
        },
      ],
    },
    {
      id: 'companies',
      label: 'Companies',
      icon: 'pi pi-fw pi-building',
      expanded: false,
      draggable: false,
      droppable: false,
      type: 'company',
      children: [
        {
          id: 'companies-dynamic-views',
          label: 'Dynamic Views',
          icon: 'pi pi-fw pi-filter',
          expanded: true,
          draggable: false,
          droppable: false,
          children: [
            {
              id: 'companies-all',
              label: 'All Companies',
              icon: 'pi pi-fw pi-building',
              draggable: false,
              droppable: false,
            },
            {
              id: 'companies-my',
              label: 'My Companies',
              icon: 'pi pi-fw pi-star-fill',
              draggable: false,
              droppable: false,
            },
            {
              id: 'companies-active',
              label: 'Active Clients',
              icon: 'pi pi-fw pi-check',
              draggable: false,
              droppable: false,
            },
          ],
        },
        {
          id: 'companies-saved-lists',
          label: 'Saved Lists',
          icon: 'pi pi-fw pi-folder',
          expanded: true,
          draggable: false,
          droppable: true,
          type: 'company',
          children: [],
        },
      ],
    },
  ];
}
