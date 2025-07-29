import React, { useState, useEffect } from 'react';
import { useAuth } from '@shared/context/AuthContext.jsx';
import { showToast } from '@shared/UI/Toast.jsx';

// 회원가입 폼과 동일한 항목 리스트, 이후 유지 보수를 위해 API에서 불러오도록 개선
const GENRES = [
    "액션", "모험", "코미디", "애니메이션", "범죄", "다큐멘터리", "드라마",
    "가족", "판타지", "역사", "공포", "음악", "미스터리", "로맨스", "SF",
    "스릴러", "전쟁", "서부"
];

const EMOTIONS = [
    "기쁨/행복", "평온/만족", "분노/짜증", "슬픔/우울", "지루/심심", "불안/걱정"
];

function InitialSurveyChange({ open, onClose, onSaved }) {
    const { user } = useAuth();

    // 선택 상태 관리 (초기값은 user 초기설문 응답값을 배열로 받음)
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [selectedEmotions, setSelectedEmotions] = useState([]);
    const [saving, setSaving] = useState(false);
    const [validationError, setValidationError] = React.useState("");


    // user 정보가 바뀌면 체크 상태 초기화
    useEffect(() => {
        if (user) {
            setSelectedGenres(Array.isArray(user.initialGenre) ? user.initialGenre : []);
            setSelectedEmotions(Array.isArray(user.initialEmotion) ? user.initialEmotion : []);
        } else {
            setSelectedGenres([]);
            setSelectedEmotions([]);
        }
    }, [user]);

    const toggleGenre = (genre) => {
        setSelectedGenres(prev =>
            prev.includes(genre)
                ? prev.filter(g => g !== genre)
                : [...prev, genre]
        );
    };

    const toggleEmotion = (emotion) => {
        setSelectedEmotions(prev =>
            prev.includes(emotion)
                ? prev.filter(e => e !== emotion)
                : [...prev, emotion]
        );
    };

    const handleSave = async () => {
        if (!user) {
            showToast.error('로그인이 필요합니다.');
            return;
        }

        // 유효성 검사
        const genreCheck = validateCheckedLength(selectedGenres, "좋아하는 영화 장르", 1, 3);
        if (!genreCheck.valid) {
            setValidationError(genreCheck.message);
            return;
        }
        const emotionCheck = validateCheckedLength(selectedEmotions, "최근 자주 느낀 감정", 1, 2);
        if (!emotionCheck.valid) {
            setValidationError(emotionCheck.message);
            return;
        }

        // 검증 성공하면 에러 메시지 초기화
        setValidationError("");
        setSaving(true);

        // 이후 개선 : API 분리
        try {
            const res = await fetch('/api/user/initial-survey', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    initialGenre: selectedGenres,
                    initialEmotion: selectedEmotions,
                }),
            });
            const data = await res.json();
            if (res.ok && data.success) {
                showToast.success('설문 정보가 성공적으로 저장되었습니다.');
                onSaved && onSaved(); // 부모에 알림(최신화)
                onClose();
            } else {
                showToast.error(data.message || '저장에 실패했습니다.');
            }
        } catch (error) {
            showToast.error('서버와 통신 중 오류가 발생했습니다.');
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    // 유효성 검사 함수 (React 상태 배열 기준)
    function validateCheckedLength(selectedArray, messageName, min, max) {
        if (selectedArray.length < min) {
            return { valid: false, message: `${messageName}은(는) 최소 ${min}개 이상 선택해 주세요.` };
        }
        if (selectedArray.length > max) {
            return { valid: false, message: `${messageName}은(는) 최대 ${max}개 까지 선택해 주세요.` };
        }
        return { valid: true, message: "" };
    }

    if (!open) return null;

    return (
        <div className="modal-overlay" style={overlayStyle}>
            <div className="modal-content" style={contentStyle}>
                <h3>초기 설문 정보 수정</h3>

                <div>
                    <strong>좋아하는 영화 장르</strong>
                    <div style={checkboxContainerStyle}>
                        {GENRES.map((genre) => (
                            <label key={genre} style={checkboxLabelStyle}>
                                <input
                                    type="checkbox"
                                    checked={selectedGenres.includes(genre)}
                                    onChange={() => toggleGenre(genre)}
                                />
                                {genre}
                            </label>
                        ))}
                    </div>
                </div>

                <div style={{ marginTop: '1rem' }}>
                    <strong>최근 자주 느낀 감정</strong>
                    <div style={checkboxContainerStyle}>
                        {EMOTIONS.map((emotion) => (
                            <label key={emotion} style={checkboxLabelStyle}>
                                <input
                                    type="checkbox"
                                    checked={selectedEmotions.includes(emotion)}
                                    onChange={() => toggleEmotion(emotion)}
                                />
                                {emotion}
                            </label>
                        ))}
                    </div>
                </div>

                {validationError && (
                    <div style={{ color: "red", marginTop: "0.5rem", marginBottom: "1rem" }}>
                        {validationError}
                    </div>
                )}

                <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
                    <button onClick={onClose} disabled={saving} style={{ marginRight: '1rem' }}>
                        취소
                    </button>
                    <button onClick={handleSave} disabled={saving}>
                        {saving ? '저장 중...' : '저장하기'}
                    </button>
                </div>
            </div>
        </div>
    );
}

const overlayStyle = {
    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.4)',
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    zIndex: 9999
};

const contentStyle = {
    backgroundColor: 'white', padding: '1.5rem',
    borderRadius: '8px', width: '400px', maxHeight: '80vh', overflowY: 'auto'
};

const checkboxContainerStyle = {
    display: 'flex', flexWrap: 'wrap', gap: '0.8rem', marginTop: '0.5rem'
};

const checkboxLabelStyle = {
    flexBasis: '50%',
    userSelect: 'none'
};

export default InitialSurveyChange;
