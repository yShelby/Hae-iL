// 📁 src/features/widgets/ExerciseWidget.jsx

import React, { useEffect, useState } from 'react';
import {
    fetchExerciseByDate,
    addOrUpdateExercise,
    updateExercise,
} from '@/api/exerciseApi.js';

export default function ExerciseWidget({ date }) {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({
        exerciseType: '',
        duration: '',
    });

    // 날짜 바뀔 때 데이터 로드
    useEffect(() => {
        if (!date) return;
        setLoading(true);
        setEditing(false);
        fetchExerciseByDate(date)
            .then((res) => {
                setData(res || null);
                if (res) {
                    setForm({
                        exerciseType: res.exerciseType || '',
                        duration: res.duration || '',
                    });
                } else {
                    setForm({ exerciseType: '', duration: '' });
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [date]);

    // 폼 input 변경 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // 저장 버튼 클릭
    const handleSave = async () => {
        if (!date) return alert('날짜가 선택되지 않았습니다.');
        if (!form.exerciseType || !form.duration) return alert('모든 항목을 입력해주세요.');

        setLoading(true);
        try {
            let res;
            if (data && data.exerciseId) {
                // 수정 API 호출
                res = await updateExercise(data.exerciseId, { exerciseDate: date, ...form, duration: Number(form.duration) });
            } else {
                // 새로 생성 API 호출
                res = await addOrUpdateExercise({ exerciseDate: date, ...form, duration: Number(form.duration) });
            }
            setData(res);
            setEditing(false);
        } catch (err) {
            console.error(err);
            alert('저장 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="widget exercise-widget">
            <h4>🏋️ 운동 ({date})</h4>

            {loading && <p>로딩 중...</p>}

            {!loading && !editing && data && (
                <div>
                    <p>종류: {data.exerciseType}</p>
                    <p>시간: {data.duration}분</p>
                    <button onClick={() => setEditing(true)}>수정하기</button>
                </div>
            )}

            {!loading && !editing && !data && (
                <button onClick={() => setEditing(true)}>운동 기록 추가</button>
            )}

            {!loading && editing && (
                <div>
                    <input
                        name="exerciseType"
                        placeholder="운동 종류"
                        value={form.exerciseType}
                        onChange={handleChange}
                    />
                    <input
                        name="duration"
                        type="number"
                        placeholder="운동 시간(분)"
                        value={form.duration}
                        onChange={handleChange}
                        min="1"
                    />
                    <button onClick={handleSave}>저장</button>
                    <button onClick={() => setEditing(false)}>취소</button>
                </div>
            )}
        </div>
    );
}
