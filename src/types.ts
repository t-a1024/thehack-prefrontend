export type CameraState = {
  x: number;
  y: number;
  scale: number;
};

export type MethodNodeSpec = {
  label: string;
};

export type ClassNodeSpec = {
  id?: string;
  name: string;
  methods: MethodNodeSpec[];
};

export type PositionedClassNodeSpec = ClassNodeSpec & {
  id: string;
  x: number;
  y: number;
};

export type NodeBounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ArrowSpec = {
  id?: string;
  fromId: string;
  toId: string;
};