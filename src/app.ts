import { ArrowModel } from "./canvas-model/Arrow/ArrowModel.js";
import { ClassModel } from "./canvas-model/block/ClassModel.js";
import { MethodModel } from "./canvas-model/block/MethodModel.js";
import { CanvasMain } from "./CanvasMain.js";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Required element not found");
}

const world = new CanvasMain(root);

const classModels = [
  new ClassModel({
    id: "app",
    name: "App",
    methods: [
      new MethodModel({ label: "main()" }),
      new MethodModel({ label: "start()" }),
      new MethodModel({ label: "shutdown()" }),
    ],
  }),
  new ClassModel({
    id: "controller",
    name: "Controller",
    methods: [
      new MethodModel({ label: "handleRequest()" }),
      new MethodModel({ label: "route()" }),
      new MethodModel({ label: "validate()" }),
    ],
  }),
  new ClassModel({
    id: "service",
    name: "UserService",
    methods: [
      new MethodModel({ label: "createUser()" }),
      new MethodModel({ label: "deleteUser()" }),
      new MethodModel({ label: "findUser()" }),
      new MethodModel({ label: "updateUser()" }),
    ],
  }),
  new ClassModel({
    id: "repository",
    name: "UserRepository",
    methods: [
      new MethodModel({ label: "save()" }),
      new MethodModel({ label: "findById()" }),
      new MethodModel({ label: "findAll()" }),
    ],
  }),
  new ClassModel({
    id: "logger",
    name: "Logger",
    methods: [
      new MethodModel({ label: "info()" }),
      new MethodModel({ label: "warn()" }),
      new MethodModel({ label: "error()" }),
    ],
  }),
  new ClassModel({
    id: "validator",
    name: "Validator",
    methods: [
      new MethodModel({ label: "isValidName()" }),
      new MethodModel({ label: "isValidEmail()" }),
      new MethodModel({ label: "isValidPassword()" }),
    ],
  }),
  new ClassModel({
    id: "cache",
    name: "Cache",
    methods: [
      new MethodModel({ label: "get()" }),
      new MethodModel({ label: "set()" }),
      new MethodModel({ label: "remove()" }),
    ],
  }),
];

const nodeIds = new Map<string, string>();

for (const model of classModels) {
  const id = world.addBlock(model);
  nodeIds.set(model.id, id);
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
  world.addArrow(
    new ArrowModel({
      fromId: nodeIds.get(arrow.fromId) ?? arrow.fromId,
      toId: nodeIds.get(arrow.toId) ?? arrow.toId,
    })
  );
}

await world.layout();

console.log("test");
