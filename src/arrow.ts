import type { ArrowSpec } from "./types.js";

export class Arrow {
  public readonly id: string;
  public readonly fromId: string;
  public readonly toId: string;

  constructor(spec: ArrowSpec) {
    this.id = spec.id ?? Arrow.generateId();
    this.fromId = spec.fromId;
    this.toId = spec.toId;
  }

  private static generateId(): string {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return crypto.randomUUID();
    }
    return `arrow-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
}