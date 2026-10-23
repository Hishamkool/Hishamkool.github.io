import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/HishamKool_Portfolio/",
  server: { host: true },
  plugins: [react(), tailwindcss()],
});
