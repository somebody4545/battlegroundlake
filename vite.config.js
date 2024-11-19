import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// tailwind import
import tailwindcss from "tailwindcss";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
})
