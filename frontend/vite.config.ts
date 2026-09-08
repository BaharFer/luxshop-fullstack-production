import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig } from 'vite';
export default defineConfig({ root: path.resolve(process.cwd(), 'frontend'), plugins: [react(), tailwindcss()], resolve: { alias: { '@': path.resolve(process.cwd(), 'frontend/src') } }, server: { hmr: process.env.DISABLE_HMR !== 'true' } });
