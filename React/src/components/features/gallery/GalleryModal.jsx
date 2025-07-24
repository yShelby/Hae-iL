// 📂 File: src/widgets/gallery/GalleryModal.jsx
// 📌 역할:
// - 🖼️ 사용자의 이미지들을 갤러리 형식으로 출력 (S3 URL 변환 포함)
// - 🧲 Dnd-kit을 활용해 이미지 정렬 UI 제공
// - 🔒 로그인 여부 확인 후만 API 호출 가능
// - ❌ 비로그인 시 모달 닫고 경고 토스트 노출
// - 📆 일기 더블 클릭 시 해당 일기로 이동

import React, {useState, useEffect, useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, arrayMove, rectSortingStrategy } from '@dnd-kit/sortable';
import SortableImage from './SortableImage';
import { useGallery } from './GalleryContext';
import './css/Gallery.css';
import {showToast} from "@shared/UI/Toast.jsx";
import {fetchGalleryImagesAPI} from "@api/galleryApi.js";
import {useCheckLogin} from "@/hooks/useCheckLogin.js";
import { useQuery } from '@tanstack/react-query';

// 환경 변수로부터 S3 버킷 정보 로드
const BUCKET_NAME = import.meta.env.VITE_AWS_BUCKET_NAME;
const REGION = import.meta.env.VITE_AWS_REGION;

export const GalleryModal = () => {
    const navigate = useNavigate(); // 📍 일기 페이지 이동용
    const { isGalleryOpen, closeGallery } = useGallery(); // 📂 갤러리 모달 상태 제어
    const checkLogin = useCheckLogin(); // 훅 사용

    // 변경이유 : 갤러리 모달이 열릴때마다 이미지를 새로 불러와 서버에서 계속 쿼리가 실행되고 있어서 변경
    // useQuery 훅을 사용하여 갤러리 이미지를 가져오고 상태 관리
    const {
        data: images = [], // 🖼️ 현재 표시되는 이미지들
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ['galleryImages'],
        queryFn: fetchGalleryImagesAPI,
        enabled: isGalleryOpen && checkLogin(), // 로그인 & 모달이 열릴 때만 쿼리 실행
        select: (response) =>
            response.data.map(img => ({
                ...img,
                url: img.fileKey
                    ? `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${img.fileKey}`
                    : img.url || '',
            })),
        onError: () => {
            showToast.error('갤러리를 불러오는 중 오류가 발생했습니다.');
            closeGallery();
        },
    })
    const [sortedImages, setSortedImages] = React.useState([]);
    // 모달 열릴 때마다 정렬 상태 초기화
    React.useEffect(() => {
        if (images?.length) {
            setSortedImages(images);
        }
    }, [images]);


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

    // 로그인 안 되어있을 경우 닫기
    React.useEffect(() => {
        if (isGalleryOpen && !checkLogin()) {
            showToast.error("로그인이 필요합니다.");
            closeGallery();
        }
    }, [isGalleryOpen, checkLogin]);

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
                                {sortedImages.map(image => (
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
