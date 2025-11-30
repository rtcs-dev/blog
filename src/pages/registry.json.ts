import type { APIRoute } from "astro";
import registryData from "@/lib/registry/registry.json";

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify(registryData, null, 2), {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
