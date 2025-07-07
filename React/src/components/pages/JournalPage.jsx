import React, {useState} from "react";
import "./css/Journal.css";
import {Link} from "react-router-dom";
import {FilterByCategory} from "@features/journal/FilterByCategory.jsx";
import {JournalList} from "@features/journal/JournalList.jsx";

const JournalPage = () => {
    const [selectedCategory, setSelectedCategory] = useState("all");

    return (
        <div className="journal-page-container">
            <div className={"journal-page-header"}>
                <h1 className={"journal-page-title"}>나의 저널 기록</h1>
                <Link to={"/journal/write"} className={"btn"}>글쓰기</Link>
            </div>
            <FilterByCategory
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
            />
            <JournalList category={selectedCategory} />
        </div>
    );
};

export default JournalPage;