import React from "react";
import {Button} from "@shared/UI/Button.jsx";
import "./css/FilterByCategory.css"

const CATEGORIES = [
    { key: "all", name: "전체보기"},
    { key: "movie", name: "🎬 영화"},
    { key: "book", name: "📖 책"},
    { key: "music", name: "🎵 음악"},
    { key: "etc", name: "기타"},
];

export const FilterByCategory = ({ selectedCategory, onSelectCategory}) => {
    return (
        <div className={"filter-container"}>
            <Button
                key={category.key}
                active={selectedCategory === category.key}
                onClick={() => onSelectCategory(category.key)}
            >
                {category.name}
            </Button>
        </div>
    )
}