import { WorldCanvas } from "./world-canvas.js";

const root = document.getElementById("root");

if (!root) {
  throw new Error("必要な要素が見つかりません");
}

const world = new WorldCanvas(
  root,
);

const classSpecs = [
  {
    id: "app",
    name: "App",
    methods: [
      { label: "main()" },
      { label: "start()" },
      { label: "shutdown()" },
    ],
  },
  {
    id: "controller",
    name: "Controller",
    methods: [
      { label: "handleRequest()" },
      { label: "route()" },
      { label: "validate()" },
    ],
  },
  {
    id: "service",
    name: "UserService",
    methods: [
      { label: "createUser()" },
      { label: "deleteUser()" },
      { label: "findUser()" },
      { label: "updateUser()" },
    ],
  },
  {
    id: "repository",
    name: "UserRepository",
    methods: [
      { label: "save()" },
      { label: "findById()" },
      { label: "findAll()" },
    ],
  },
  {
    id: "logger",
    name: "Logger",
    methods: [
      { label: "info()" },
      { label: "warn()" },
      { label: "error()" },
    ],
  },
  {
    id: "validator",
    name: "Validator",
    methods: [
      { label: "isValidName()" },
      { label: "isValidEmail()" },
      { label: "isValidPassword()" },
    ],
  },
  {
    id: "cache",
    name: "Cache",
    methods: [
      { label: "get()" },
      { label: "set()" },
      { label: "remove()" },
    ],
  },
];

const nodeIds = new Map<string, string>();

for (const spec of classSpecs) {
  const id = world.addClassNode(spec);
  nodeIds.set(spec.id, id);
}

const arrows = [
  { fromId: "app", toId: "controller" },
  { fromId: "app", toId: "logger" },
  { fromId: "controller", toId: "service" },
  { fromId: "controller", toId: "validator" },
  { fromId: "service", toId: "repository" },
  { fromId: "service", toId: "logger" },
  { fromId: "repository", toId: "cache" },
  { fromId: "validator", toId: "logger" },
  { fromId: "cache", toId: "logger" },
  { fromId: "service", toId: "cache" },
];

for (const arrow of arrows) {
  world.addArrow({
    fromId: nodeIds.get(arrow.fromId)!,
    toId: nodeIds.get(arrow.toId)!,
  });
}

world.layout();

console.log("test");