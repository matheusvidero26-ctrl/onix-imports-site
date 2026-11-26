// O three.js sozinho passa de 500 kB minificado (~150 kB com gzip): o aviso de tamanho do Vite sobe para 1,2 MB.
import { defineConfig } from 'vite';

export default defineConfig({
  build: { chunkSizeWarningLimit: 1200 },
});
