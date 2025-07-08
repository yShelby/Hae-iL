import React from 'react';
import {FaStar} from "react-icons/fa";
import "./css/JournalItem.css";
import {Card} from "@shared/UI/Card.jsx";

// 단순히 데이터를 보여주고, 선택되었음을 알리는 역할만 수행
export const JournalItem = ({ journal, onSelect, isSelected }) => {
    const {id, title, content, rating, journalDate} = journal;

    // 아이템 전체 클릭 시 실행될 함수
    const handleItemClick = () => {
        onSelect(id); // 아이템 전체 클릭 시, 부모에게 id를 전달
    };

    // 별점 렌더링: rating 값에 따라 노란색/회색 별 표시
    const renderStars = () => {
        return Array.from({length: 5}, (_, index) => (
            <FaStar key={index} color={index < rating ? '#f1c40f' : '#e0e0e0'}/>
        ));
    };

    // 선택 상태에 따라 'active' 클래스 추가 (선택 시 시각적 강조)
    const wrapperClassName = `journal-item-wrapper ${isSelected ? 'active' : ''}`;

    return (
        // 클릭 영역 전체에 onClick 핸들러 연결
        <div className={wrapperClassName} onClick={handleItemClick}>
            <Card>
                <div className={"journal-item-header"}>
                    <h3 className={"journal-item-title"}>{title}</h3>
                </div>
                <div className={"journal-item-rating"}>{renderStars()}</div>
                <p className={"journal-item-content"}>{content}</p>
                <span className={"journal-item-date"}>
                    {journalDate ? new Date(journalDate).toLocaleDateString() : '날짜 미지정'}
                </span>
            </Card>
        </div>
    );
};
