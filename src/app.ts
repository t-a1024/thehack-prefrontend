import { ArrowModel } from "./canvas-model/Arrow/ArrowModel.js";
import { ClassModel } from "./canvas-model/block/ClassModel.js";
import { MethodModel } from "./canvas-model/block/MethodModel.js";
import { CanvasMain } from "./CanvasMain.js";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Required element not found");
}

const world = new CanvasMain(root);

const blockModels = [
  new ClassModel({
    id: "app",
    name: "App",
    children: [
      new MethodModel({ label: "main()" }),
      new MethodModel({ label: "start()" }),
      new MethodModel({ label: "shutdown()" }),
    ],
  }),
  new ClassModel({
    id: "controller",
    name: "Controller",
    children: [
      new MethodModel({ label: "handleRequest()" }),
      new MethodModel({ label: "route()" }),
      new MethodModel({ label: "validate()" }),
    ],
  }),
  new ClassModel({
    id: "service",
    name: "UserService",
    children: [
      new MethodModel({ label: "createUser()" }),
      new MethodModel({ label: "deleteUser()" }),
      new MethodModel({ label: "findUser()" }),
      new MethodModel({ label: "updateUser()" }),
    ],
  }),
  new ClassModel({
    id: "repository",
    name: "UserRepository",
    children: [
      new MethodModel({ label: "save()" }),
      new MethodModel({ label: "findById()" }),
      new MethodModel({ label: "findAll()" }),
    ],
  }),
  new ClassModel({
    id: "logger",
    name: "Logger",
    children: [
      new MethodModel({ label: "info()" }),
      new MethodModel({ label: "warn()" }),
      new MethodModel({ label: "error()" }),
    ],
  }),
  new ClassModel({
    id: "validator",
    name: "Validator",
    children: [
      new MethodModel({ label: "isValidName()" }),
      new MethodModel({ label: "isValidEmail()" }),
      new MethodModel({ label: "isValidPassword()" }),
    ],
  }),
  new ClassModel({
    id: "cache",
    name: "Cache",
    children: [
      new MethodModel({ label: "get()" }),
      new MethodModel({ label: "set()" }),
      new MethodModel({ label: "remove()" }),
      new ClassModel({name: "none", children:[]}),
    ],
  }),
];

const nodeIds = new Map<string, string>();

for (const model of blockModels) {
  const id = world.addBlock(model);
  nodeIds.set(model.id, id);
}

const tekito = new MethodModel({label: "tekito-"})
world.addBlock(tekito);

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
  world.addArrow(
    new ArrowModel({
      fromId: nodeIds.get(arrow.fromId) ?? arrow.fromId,
      toId: nodeIds.get(arrow.toId) ?? arrow.toId,
    })
  );
}

await world.layout();

console.log("test");
