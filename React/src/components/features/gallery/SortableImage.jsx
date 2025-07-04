/*
 * =====================================================================
 * 📂 File: src/widgets/gallery/SortableImage.jsx
 *
 * 📌 역할:
 *   - 💠 dnd-kit 기반으로 드래그 가능한 이미지 컴포넌트 구현
 *   - 🖼️ 이미지 미리보기 + 📅 일기 날짜 오버레이 제공
 *   - 🖱️ 더블 클릭 시 연결된 일기로 이동하는 콜백 실행
 *
 * 🔄 데이터 흐름:
 *   1️⃣ 부모 컴포넌트로부터 id, url, diaryId, diaryDate, onDoubleClick props 전달
 *   2️⃣ useSortable 훅을 통해 드래그 위치(transform), 이벤트 리스너 등 수신
 *   3️⃣ transform 값을 CSS로 변환 → style 객체로 적용
 *   4️⃣ 이미지 요소를 렌더링 + 드래그 속성 적용 + 더블클릭 시 이벤트 호출
 * =====================================================================
 */

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export const SortableImage = ({ id, url, diaryId, diaryDate, onDoubleClick }) => {
    // 🔧 1️⃣ dnd-kit 훅으로 드래그 상태 정보 획득
    const {
        attributes,     // 👉 드래그 관련 HTML 속성 (role 등)
        listeners,      // 👉 드래그 이벤트 리스너 (onDragStart 등)
        setNodeRef,     // 👉 해당 DOM 노드 참조 설정 (필수)
        transform,      // 👉 현재 위치 변화 값
        transition,     // 👉 애니메이션 속성
    } = useSortable({ id });

    // 🎨 2️⃣ CSS 스타일: 위치 이동(transform) + 애니메이션 transition 설정
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        // 🧱 3️⃣ 드래그 가능한 컨테이너 요소
        <div
            ref={setNodeRef} // 💡 useSortable의 ref 설정
            style={style} // 🖼️ 이동/애니메이션 적용
            {...attributes} // 🛠️ 드래그 속성 연결
            {...listeners}  // 🧲 드래그 이벤트 리스너 등록
            onDoubleClick={() => onDoubleClick(diaryId)} // 🔗 더블 클릭 시 일기 페이지 이동
            className="sortable-image-container"
        >
            {/* 🖼️ 4️⃣ 이미지 렌더링 */}
            <img src={url} alt={`gallery-img-${id}`} className="gallery-image" />

            {/* 📅 5️⃣ 오버레이에 날짜 표시 */}
            <div className="image-overlay">
                <span className="image-date">{diaryDate}</span>
            </div>
        </div>
    );
};

export default SortableImage;
