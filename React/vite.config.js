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
        // 📌 참고: outDir을 Spring Boot 프로젝트의 static 폴더로 직접 지정하면
        // 빌드 후 파일을 복사하는 과정을 생략할 수 있습니다.
        // 예: outDir: path.resolve(__dirname, '../backend/src/main/resources/static'),
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
                    // 확장자를 추출하기 위해 path.extname 사용
                    // assetInfo.name이 undefined일 수도 있으니 기본값 '' 처리
                    const ext = path.extname(assetInfo.name || '');
                    // 확장자 제외 파일 이름만 추출
                    const name = path.basename(assetInfo.name || '', ext);

                    // CSS 파일은 css 폴더로 분리
                    if (ext === '.css') {
                        return `css/${name}-[hash]${ext}`;
                    }

                    // 이미지 파일 확장자 목록 (소문자 비교)
                    const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'];

                    // 이미지 파일이면 images 폴더로 분리
                    if (imageExtensions.includes(ext.toLowerCase())) {
                        return `images/${name}-[hash]${ext}`; // ✨ 'images' 폴더로 변경
                    }

                    // 그 외 에셋은 assets 폴더로 보관
                    return `assets/${name}-[hash]${ext}`;
                },
            }
        }
    }
})
