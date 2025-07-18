import React, {useEffect, useState} from "react";
import EmotionResult from "../features/emotions/EmotionsResults.jsx";
import {fetchEmotionByDiaryId} from "@api/emotionApi.js";

function EmotionPage({ selectedDiaryId, refreshKey  }) {
    const [emotionResult, setEmotionResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!selectedDiaryId) {
            setEmotionResult(null);
            return;
        }

        setLoading(true);
        setError(null);

        fetchEmotionByDiaryId(selectedDiaryId)
            .then(response => {
                setEmotionResult(response.data);
            })
            .catch(err => {
                console.error("감정 분석 조회 실패:", err);
                setError("감정 분석 결과를 불러오는 데 실패했습니다.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [selectedDiaryId, refreshKey]);


    return (
        <div style={{ padding: 20 }}>
            {loading && <p>분석 결과 불러오는 중...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            {!loading && !error && !emotionResult && <p>일기를 작성해주세요.</p>}
            {emotionResult && <EmotionResult result={emotionResult} />}
        </div>
    );
}

export default EmotionPage;