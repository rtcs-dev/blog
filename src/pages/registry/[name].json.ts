import type { APIRoute } from "astro";
import registryData from "@/lib/registry/registry.json";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const projectRoot = join(__dirname, "../../../");

export const GET: APIRoute = async ({ params }) => {
  const name = params.name;

  if (!name) {
    return new Response(
      JSON.stringify({ error: "Name parameter is required" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  const item = registryData.items.find((item) => item.name === name);

  if (!item) {
    return new Response(JSON.stringify({ error: "Registry item not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Read the actual file contents
  // The registry path uses "registry/default" for shadcn CLI installation,
  // but the actual source code is in src/lib/registry/ with the rest of the path
  const files = item.files.map((file) => {
    const sourcePath = file.path.replace(/^registry\/default/, "lib/registry");
    const filePath = join(projectRoot, "src", sourcePath);
    const content = readFileSync(filePath, "utf-8");
    return {
      ...file,
      content,
    };
  });

  const registryItem = {
    ...item,
    files,
  };

  return new Response(JSON.stringify(registryItem, null, 2), {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
