import React, {useEffect, useState} from "react";
import MoodResult from "@features/mood/MoodResults.jsx";
import {fetchMoodByDiaryId} from "@api/moodApi.js";

function MoodPage({ selectedDiaryId, refreshKey  }) {
    const [loading, setLoading] = useState(false);
    const [moodResult, setMoodResult] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!selectedDiaryId) {
            setMoodResult(null);
            return;
        }

        setLoading(true);
        setError(null);

        fetchMoodByDiaryId(selectedDiaryId)
            .then(response => {
                setMoodResult(response.data);
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
            {!loading && !error && !moodResult && <p>일기를 작성해주세요.</p>}
            {moodResult && <MoodResult result={moodResult} />}
        </div>
    );
}

export default MoodPage;