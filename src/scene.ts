import { NodeElement } from "./node-element.js";
import { ConnectionElement } from "./connection-element.js";
import type { RootNodeSpec } from "./types.js";

/**
 * シーン管理
 * ノードとエッジの配置と管理を行う
 */
export class Scene {
  private rootElement: HTMLElement;
  private rootNodes: Map<string, NodeElement> = new Map();
  private connectionElements: ConnectionElement[] = [];
  private nodePositions: Map<string, { x: number; y: number }> = new Map();

  constructor(rootElement: HTMLElement) {
    this.rootElement = rootElement;
  }

  /**
   * ルートレベルのノードを追加
   */
  addRootNode(node: NodeElement, x: number, y: number) {
    this.rootNodes.set(node.id, node);
    this.nodePositions.set(node.id, { x, y });

    // 位置を設定
    node.setStyle({
      position: "absolute",
      left: `${x}px`,
      top: `${y}px`,
    } as any);

    this.rootElement.appendChild(node.element);
  }

  /**
   * 任意のノードに子ノードを追加
   */
  addChildNode(parentId: string, child: NodeElement) {
    const parent = this.findNodeById(parentId);
    if (parent) {
      parent.addChild(child);
    }
  }

  /**
   * ノードを削除
   */
  removeNode(nodeId: string) {
    const node = this.rootNodes.get(nodeId);
    if (node) {
      node.element.remove();
      this.rootNodes.delete(nodeId);
      this.nodePositions.delete(nodeId);
    }
  }

  /**
   * 接続要素を追加
   */
  addConnection(connection: ConnectionElement) {
    this.connectionElements.push(connection);
    this.rootElement.appendChild(connection.element);
  }

  /**
   * 接続要素を削除
   */
  removeConnection(connection: ConnectionElement) {
    const index = this.connectionElements.indexOf(connection);
    if (index > -1) {
      this.connectionElements.splice(index, 1);
      connection.element.remove();
    }
  }

  /**
   * ノードを ID で検索（ルートノードと子ノード両方を検索）
   */
  findNodeById(nodeId: string): NodeElement | undefined {
    // ルートノードを検索
    if (this.rootNodes.has(nodeId)) {
      return this.rootNodes.get(nodeId);
    }

    // ルートノードの子孫を検索
    for (const rootNode of this.rootNodes.values()) {
      const found = this.findNodeInChildren(rootNode, nodeId);
      if (found) return found;
    }

    return undefined;
  }

  /**
   * 再帰的に子ノードから検索
   */
  private findNodeInChildren(parent: NodeElement, nodeId: string): NodeElement | undefined {
    for (const child of parent["children"] || []) {
      if (child.id === nodeId) {
        return child as NodeElement;
      }

      // 子が NodeElement の場合は再帰
      if (child instanceof NodeElement) {
        const found = this.findNodeInChildren(child, nodeId);
        if (found) return found;
      }
    }

    return undefined;
  }

  /**
   * ルートノードの位置を取得
   */
  getRootNodePosition(nodeId: string): { x: number; y: number } | undefined {
    return this.nodePositions.get(nodeId);
  }

  /**
   * ルートノードの位置を更新
   */
  setRootNodePosition(nodeId: string, x: number, y: number) {
    const node = this.rootNodes.get(nodeId);
    if (node) {
      this.nodePositions.set(nodeId, { x, y });
      node.setStyle({
        left: `${x}px`,
        top: `${y}px`,
      } as any);
    }
  }

  /**
   * 全てのルートノードを取得
   */
  getRootNodes(): NodeElement[] {
    return Array.from(this.rootNodes.values());
  }

  /**
   * 全ての接続要素を取得
   */
  getConnections(): ConnectionElement[] {
    return this.connectionElements;
  }

  /**
   * シーンをクリア
   */
  clear() {
    this.rootElement.innerHTML = "";
    this.rootNodes.clear();
    this.connectionElements.clear();
    this.nodePositions.clear();
  }
}
