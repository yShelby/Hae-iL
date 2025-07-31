import React from "react";
import styled from "styled-components";

const HeadContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 8px;
`;

const YearMonth = styled.div`
    flex: 1;
    text-align: center;
    font-size: 1.2rem;
    font-weight: bold;
`;

function CalendarHead({ onPrev, onToday, onNext, currentDate }) {
    return (
        <HeadContainer className="head-container">
            <ButtonGroup>
                <button onClick={onPrev}>이전</button>
                <button onClick={onToday}>이번 달</button>
                <button onClick={onNext}>다음</button>
            </ButtonGroup>
            <YearMonth>
                {currentDate.getFullYear()}년 {String(currentDate.getMonth() + 1).padStart(2, "0")}월
            </YearMonth>
            {/* 오른쪽 공간 비움(정렬용) */}
            <div style={{ width: "96px" }} />
        </HeadContainer>
    );
}

export default CalendarHead;
