import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        // AQUI ESTÁ O TRUQUE:
        // Quando o app pedir "process.env.API_KEY", entregue o que está no "VITE_API_KEY"
        'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY),
        
        // Mantemos esse também por segurança, apontando para o mesmo lugar
        'process.env.GEMINI_API_KEY': JSON.stringify(env.VITE_API_KEY)
    },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
