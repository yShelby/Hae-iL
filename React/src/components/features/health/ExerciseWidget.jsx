// 📁 src/features/widgets/ExerciseWidget.jsx

import React, {useEffect, useRef, useState} from 'react';
import {
    fetchExerciseByDate,
    addOrUpdateExercise,
    updateExercise, deleteExercise,
} from '@/api/exerciseApi.js';
import {showToast} from "@shared/UI/Toast.jsx";
import {useCheckLogin} from "@/hooks/useCheckLogin.js";
import './css/widget.css';
import Input from "@shared/styles/Input.jsx";
import Button from "@shared/styles/Button.jsx";
import {useAuth} from "@shared/context/AuthContext.jsx";

export default function ExerciseWidget({date, onDataChange}) {
    const checkLogin = useCheckLogin();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [editing, setEditing] = useState(true);
    const [form, setForm] = useState({
        exerciseType: '',
        duration: '',
        intensity: '',
    });

    // 날짜 바뀔 때 데이터 로드
    useEffect(() => {
        if (!date) return;
        // 로그인 안 되어 있으면 로딩 끄고 바로 종료
        if (!user) {
            setLoading(false);
            setData(null);
            setEditing(true);
            setForm({ exerciseType: '', duration: '', intensity: '' });
            return;
        }
        setLoading(true);

        fetchExerciseByDate(date)
            .then((res) => {
                setData(res || null);
                if (res) {
                    setForm({
                        exerciseType: res.exerciseType || '',
                        duration: res.duration || '',
                        intensity: res.intensity || ''
                    });
                    setEditing(false);
                } else {
                    setForm({exerciseType: '', duration: '', intensity: ''});
                    setEditing(true);
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false) );
    }, [date]);

    // 폼 input 변경 핸들러
    const handleChange = (e) => {
        const {name, value} = e.target;
        setForm((prev) => ({...prev, [name]: value}));
    };

    // 저장 버튼 클릭
    const handleSave = async () => {
        if (!checkLogin()) return;

        if (!date) return showToast.error('날짜가 선택되지 않았습니다.');
        if (!form.exerciseType || !form.duration) return showToast.error('모든 항목을 입력해주세요.');

        setLoading(true);
        try {
            let res;
            if (data && data.exerciseId) {
                // 수정 API 호출
                res = await updateExercise(data.exerciseId, { exerciseDate: date, ...form, duration: Number(form.duration), intensity: form.intensity });
            } else {
                // 새로 생성 API 호출
                res = await addOrUpdateExercise({ exerciseDate: date, ...form, duration: Number(form.duration), intensity: form.intensity, });
            }
            setData(res);
            setEditing(false);
            showToast.success('운동 기록이 저장되었습니다!');
            if (typeof onDataChange === 'function') {
                onDataChange();  // 변경 알림
            }
        } catch (err) {
            console.error(err);
            showToast.error('저장 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 삭제하기
    const handleDelete = async () => {
        if (!checkLogin()) return;
        if (!data?.exerciseId) return;
        if (!window.confirm('정말 삭제하시겠습니까?')) return;

        setLoading(true);
        try {
            await deleteExercise(data.exerciseId);
            setData(null);
            setEditing(true);
            setForm({exerciseType: '', duration: '', intensity: ''});
            showToast.success('운동 기록이 삭제되었습니다!');
            onDataChange?.(); // 타임라인 데이터 다시 불러오기
        } catch (err) {
            console.error(err);
            showToast.error("삭제 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="widget exercise-widget">
            <h4>운동기록</h4>

            {loading && <p>로딩 중...</p>}

            {!loading && !editing && data && (
                <div>
                    <div className={"exercise-details"}>
                        <p>종류: {data.exerciseType}</p>
                        <p>시간: {data.duration}분</p>
                        <p>강도: {data.intensity}</p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Button variant={'button2'} onClick={() => setEditing(true)}>수정</Button>
                        <Button variant={'button2'} onClick={handleDelete}>삭제</Button>
                    </div>
                </div>
            )}

            {!loading && (editing || !data) && (
                <div>
                    <Input
                        name="exerciseType"
                        type="text"
                        placeholder="운동 종류"
                        value={form.exerciseType}
                        onChange={handleChange}
                    />
                    <Input
                        name="duration"
                        type="number"
                        placeholder="운동 시간(분)"
                        value={form.duration}
                        onChange={handleChange}
                        min="1"
                    />
                    <label>
                        <select name="intensity" value={form.intensity} onChange={handleChange}>
                            <option value="">-- 강도선택 --</option>
                            <option value="낮음">낮음</option>
                            <option value="중간">중간</option>
                            <option value="높음">높음</option>
                        </select>
                    </label>
                    <div style={{ display :'flex', justifyContent: 'center'}}>
                        <Button variant={'button2'} onClick={handleSave}>저장</Button>
                        <Button variant={'button2'} onClick={() => {
                            if (!checkLogin()) return;
                            setEditing(false);
                            if (!data) {
                                setForm({ exerciseType: '', duration: '', intensity: '' });
                            }
                        }}>취소</Button>
                    </div>
                </div>
            )}
        </div>
    );
}
