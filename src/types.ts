/**
 * 基本的なNodeの仕様（全ノード共通）
 */
export type NodeSpec = {
  id?: string;
  children?: NodeSpec[];
};

/**
 * ルートレベルに配置されるノードの仕様
 */
export type RootNodeSpec = NodeSpec & {
  x: number;
  y: number;
};

/**
 * クラスノードの仕様
 */
export type ClassNodeSpec extends NodeSpec {
  name: string;
  children?: (MethodNodeSpec | ClassNodeSpec)[];
};

/**
 * メソッドノードの仕様
 */
export type MethodNodeSpec extends NodeSpec {
  label: string;
  children?: (MethodNodeSpec | ConstantNodeSpec)[];
};

/**
 * インターフェースノードの仕様
 */
export type InterfaceNodeSpec extends NodeSpec {
  name: string;
  children?: (MethodNodeSpec | ClassNodeSpec)[];
};

/**
 * 定数ノードの仕様（例）
 */
export type ConstantNodeSpec extends NodeSpec {
  name: string;
  type?: string;
};

/**
 * カメラ状態
 */
export type CameraState = {
  x: number;
  y: number;
  scale: number;
};
