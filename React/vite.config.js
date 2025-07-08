import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
// 'path' 모듈을 사용하기 위해 이 줄을 추가해야 합니다.
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@components': path.resolve(__dirname, './src/components'),
            '@features': path.resolve(__dirname, './src/components/features'),
            '@shared': path.resolve(__dirname, './src/components/shared'),
            '@pages': path.resolve(__dirname, './src/components/pages'),
            '@api': path.resolve(__dirname, './src/api'),
        },
    },
    server: {
        historyApiFallback: true,
    },
    build: {
        outDir: 'dist',
        emptyOutDir: true
    }
})