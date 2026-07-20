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
  x: number;
  y: number;
  methods: MethodNodeSpec[];
};

export type ArrowSpec = {
  id?: string;
  fromId: string;
  toId: string;
};