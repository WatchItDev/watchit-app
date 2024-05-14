import { createHelia } from "helia";
import { unixfs } from "@helia/unixfs";

// Tricky implementation to allow handle helia in electron and browser
// Helia is an ESM-only module but Electron currently only supports CJS
// at the top level, so we have to use dynamic imports to load it
export async function Helia() {
  const node = await createHelia({ start: true });
  const fs = unixfs(node);

  return {
    node,
    fs,
  };
}
