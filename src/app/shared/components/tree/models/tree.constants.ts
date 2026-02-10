import { EntityIds } from '../../../../core/services/menu-builder.service';

/** Storage key for localStorage */
export const TREE_STORAGE_KEY = 'exelare_tree_state';

/**
 * Storage versi: - increment to reset localStorage when data structure changes
 * Version history:
 * - v1-3: Initial versions
 * - v4: Added type property to dropped nodes for subfolder movement
 * - v5: Refactored architecture, subfolders sorted to top
 * - v6: Added Dynamic Views section per entity
 */
export const TREE_STORAGE_VERSION = 6;

/** Icon mapping for entity types */
export const ENTITY_TYPE_ICONS: Readonly<Record<EntityIds, string>> = {
  Consultants: 'pi pi-fw pi-user',
  Contacts: 'pi pi-fw pi-id-card',
  Jobs: 'pi pi-fw pi-briefcase',
  Companies: 'pi pi-fw pi-building',
  Candidates: 'pi pi-fw pi-users',
  CandidateSourcing: 'pi pi-fw pi-users',
  Dashboards: 'pi pi-fw pi-chart-bar',
  EmailCampaigns: 'pi pi-fw pi-envelope',
  Leads: 'pi pi-fw pi-user-plus',
  OnBoarding: 'pi pi-fw pi-check',
  Opportunities: 'pi pi-fw pi-lightbulb',
  Pipeline: 'pi pi-fw pi-sitemap',
  RecycleBin: 'pi pi-fw pi-trash',
  Reports: 'pi pi-fw pi-chart-line',
  Requirements: 'pi pi-fw pi-file',
  SavedLists: 'pi pi-fw pi-list',
};

/** Default fallback icon */
export const DEFAULT_ICON = 'pi pi-fw pi-file';
