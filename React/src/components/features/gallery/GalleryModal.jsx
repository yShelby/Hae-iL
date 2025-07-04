// 📂 File: src/widgets/gallery/GalleryModal.jsx
// 📌 역할:
// - 🖼️ 사용자의 이미지들을 갤러리 형식으로 출력 (S3 URL 변환 포함)
// - 🧲 Dnd-kit을 활용해 이미지 정렬 UI 제공
// - 🔒 로그인 여부 확인 후만 API 호출 가능
// - ❌ 비로그인 시 모달 닫고 경고 토스트 노출
// - 📆 일기 더블 클릭 시 해당 일기로 이동

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, arrayMove, rectSortingStrategy } from '@dnd-kit/sortable';
import SortableImage from './SortableImage';
import { useGallery } from './GalleryContext';
import './css/Gallery.css';
import {useAuth} from "@features/auth/AuthContext.jsx";
import {showToast} from "@shared/UI/Toast.jsx";
import {fetchGalleryImagesAPI} from "@api/galleryApi.js";

// 🪣 환경 변수로부터 S3 버킷 정보 로드
const BUCKET_NAME = import.meta.env.VITE_AWS_BUCKET_NAME;
const REGION = import.meta.env.VITE_AWS_REGION;

export const GalleryModal = () => {
    const [images, setImages] = useState([]); // 🖼️ 현재 표시되는 이미지들
    const [originalImages, setOriginalImages] = useState([]); // 🧾 초기 이미지 백업
    const navigate = useNavigate(); // 📍 일기 페이지 이동용
    const { isGalleryOpen, closeGallery } = useGallery(); // 📂 갤러리 모달 상태 제어
    const { user } = useAuth(); // 👤 현재 로그인 유저

    // 🎬 갤러리 모달 열릴 때 실행되는 효과
    useEffect(() => {
        if (isGalleryOpen) {
            // 🔐 1️⃣ 로그인 체크 (비로그인 시 API 호출 금지)
            if (!user) {
                showToast.error('갤러리를 보려면 로그인이 필요합니다.');
                closeGallery();
                return;
            }

            // ✅ 2️⃣ 로그인 상태면 이미지 로딩 시작
            fetchGalleryImagesAPI()
                .then(response => {
                    // 🧾 S3 URL 포맷 적용
                    const dataWithUrls = response.data.map(img => ({
                        ...img,
                        url: img.fileKey
                            ? `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${img.fileKey}`
                            : img.url || '',
                    }));
                    setImages(dataWithUrls); // ✅ 화면에 보여줄 이미지
                    setOriginalImages(dataWithUrls); // 💾 "원래대로" 버튼용
                })
                .catch(error => {
                    console.error('갤러리 로딩 실패', error);
                    showToast.error('갤러리를 불러오는 중 오류가 발생했습니다.');
                });
        }
    }, [isGalleryOpen, user, closeGallery]); // 🚨 반드시 로그인 상태 변경 감지

    // 🧩 이미지 드래그 후 순서 변경 처리
    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            setImages((items) => {
                const oldIndex = items.findIndex(item => item.fileId === active.id);
                const newIndex = items.findIndex(item => item.fileId === over.id);
                return arrayMove(items, oldIndex, newIndex); // ✨ Dnd-kit 제공 함수
            });
        }
    };

    // ✨ 이미지 더블클릭 → 해당 일기 상세 페이지로 이동
    const handleImageDoubleClick = (diaryId) => {
        navigate(`/diary/${diaryId}`);
        closeGallery(); // 🧼 모달 닫기
    };

    // 🚫 모달이 닫힌 상태면 렌더링하지 않음
    if (!isGalleryOpen) return null;

    // 📸 실제 모달 UI 반환
    return (
        <div className="modal-overlay" onClick={closeGallery}>
            <div className="modal-content gallery-modal-content" onClick={e => e.stopPropagation()}>
                {/* 🧭 상단 헤더 */}
                <div className="gallery-header">
                    <h2>Gallery</h2>
                    <div className="gallery-buttons">
                        <button onClick={() => setImages(originalImages)}>원래대로</button>
                        <button onClick={closeGallery}>닫기</button>
                    </div>
                </div>

                {/* 🖼️ 이미지 그리드 */}
                <div className="gallery-grid">
                    {images.length === 0 ? (
                        <p className="gallery-empty-message">
                            일기 안에 이미지를 넣어주세요
                        </p>
                    ) : (
                        <DndContext
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={images.map(img => img.fileId)}
                                strategy={rectSortingStrategy}
                            >
                                {images.map(image => (
                                    <SortableImage
                                        key={image.fileId}
                                        id={image.fileId}
                                        url={image.url}
                                        diaryId={image.diaryId}
                                        diaryDate={image.diaryDate}
                                        onDoubleClick={handleImageDoubleClick}
                                    />
                                ))}
                            </SortableContext>
                        </DndContext>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GalleryModal;
