// ======================================================================
// 📄 File: useImageUpload.js
//
// 📌 역할:
//   - ✍️ TipTap 에디터에서 이미지 업로드 처리 전담 커스텀 훅
//   - 📎 Base64 → S3 업로드 → URL로 교체까지 자동 처리
//
// 🔄 데이터 흐름:
// 1️⃣ 사용자가 파일 선택 → handleImageUpload(file) 실행
//    ⬇
// 2️⃣ Base64 인코딩 후 에디터에 임시 삽입 + pendingImages에 저장
//    ⬇
// 3️⃣ 저장 시 uploadPendingImagesToS3(contentJson) 호출
//    ⬇
// 4️⃣ 각 파일에 대해 S3 presigned URL 요청 → PUT 업로드
//    ⬇
// 5️⃣ contentJson 내 Base64 URL을 S3 실제 URL로 교체
//    ⬇
// 6️⃣ 변환된 contentJson을 반환하여 백엔드 저장
// ======================================================================

import { useState, useCallback } from 'react';
import axios from 'axios';
import {showToast} from "@shared/UI/Toast.jsx";
import {getPresignedUrl} from "@api/s3Api.js";

// 📸 TipTap JSON 내 이미지 노드 개수 세기 (1개 제한 체크용)
const countImagesInEditor = (node) => {
    let count = 0;
    if (node.type === 'image') count = 1;
    if (node.content) {
        count += node.content.reduce((acc, child) => acc + countImagesInEditor(child), 0);
    }
    return count;
};

// 🧩 커스텀 훅 정의
export const useImageUpload = (editor) => {
    const [pendingImages, setPendingImages] = useState([]); // 🕓 아직 S3 업로드 전인 이미지들

    /**
     * 🖼️ 이미지 업로드 핸들러 (에디터 삽입 + 대기 목록 저장)
     * @param {File} file - 사용자가 선택한 이미지 파일
     */
    const handleImageUpload = useCallback((file) => {
        if (!file || !editor) return;

        // 🔐 이미지 1개만 허용
        const currentCount = countImagesInEditor(editor.getJSON());
        if (currentCount >= 1) {
            showToast.error('일기에는 이미지를 1개만 등록할 수 있습니다.');
            return;
        }

        // 📷 File → Base64 변환 후 에디터에 임시 삽입
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = reader.result;

            // 2️⃣ Base64 이미지 삽입
            editor.chain().focus().setImage({ src: base64 }).run();

            // 3️⃣ pendingImages에 추가 (나중에 교체용)
            setPendingImages((prev) => [...prev, { file, placeholderSrc: base64 }]);
        };
        reader.readAsDataURL(file);
    }, [editor]);

    /**
     * 💾 저장 시 호출되는 함수 (Base64 → S3 업로드 → JSON src 교체)
     * @param {Object} contentJson - TipTap의 JSON 포맷 문서
     * @returns {Object} src가 교체된 새 JSON
     */
    const uploadPendingImagesToS3 = useCallback(async (contentJson) => {
        let updatedContent = contentJson;

        for (const { file, placeholderSrc } of pendingImages) {
            // 1️⃣ S3 업로드용 presigned URL 요청
            const res = await getPresignedUrl(file.name);
            const { presignedUrl, fileKey } = res.data;

            // 2️⃣ 이미지 실제 업로드 (PUT 요청)
            await axios.put(presignedUrl, file, {
                headers: { 'Content-Type': file.type },
            });

            // 3️⃣ 최종 S3 URL 구성
            const finalUrl = `https://haeil-gallery-images-garamink.s3.ap-northeast-2.amazonaws.com/${fileKey}`;

            // 4️⃣ TipTap JSON에서 Base64 src → S3 URL로 교체
            const replaceSrc = (node) => {
                if (node.type === 'image' && node.attrs?.src === placeholderSrc) {
                    node.attrs.src = finalUrl;
                }
                if (node.content) {
                    node.content.forEach(replaceSrc);
                }
            };

            if (updatedContent?.content) {
                updatedContent.content.forEach(replaceSrc);
            }
        }

        // 5️⃣ pendingImages 초기화
        setPendingImages([]);

        // 6️⃣ S3 URL로 교체된 JSON 반환
        return updatedContent;
    }, [pendingImages]);

    // 🔄 외부에서 사용할 기능 반환
    return {
        pendingImages,              // ⏳ 대기 중인 이미지 목록
        handleImageUpload,         // 📥 업로드 요청 핸들러
        uploadPendingImagesToS3,   // ⛅ S3 저장 처리
    };
};
