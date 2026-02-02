// Public API for tree component
export { Tree } from './tree';
export { DragService } from './drag-service';
export { isTreeNode, isExternalEntity } from './models';
export type {
  ITreeNode,
  EntityType,
  DraggedEntityData,
  FlatTreeNode,
  DropListData,
} from './models';

// Backwards compatibility
export type { DraggedData } from './drag-service';
