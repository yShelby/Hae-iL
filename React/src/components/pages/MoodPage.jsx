import React, {useEffect, useState} from "react";
import MoodResult from "@features/mood/MoodResults.jsx";
import {fetchMoodByDiaryId} from "@api/moodApi.js";
import '../features/mood/css/MoodResult.css'
import {useAuth} from "../shared/context/AuthContext.jsx";

function MoodPage({ selectedDiaryId, refreshKey  }) {
    const [loading, setLoading] = useState(false);
    const [moodResult, setMoodResult] = useState(null);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    const hasValidMoodResult =
        moodResult &&
        Array.isArray(moodResult.details) &&
        moodResult.details.length > 0;

    useEffect(() => {
        // diaryId가 바뀌거나 user가 바뀔 때 무조건 초기화
        setMoodResult(null);
        setError(null);

        if (!user || !selectedDiaryId) {
            // setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        fetchMoodByDiaryId(selectedDiaryId)
            .then(response => {
                // mood_result가 없을 수 있으므로 명확하게 체크
                const result = response?.data;

                if (!result || !result.details || result.details.length === 0) {
                    setMoodResult(null);
                } else {
                    setMoodResult(result);
                }
            })
            .catch(err => {
                console.error("감정 분석 조회 실패:", err);
                setError("감정 분석 결과를 불러오는 데 실패했습니다.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [user, selectedDiaryId, refreshKey]);

    // if (!selectedDiaryId) return <p>일기를 불러오는 중...</p>;

    // 더미데이터
    // const [moodResult, setMoodResult] = useState({
    //     mood_score: 60,
    //     details: [
    //         { mood_type: "기쁨/행복", percentage: 60 },
    //         { mood_type: "평온/만족", percentage: 25 },
    //         { mood_type: "중립/기타", percentage: 15 }
    //     ],
    //     tags: ["#행복", "#여유", "#밝음"]}
    // );

    // 1) selectedDiaryId가 없으면(=일기 없음) → '일기 작성 안내' 메시지 보여주기
    if (!selectedDiaryId) {
        return (
            <div className={"mood-results"}>
                <div className="mood-wrapper">
                    <p>일기를 작성해주세요.</p>
                </div>
                <div className="mood-tags-container">
                    <div className="tags-box">
                        <p>일기 작성 후 태그를 확인해보세요!</p>
                    </div>
                </div>
            </div>
        );
    }
    // 2) 로딩 중인 경우
    if (loading) return <p>분석 결과 불러오는 중...</p>;

    // 3) 에러가 있는 경우
    if (error) {
        return (
            <div className={"mood-results"}>
                <div className="mood-wrapper">
                    <p style={{ padding: '0 20px' }}>{error}</p>
                </div>
                <div className="mood-tags-container">
                    <div className="tags-box">
                        <p>다시 시도해주세요!</p>
                    </div>
                </div>
            </div>
        );
    }

    // 4) 감정 분석 결과가 있을 때만 보여주기
    if (hasValidMoodResult) {
        return <MoodResult result={moodResult} />;
    }

    return (
        <div className={"mood-results"}>
            <div className="mood-wrapper">
                <p>일기를 작성해주세요.</p>
            </div>
            <div className="mood-tags-container">
                <div className="tags-box">
                    <p>일기 작성 후 태그를 확인해보세요!</p>
                </div>
            </div>
        </div>
    );
}

export default MoodPage;