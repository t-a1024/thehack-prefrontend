import { WorldCanvas } from "./world-canvas.js";

const root = document.getElementById("root");
const viewport = document.getElementById("viewport");
const scene = document.getElementById("scene");

if (!root || !viewport || !scene) {
  throw new Error("必要な要素が見つかりません");
}

async function main() {
  const world = new WorldCanvas(
    root,
    viewport as HTMLDivElement,
    scene as HTMLDivElement
  );

  const classAId = world.addClassNode({
    id: "class-a",
    name: "ClassA",
    methods: [
      { label: "methodA()" },
      { label: "methodB()" },
    ],
  });

  const classBId = world.addClassNode({
    id: "class-b",
    name: "ClassB",
    methods: [
      { label: "methodC()" },
      { label: "methodD()" },
    ],
  });

  world.addArrow({
    fromId: classAId,
    toId: classBId,
  });

  await world.layout();

  console.log("test");
}

main().catch(console.error);