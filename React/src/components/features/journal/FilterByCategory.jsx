// import React from "react";
// import "./css/FilterByCategory.css"
// import Button from "@shared/styles/Button.jsx";
// import {IconBook, IconDeviceTvOld, IconMovie, IconMusic} from "@tabler/icons-react";
//
// const CATEGORIES = [
//     // enum 타입과 매핑하기 위해서 key값을 대문자로 해야 한다
//     {key: "ALL", name: "all"},
//     {key: "MOVIE", name: <IconMovie color="#FB79A2" />},
//     {key: "TV", name: <IconDeviceTvOld color="#FB79A2" />},
//     {key: "BOOK", name: <IconBook color="#FB79A2" />},
//     {key: "MUSIC", name: <IconMusic color="#FB79A2" />}
// ];
//
// export const FilterByCategory = ({selectedCategory, onSelectCategory}) => {
//     return (
//         <div className={"filter-container"}>
//             {CATEGORIES.map(category => (
//                 <Button
//                     key={category.key}
//                     active={selectedCategory === category.key} // 선택된 카테고리에 따라 버튼 활성화 상태 결정
//                     onClick={() => onSelectCategory(category.key)} // 클릭 시 상위 컴포넌트에 선택된 카테고리 전달
//                 >
//                     {category.name}
//                 </Button>
//             ))}
//         </div>
//     )
// }

import React, { useState } from "react";
import "./css/FilterByCategory.css";
// import { IconBook, IconDeviceTvOld, IconMovie, IconMusic } from "@shared/constants/icons.js";
import {Icons} from "@shared/constants/icons.js";
const CATEGORIES = [
    { key: "ALL", name: "All" },
    { key: "MOVIE", name: <Icons.IconMovie /> },
    { key: "TV", name: <Icons.IconDeviceTvOld /> },
    { key: "BOOK", name: <Icons.IconBook /> },
    { key: "MUSIC", name: <Icons.IconMusic /> }
];

// theme prop을 추가합니다.
export const FilterByCategory = ({ onSelectCategory, theme }) => {
    const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0].key);

    const handleCategoryClick = (categoryKey) => {
        setSelectedCategory(categoryKey);
        onSelectCategory(categoryKey);
    };

    return (
        <div className={"filter-container"}>
            {CATEGORIES.map(category => (
                <button
                    key={category.key}
                    // 'theme' prop과 'active' 또는 'inactive' 클래스를 조합합니다.
                    className={`theme1
                        filter-button
                        ${selectedCategory === category.key ? 'active' : 'inactive'}
                    `}
                    onClick={() => handleCategoryClick(category.key)}
                >
                    {category.name}
                </button>
            ))}
        </div>
    );
};