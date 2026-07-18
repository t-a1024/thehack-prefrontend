export type CameraState = {
  x: number;
  y: number;
  scale: number;
};

export type MethodNodeSpec = {
  label: string;
};

export type ClassNodeSpec = {
  name: string;
  x: number;
  y: number;
  methods: MethodNodeSpec[];
};