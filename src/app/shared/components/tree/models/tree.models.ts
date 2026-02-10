import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { EntityIds } from '../../../../core/services/menu-builder.service';

/** Available entity types for tree nodes */
export type EntityType = 'Consultants' | 'contact' | 'job' | 'company';

/** Tree node structure used throughout the application */
export interface ITreeNode {
  id: string;
  label: string;
  icon: string;
  expanded?: boolean;
  children?: ITreeNode[];
  draggable?: boolean;
  droppable?: boolean;
  link?: string;
  type?: EntityIds;
  whichId?: string;
}

/** Data structure for external entities being dragged into the tree */
export interface DraggedEntityData {
  id: string;
  label: string;
  type: EntityIds;
  [key: string]: unknown;
}

/** Flat node structure for backend storage/synchronization */
export interface FlatTreeNode {
  id: string;
  parentId: string | null;
  label: string;
  icon: string;
  order: number;
  draggable: boolean;
  droppable: boolean;
  expanded?: boolean;
  link?: string;
  type?: EntityIds;
}

/** State structure for localStorage persistence */
export interface StoredTreeState {
  version: number;
  nodes: FlatTreeNode[];
}

/** Data passed to CDK drop lists */
export interface DropListData {
  node: ITreeNode;
  children: ITreeNode[];
}

/** Type guard to check if data is a tree node (has icon property) */
export function isTreeNode(data: DraggedEntityData | ITreeNode): data is ITreeNode {
  return 'icon' in data;
}

/** Type guard to check if data is an external entity (has type but no icon) */
export function isExternalEntity(data: DraggedEntityData | ITreeNode): data is DraggedEntityData {
  return 'type' in data && !('icon' in data);
}

/** CDK Drag type for tree operations */
export type TreeDrag = CdkDrag<DraggedEntityData | ITreeNode>;

/** CDK DropList type for tree operations */
export type TreeDropList = CdkDropList<DropListData>;
