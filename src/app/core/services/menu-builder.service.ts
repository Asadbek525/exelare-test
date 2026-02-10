import { Injectable } from '@angular/core';
import { EntityDefinition, EntityKind, EntityView, RestUserResponse } from '../dto/rest-user.dto';
import { ITreeNode } from '../../shared/components/tree';
import { isHidden } from '../item-props';

/** Entity IDs used throughout the application */
export enum EntityIds {
  Candidates = 'Candidates',
  CandidateSourcing = 'CandidateSourcing',
  Companies = 'Companies',
  Contacts = 'Contacts',
  Consultants = 'Consultants',
  Dashboards = 'Dashboards',
  EmailCampaigns = 'EmailCampaigns',
  Jobs = 'Jobs',
  Leads = 'Leads',
  OnBoarding = 'OnBoarding',
  Opportunities = 'Opportunities',
  Pipeline = 'Pipeline',
  RecycleBin = 'RecycleBin',
  Reports = 'Reports',
  Requirements = 'Requirements',
  SavedLists = 'SavedLists',
}

/** Configuration for entity ordering in the menu */
interface MenuOrderConfig {
  /** Entities that should appear at the top of the menu */
  topEntities: string[];
  /** Entities that should appear at the bottom of the menu */
  bottomEntities: string[];
  /** Entities that should be grouped under "Pipelines" */
  pipelineEntities: string[];
}

/** Default menu ordering configuration */
const DEFAULT_ORDER_CONFIG: MenuOrderConfig = {
  topEntities: [
    EntityIds.Dashboards,
    EntityIds.Candidates,
    EntityIds.Consultants,
    EntityIds.CandidateSourcing,
    EntityIds.Jobs,
    EntityIds.Requirements,
    EntityIds.Companies,
    EntityIds.Contacts,
    EntityIds.Leads,
  ],
  bottomEntities: [EntityIds.SavedLists, EntityIds.OnBoarding, EntityIds.RecycleBin],
  pipelineEntities: [EntityIds.Pipeline],
};

@Injectable({
  providedIn: 'root',
})
export class MenuBuilderService {
  private orderConfig = DEFAULT_ORDER_CONFIG;

  /**
   * Transforms the backend user response into tree nodes for the sidebar menu.
   * This method:
   * 1. Filters out hidden entities
   * 2. Adds synthetic views (like "Match Candidates")
   * 3. Applies custom entity captions
   * 4. Groups pipeline entities
   * 5. Orders entities according to configuration
   */
  buildMenu(response: RestUserResponse): ITreeNode[] {
    if (!response?.entities?.length) {
      return [];
    }

    // Step 1: Filter hidden entities and create a working copy
    const entities = this.filterEntities(response.entities);

    // Step 2: Add synthetic views (e.g., "Match Candidates")
    // this.addSyntheticViews(entities);

    // Step 3: Separate pipeline and regular entities
    const { pipelineEntities, regularEntities } = this.separateEntities(entities);

    // Step 4: Create menu nodes
    const regularNodes = regularEntities.map((entity) => this.createEntityNode(entity));
    const pipelineNode = this.createPipelineNode(pipelineEntities);

    // Step 5: Assemble and order the final menu
    return this.assembleMenu(regularNodes, pipelineNode);
  }

  /**
   * Filters hidden entities and creates a deep copy to avoid mutations
   */
  private filterEntities(entities: EntityDefinition[]): EntityDefinition[] {
    return entities.filter((entity) => !isHidden(entity.properties));
  }

  /**
   * Adds synthetic views to entities (e.g., "Match Candidates" to Consultants)
   */
  // private addSyntheticViews(entities: EntityDefinition[]): void {
  //   const consultantsEntity = entities.find((e) => e.id === EntityIds.Consultants);
  //   if (consultantsEntity) {
  //     const allView = consultantsEntity.views?.find((v) => v.id === 'All');
  //     if (allView) {
  //       const matchCandidatesView: EntityView = {
  //         ...allView,
  //         id: '_MatchConsultants',
  //         caption: 'Match Candidates',
  //       };
  //       consultantsEntity.views.push(matchCandidatesView);
  //     }
  //   }
  // }

  /**
   * Separates entities into pipeline and regular categories
   */
  private separateEntities(entities: EntityDefinition[]): {
    pipelineEntities: EntityDefinition[];
    regularEntities: EntityDefinition[];
  } {
    const pipelineEntities: EntityDefinition[] = [];
    const regularEntities: EntityDefinition[] = [];

    for (const entity of entities) {
      const isPipeline =
        entity.id === EntityIds.Pipeline ||
        entity.caption?.includes('Pipeline') ||
        this.orderConfig.pipelineEntities.includes(entity.id);

      if (isPipeline) {
        pipelineEntities.push(entity);
      } else {
        regularEntities.push(entity);
      }
    }

    return { pipelineEntities, regularEntities };
  }

  /**
   * Creates a tree node for a single entity
   */
  private createEntityNode(entity: EntityDefinition): ITreeNode {
    const children = this.createViewNodes(entity, entity.id);

    return {
      id: entity.id,
      label: entity.caption,
      link: `/${entity.id}`,
      icon: this.getEntityIcon(entity.id),
      draggable: false,
      droppable: true,
      expanded: false,
      type: entity.id,
      children,
    };
  }

  /**
   * Creates view nodes for an entity's views
   */
  private createViewNodes(entity: EntityDefinition, type: EntityIds): ITreeNode[] {
    if (!entity.views?.length) {
      return [];
    }

    return entity.views
      .filter((view) => this.isViewVisible(view))
      .map((view) => ({
        id: view.id,
        label: view.caption,
        icon: 'pi pi-fw pi-list',
        draggable: false,
        droppable: true,
        link: `/${entity.id}/${view.id}`,
        type,
      }));
  }

  /**
   * Determines if a view should be visible in the menu
   */
  private isViewVisible(view: EntityView): boolean {
    // Hide static and saved views by default (kinds 1 and 2)
    if (view.kind === EntityKind.Static || view.kind === EntityKind.Saved) {
      return false;
    }

    // // Hide dynamic views
    // if (view.kind === EntityKind.Dynamic) {
    //   return false;
    // }

    // Hide count views (kind 6)
    if (view.kind === EntityKind.Counts) {
      return false;
    }
    // Check properties for hidden flag
    return !isHidden(view.properties);
  }

  /**
   * Creates the "Pipelines" parent node with all pipeline entities as children
   */
  private createPipelineNode(pipelineEntities: EntityDefinition[]): ITreeNode | null {
    if (!pipelineEntities.length) {
      return null;
    }

    const children: ITreeNode[] = pipelineEntities.flatMap((entity) => {
      const visibleViews = entity.views?.filter((view) => this.isViewVisible(view)) || [];

      return visibleViews.map((view) => ({
        id: view.id,
        label: entity.caption,
        icon: this.getPipelineIcon(entity.id),
        draggable: false,
        droppable: false,
        link: `/grid/${entity.id}/${view.id}/DView`,
        type: entity.id,
      }));
    });

    return {
      id: 'Pipelines',
      label: 'Pipelines',
      icon: 'pi pi-fw pi-sitemap',
      draggable: false,
      droppable: false,
      expanded: false,
      children,
    };
  }

  /**
   * Assembles the final menu by ordering nodes according to configuration
   */
  private assembleMenu(regularNodes: ITreeNode[], pipelineNode: ITreeNode | null): ITreeNode[] {
    const result: ITreeNode[] = [];
    const nodeMap = new Map<string, ITreeNode>();
    const usedIds = new Set<string>();

    // Index nodes by ID for quick lookup
    for (const node of regularNodes) {
      nodeMap.set(node.id, node);
    }

    // Add top entities in order
    for (const entityId of this.orderConfig.topEntities) {
      const node = nodeMap.get(entityId);
      if (node) {
        result.push(node);
        usedIds.add(entityId);
      }
    }

    // Add remaining entities (not in top or bottom lists)
    for (const node of regularNodes) {
      if (!usedIds.has(node.id) && !this.orderConfig.bottomEntities.includes(node.id)) {
        result.push(node);
        usedIds.add(node.id);
      }
    }

    // Add pipelines
    if (pipelineNode) {
      result.push(pipelineNode);
    }

    // Add bottom entities in order
    for (const entityId of this.orderConfig.bottomEntities) {
      if (entityId === EntityIds.SavedLists) continue; // Already added
      const node = nodeMap.get(entityId);
      if (node && !usedIds.has(entityId)) {
        result.push(node);
        usedIds.add(entityId);
      }
    }

    return result;
  }

  /**
   * Gets the appropriate icon for an entity
   */
  private getEntityIcon(entityId: string): string {
    const icons: Record<string, string> = {
      Calculators: 'pi pi-fw pi-calculator',
      Calendar: 'pi pi-fw pi-calendar',
      Candidates: 'pi pi-fw pi-users',
      CandidateSourcing: 'pi pi-fw pi-search',
      Companies: 'pi pi-fw pi-building',
      Consultants: 'pi pi-fw pi-users',
      Contacts: 'pi pi-fw pi-id-card',
      Dashboards: 'pi pi-fw pi-chart-bar',
      Email: 'pi pi-fw pi-envelope',
      EmailCampaigns: 'pi pi-fw pi-send',
      Jobs: 'pi pi-fw pi-briefcase',
      Leads: 'pi pi-fw pi-user-plus',
      Notes: 'pi pi-fw pi-book',
      OnBoarding: 'pi pi-fw pi-check-circle',
      Opportunities: 'pi pi-fw pi-money-bill',
      Pipeline: 'pi pi-fw pi-sitemap',
      RecycleBin: 'pi pi-fw pi-trash',
      Reports: 'pi pi-fw pi-chart-line',
      Requirements: 'pi pi-fw pi-check-square',
      SavedLists: 'pi pi-fw pi-bookmark',
      Tasks: 'pi pi-fw pi-check',
      Timesheets: 'pi pi-fw pi-clock',
      Users: 'pi pi-fw pi-user',
      Vendors: 'pi pi-fw pi-truck',
    };
    return icons[entityId] || 'pi pi-fw pi-folder';
  }

  /**
   * Gets the icon for a pipeline view
   */
  private getPipelineIcon(entityId: string): string {
    const icons: Record<string, string> = {
      [EntityIds.Candidates]: 'pi pi-fw pi-users',
      [EntityIds.Consultants]: 'pi pi-fw pi-users',
      [EntityIds.Contacts]: 'pi pi-fw pi-id-card',
      [EntityIds.Leads]: 'pi pi-fw pi-user-plus',
      [EntityIds.Requirements]: 'pi pi-fw pi-check-square',
    };
    return icons[entityId] || 'pi pi-fw pi-sitemap';
  }
}
