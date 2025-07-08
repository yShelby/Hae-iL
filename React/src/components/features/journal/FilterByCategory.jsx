import React from "react";
import {Button} from "@shared/UI/Button.jsx";
import "./css/FilterByCategory.css"

const CATEGORIES = [
    // enum 타입과 매핑하기 위해서 key값을 대문자로 해야 한다
    {key: "ALL", name: "all"},
    {key: "MOVIE", name: "🎬"},
    {key: "BOOK", name: "📖"},
    {key: "MUSIC", name: "🎵"},
    {key: "ETC", name: "etc"},
];

export const FilterByCategory = ({selectedCategory, onSelectCategory}) => {
    return (
        <div className={"filter-container"}>
            {CATEGORIES.map(category => (
                <Button
                    key={category.key}
                    active={selectedCategory === category.key} // 선택된 카테고리에 따라 버튼 활성화 상태 결정
                    onClick={() => onSelectCategory(category.key)} // 클릭 시 상위 컴포넌트에 선택된 카테고리 전달
                >
                    {category.name}
                </Button>
            ))}
        </div>
    )
}
