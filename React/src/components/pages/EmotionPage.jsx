import React, { useState } from "react";
import EmotionResult from "../features/emotions/EmotionsResults.jsx";

function EmotionPage() {


    return (
        <div style={{ padding: 20 }}>
            <h1>일기 감정 분석기</h1>
            {/*    {loading ? "분석 중..." : "감정 분석하기"}*/}
            {/*//*/}
            {/*// {result && <EmotionResult result={result} />}*/}
        </div>
    );
}

export default EmotionPage;