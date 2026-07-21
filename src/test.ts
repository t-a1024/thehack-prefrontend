import { WorldCanvas } from "./world-canvas.ts";
import type { MethodNodeSpec } from "./types.ts";

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

const root = document.getElementById("root");
const viewport = document.getElementById("viewport");
const scene = document.getElementById("scene");

if (!root || !viewport || !scene) {
  throw new Error("必要な要素が見つかりません");
}

const world = new WorldCanvas(
  root,
  viewport as HTMLDivElement,
  scene as HTMLDivElement
);

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

async function load() {
  const response = await fetch("http://localhost:3000/lsp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const json = (await response.json()) as DocumentSymbolResponse;

  const classes = json.result;

  const startX = 100;
  const startY = 100;
  const gapY = 300;

  const classIds:string[] = [];

  classes.forEach((clazz, index) => {
    const classId = world.addClassNode({
      name: clazz.name,
      x: startX,
      y: startY + index * gapY,
      methods:
        clazz.children?.map((child) => ({ label: child.name } as MethodNodeSpec)) ?? [],
    });
    classIds.push(classId);
  });

  for (let index = 0; index < classIds.length; index+=2) {
    const classAId = classIds[index];
    const classBId = classIds[index+1]

    if (classAId&&classBId) {
      world.addArrow({
        fromId: classBId,
        toId: classAId
      });
    }
  }
}

load().catch(console.error);