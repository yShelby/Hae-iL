import React from 'react';
import {FaStar} from "react-icons/fa";
import "./css/JournalItem.css";
import {Card} from "@shared/UI/Card.jsx";

export const JournalItem = ({journal}) => {
    const {title, content, rating, journalDate} = journal;

    const renderStars = () => {
        return Array.from({length: 5}, (_, index) => (
            <FaStar key={index} color={index < rating ? '#f1c40f' : '#e0e0e0'}/>
        ));
    };

    return (
        <div className={"journal-item-wrapper"}>
            <Card>
                <div className={"journal-item-header"}>
                    <h3 className={"journal-page-title"}>{title}</h3>
                    <div className={"journal-item-rating"}>{renderStars()}</div>
                </div>
                <p className={"journal-item-content"}>{content}</p>
                <span className={"journal-item-date"}>
                        {journalDate ? new Date(journalDate).toLocaleDateString() : '날짜 미지정'}
                    </span>
            </Card>
        </div>
    );
};