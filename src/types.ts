export type CameraState = {
  x: number;
  y: number;
  scale: number;
};

export type MethodNodeSpec = {
  label: string;
  onClick?: (event: MouseEvent) => void;
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

export type ArrowSpec = {
  id?: string;
  fromId: string;
  toId: string;
};