import React from "react";
import styled from "styled-components";
import Button from "@shared/styles/Button.jsx";
import { IconChevronLeft, IconChevronRight, IconCircle } from '@tabler/icons-react';
import '../../pages/css/MonthlyPage.css'

const HeadContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: .5rem;
    width: 100%;
    height: 75px;
`;

const ButtonGroup = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 0 1.5rem;
`;

const YearMonth = styled.div`
    text-align: center;
    font-size: 1.2rem;
    font-weight: bold;
`;

function CalendarHead({ onPrev, onToday, onNext, currentDate }) {
    return (
        <HeadContainer>
            <ButtonGroup>
                <Button className="head-btn" variant="button4" icon={ IconChevronLeft } onClick={onPrev}></Button>
                <YearMonth>
                    <span className="current-month-text" onClick={onToday}>
                        {currentDate.getFullYear()}년 {String(currentDate.getMonth() + 1).padStart(2, "0")}월
                    </span>
                </YearMonth>
                <Button className="head-btn" variant="button4" icon={ IconChevronRight } onClick={onNext}></Button>
            </ButtonGroup>
            {/*<div style={{ width: "96px" }} />*/}
        </HeadContainer>
    );
}

export default CalendarHead;
