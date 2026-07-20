import { WorldCanvas } from "./world-canvas.ts";

const root = document.getElementById("root");
const viewport = document.getElementById("viewport");
const scene = document.getElementById("scene");

if (!root || !viewport || !scene) {
  throw new Error("必要な要素が見つかりません");
}

const world = new WorldCanvas(root, viewport as HTMLDivElement, scene as HTMLDivElement);

const classAId = world.addClassNode({
  id: "class-a",
  name: "ClassA",
  x: 100,
  y: 100,
  methods: [
    { label: "methodA()" },
    { label: "methodB()" },
  ],
});

const classBId = world.addClassNode({
  id: "class-b",
  name: "ClassB",
  x: 100,
  y: 400,
  methods: [
    { label: "methodC()" },
    { label: "methodD()" },
  ],
});

world.addArrow({
  fromId: classAId,
  toId: classBId,
});

console.log("test");