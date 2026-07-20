import { SceneBuilder } from "./scene-builder.js";
import { Viewport } from "./viewport.js";
import { ClassElement } from "./class-element.js";
import { MethodElement } from "./method-element.js";
import { InterfaceElement } from "./interface-element.js";
import type { MethodNodeSpec, ClassNodeSpec } from "./types.js";

/**
 * LSP レスポンスの型定義
 */
type LspSymbol = {
  name: string;
  kind: number;
  children?: LspSymbol[];
};

type DocumentSymbolResponse = {
  jsonrpc: string;
  id: number;
  result: LspSymbol[];
};

/**
 * メイン処理
 */
async function main() {
  // DOM を構築
  const builder = new SceneBuilder("root");
  const { viewport, scene } = builder.build();

  // ビューポートを初期化
  const vp = new Viewport(document.getElementById("root")!, viewport, scene);

  // LSP リクエストを送信
  const request = {
    jsonrpc: "2.0",
    id: 1,
    method: "textDocument/documentSymbol",
    params: {
      textDocument: {
        uri: "file:///.../App.java",
      },
    },
  };

  try {
    const response = await fetch("http://localhost:3000/lsp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.statusText}`);
    }

    const json = (await response.json()) as DocumentSymbolResponse;
    const classes = json.result;

    // クラスを表示
    const startX = 100;
    const startY = 100;
    const gapY = 300;

    classes.forEach((clazz, index) => {
      // ClassElement を作成
      const classElement = new ClassElement({
        name: clazz.name,
        children: clazz.children?.map((child) => ({
          label: child.name,
        } as MethodNodeSpec)),
      });

      // シーンに追加（座標指定）
      vp.addRootNode(classElement, startX, startY + index * gapY);

      // メソッドを動的に追加
      if (clazz.children) {
        clazz.children.forEach((methodSymbol) => {
          const methodElement = new MethodElement({
            label: methodSymbol.name,
          });
          vp.addChildNode(classElement.id, methodElement);
        });
      }
    });
  } catch (error) {
    console.error("Failed to load diagram:", error);

    // デモ用のダミーデータを表示
    showDemoData(vp);
  }
}

/**
 * デモ用のダミーデータを表示（LSP が接続できない場合）
 */
function showDemoData(vp: Viewport) {
  console.log("Showing demo data...");

  // サンプル1: User クラス（メソッド付き）
  const userClass = new ClassElement({
    name: "User",
  });

  vp.addRootNode(userClass, 100, 100);

  const getUserMethod = new MethodElement({
    label: "getUser()",
  });
  vp.addChildNode(userClass.id, getUserMethod);

  const setNameMethod = new MethodElement({
    label: "setName(String)",
  });
  vp.addChildNode(userClass.id, setNameMethod);

  // サンプル2: UserDTO インターフェース
  const userDtoInterface = new InterfaceElement({
    name: "UserDTO",
  });

  vp.addRootNode(userDtoInterface, 100, 450);

  const toStringMethod = new MethodElement({
    label: "toString()",
  });
  vp.addChildNode(userDtoInterface.id, toStringMethod);

  // サンプル3: Admin クラス（内部クラス付き）
  const adminClass = new ClassElement({
    name: "Admin",
  });

  vp.addRootNode(adminClass, 400, 100);

  const deleteUserMethod = new MethodElement({
    label: "deleteUser(int)",
  });
  vp.addChildNode(adminClass.id, deleteUserMethod);

  // メソッド内に内部メソッド
  const validateMethod = new MethodElement({
    label: "validate()",
  });
  vp.addChildNode(deleteUserMethod.id, validateMethod);
}

// ページ読み込み時にメイン処理を実行
window.addEventListener("DOMContentLoaded", () => {
  main().catch(console.error);
});
