import { FlatTreeNode, ITreeNode } from '../models';

/**
 * Utility class for tree node operations
 * Contains pure functions for tree traversal and manipulation
 */
export class TreeUtils {
  /**
   * Find a node by its ID in the tree
   */
  static findNodeById(nodes: ITreeNode[], id: string): ITreeNode | undefined {
    for (const node of nodes) {
      if (node.id === id) {
        return node;
      }
      if (node.children?.length) {
        const found = TreeUtils.findNodeById(node.children, id);
        if (found) return found;
      }
    }
    return undefined;
  }

  /**
   * Find the parent of a node by the node's ID
   */
  static findParentByChildId(
    nodes: ITreeNode[],
    childId: string,
    parent?: ITreeNode,
  ): ITreeNode | undefined {
    for (const node of nodes) {
      if (node.id === childId) {
        return parent;
      }
      if (node.children?.length) {
        const found = TreeUtils.findParentByChildId(node.children, childId, node);
        if (found) return found;
      }
    }
    return undefined;
  }

  /**
   * Build a parent-child map for quick parent lookups
   */
  static buildParentMap(items: ITreeNode[]): Map<ITreeNode, ITreeNode> {
    const map = new Map<ITreeNode, ITreeNode>();
    const processNodes = (nodes: ITreeNode[]) => {
      for (const node of nodes) {
        if (node.children) {
          for (const child of node.children) {
            map.set(child, node);
          }
          processNodes(node.children);
        }
      }
    };
    processNodes(items);
    return map;
  }

  /**
   * Check if potentialChild is a descendant of potentialParent
   */
  static isDescendant(
    parentMap: Map<ITreeNode, ITreeNode>,
    potentialParent: ITreeNode,
    potentialChild: ITreeNode,
  ): boolean {
    let current = parentMap.get(potentialChild);
    while (current) {
      if (current === potentialParent) {
        return true;
      }
      current = parentMap.get(current);
    }
    return false;
  }

  /**
   * Sort children so subfolders (droppable nodes) appear at the top
   */
  static sortChildrenWithSubfoldersFirst(children: ITreeNode[]): ITreeNode[] {
    return [...children].sort((a, b) => {
      const aIsSubfolder = a.droppable ? 1 : 0;
      const bIsSubfolder = b.droppable ? 1 : 0;
      return bIsSubfolder - aIsSubfolder;
    });
  }

  /**
   * Convert tree structure to flat table with parentId for storage
   */
  static treeToFlatNodes(items: ITreeNode[], parentId: string | null = null): FlatTreeNode[] {
    const flatNodes: FlatTreeNode[] = [];

    items.forEach((item, index) => {
      flatNodes.push({
        id: item.id,
        parentId,
        label: item.label,
        icon: item.icon,
        order: index,
        draggable: item.draggable ?? false,
        droppable: item.droppable ?? false,
        expanded: item.expanded,
        link: item.link,
        type: item.type,
      });

      if (item.children?.length) {
        flatNodes.push(...TreeUtils.treeToFlatNodes(item.children, item.id));
      }
    });

    return flatNodes;
  }

  /**
   * Convert flat table with parentId back to tree structure
   */
  static flatNodesToTree(flatNodes: FlatTreeNode[]): ITreeNode[] {
    const nodeMap = new Map<string, ITreeNode>();
    const rootNodes: ITreeNode[] = [];

    // Deduplicate flat nodes - keep only the first occurrence of each ID
    const seenIds = new Set<string>();
    const deduplicatedNodes = flatNodes.filter((node) => {
      if (seenIds.has(node.id)) {
        return false;
      }
      seenIds.add(node.id);
      return true;
    });

    // Sort nodes by order to maintain correct sequence
    const sortedNodes = [...deduplicatedNodes].sort((a, b) => a.order - b.order);

    // First pass: create all nodes
    for (const flat of sortedNodes) {
      const node: ITreeNode = {
        id: flat.id,
        label: flat.label,
        icon: flat.icon,
        draggable: flat.draggable,
        droppable: flat.droppable,
        expanded: flat.expanded,
        link: flat.link,
        type: flat.type,
        children: [],
      };
      nodeMap.set(flat.id, node);
    }

    // Second pass: build tree structure (using sorted order)
    for (const flat of sortedNodes) {
      const node = nodeMap.get(flat.id);
      if (!node) continue;

      if (flat.parentId === null) {
        rootNodes.push(node);
      } else {
        const parent = nodeMap.get(flat.parentId);
        parent?.children?.push(node);
      }
    }

    return rootNodes;
  }

  /**
   * Remove duplicate children from all nodes in the tree (by ID)
   */
  static deduplicateTree(nodes: ITreeNode[]): ITreeNode[] {
    const deduplicateChildren = (children: ITreeNode[]): ITreeNode[] => {
      const seen = new Set<string>();
      const deduplicated: ITreeNode[] = [];

      for (const child of children) {
        if (!seen.has(child.id)) {
          seen.add(child.id);
          if (child.children?.length) {
            child.children = deduplicateChildren(child.children);
          }
          deduplicated.push(child);
        }
      }

      return deduplicated;
    };

    return deduplicateChildren(nodes);
  }

  /**
   * Decode a URL/link to its raw form for reliable comparison.
   * Handles both already-encoded (%20) and raw (space) values.
   */
  static normalizeLink(link: string): string {
    try {
      return decodeURIComponent(link);
    } catch {
      return link;
    }
  }

  /**
   * Check if a node's link matches a given URL (normalizing both sides).
   */
  static matchesUrl(nodeLink: string, url: string): boolean {
    return TreeUtils.normalizeLink(nodeLink) === TreeUtils.normalizeLink(url);
  }

  /**
   * Check if a node or any of its descendants has a link matching the URL.
   * Supports exact match and sub-path match (e.g. /A/B matches node with link /A).
   */
  static hasActiveDescendant(node: ITreeNode, url: string): boolean {
    if (node.link) {
      const normalizedUrl = TreeUtils.normalizeLink(url);
      const normalizedLink = TreeUtils.normalizeLink(node.link);
      // Exact match or URL is a sub-path (with '/' boundary to avoid /A matching /AB)
      if (normalizedLink === normalizedUrl || normalizedUrl.startsWith(normalizedLink + '/')) {
        return true;
      }
    }
    return node.children?.some((child) => TreeUtils.hasActiveDescendant(child, url)) ?? false;
  }

  /**
   * Walk the tree to find the ancestor trail (root → matched node) for a URL.
   * Falls back to the deepest prefix match if no exact match is found.
   */
  static findNodeTrail(nodes: ITreeNode[], url: string): ITreeNode[] {
    // First try an exact match
    for (const node of nodes) {
      const path = TreeUtils.matchNodeExact(node, url);
      if (path) return path;
    }

    // Fallback: find the deepest node whose link is a prefix of the URL
    let bestTrail: ITreeNode[] = [];
    for (const node of nodes) {
      const path = TreeUtils.findClosestPrefix(node, url);
      if (path.length > bestTrail.length) {
        bestTrail = path;
      }
    }
    return bestTrail;
  }

  /** Recursively search for an exact link match, returning the ancestor trail */
  private static matchNodeExact(node: ITreeNode, url: string): ITreeNode[] | null {
    if (node.link && TreeUtils.matchesUrl(node.link, url)) {
      return [node];
    }
    if (node.children) {
      for (const child of node.children) {
        const childPath = TreeUtils.matchNodeExact(child, url);
        if (childPath) {
          return [node, ...childPath];
        }
      }
    }
    return null;
  }

  /** Recursively find the deepest node whose link is a prefix of the URL */
  private static findClosestPrefix(node: ITreeNode, url: string): ITreeNode[] {
    let best: ITreeNode[] = [];

    if (node.link && TreeUtils.normalizeLink(url).startsWith(TreeUtils.normalizeLink(node.link))) {
      best = [node];
    }

    if (node.children) {
      for (const child of node.children) {
        const childPath = TreeUtils.findClosestPrefix(child, url);
        if (childPath.length > 0) {
          const candidate = [node, ...childPath];
          if (candidate.length > best.length) {
            best = candidate;
          }
        }
      }
    }

    return best;
  }
}
