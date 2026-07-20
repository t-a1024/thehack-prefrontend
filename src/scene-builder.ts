/**
 * SceneBuilder
 * DOM構造を完全にTypeScriptで生成
 * HTMLには root 要素だけを配置する
 */
export class SceneBuilder {
  private root: HTMLElement;

  constructor(rootId: string) {
    const element = document.getElementById(rootId);
    if (!element) {
      throw new Error(`Element with id "${rootId}" not found`);
    }
    this.root = element;
  }

  /**
   * シーンのDOM構造を生成
   */
  build(): {
    viewport: HTMLDivElement;
    scene: HTMLDivElement;
  } {
    // 既存の内容をクリア
    this.root.innerHTML = "";

    // ビューポート（スクロール可能な領域）
    const viewport = document.createElement("div");
    viewport.id = "viewport";
    viewport.className = "viewport";
    viewport.style.cssText = `
      width: 100%;
      height: 100vh;
      overflow: hidden;
      position: relative;
      background-color: #f9f9f9;
    `;

    // シーン（ノードが配置される領域）
    const scene = document.createElement("div");
    scene.id = "scene";
    scene.className = "scene";
    scene.style.cssText = `
      position: absolute;
      width: 100%;
      height: 100%;
      transform-origin: 0 0;
    `;

    viewport.appendChild(scene);
    this.root.appendChild(viewport);

    return { viewport, scene };
  }

  /**
   * 検索欄を作成（将来機能）
   */
  buildSearchBar(): HTMLInputElement {
    const searchBar = document.createElement("input");
    searchBar.type = "text";
    searchBar.placeholder = "Search...";
    searchBar.className = "search-bar";
    searchBar.style.cssText = `
      position: absolute;
      top: 10px;
      left: 10px;
      width: 300px;
      padding: 8px 12px;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 14px;
      z-index: 100;
    `;

    return searchBar;
  }

  /**
   * ツールバーを作成（将来機能）
   */
  buildToolbar(): HTMLDivElement {
    const toolbar = document.createElement("div");
    toolbar.className = "toolbar";
    toolbar.style.cssText = `
      position: absolute;
      top: 10px;
      right: 10px;
      display: flex;
      gap: 8px;
      padding: 8px;
      background-color: white;
      border: 1px solid #ccc;
      border-radius: 4px;
      z-index: 100;
    `;

    return toolbar;
  }
}
