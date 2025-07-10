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
        emptyOutDir: true,

        rollupOptions: {
            output: {
                // JS 파일 경로 설정
                entryFileNames: `js/[name]-[hash].js`,
                // 기타 청크 파일(코드 분할 시) 경로 설정
                chunkFileNames: `js/[name]-[hash].js`,
                // CSS, 이미지 등 기타 에셋 파일 경로 설정
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name.endsWith('.css')) {
                        return `css/[name]-[hash][extname]`;
                    }
                    const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'];
                    if (imageExtensions.some(ext => assetInfo.name.endsWith(ext))) {
                        return `img/[name]-[hash][extname]`;
                    }
                    // 그 외 다른 에셋들은 assets 폴더에 보관
                    return `assets/[name]-[hash][extname]`;
                },
            }
        }
    }
})