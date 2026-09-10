/// <reference path="../.astro/types.d.ts" />

declare module "*.svg?react" {
  import * as React from "react";
  const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}

declare module "*.wgsl" {
  import type { ShaderSource } from "vgpu";
  const shader: ShaderSource;
  export default shader;
}
