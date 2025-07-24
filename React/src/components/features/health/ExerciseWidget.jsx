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
import useDiaryDraftStore from "@/stores/useDiaryDraftStore.js";

export default function ExerciseWidget({date, onDataChange}) {
    const checkLogin = useCheckLogin();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [editing, setEditing] = useState(true);
    const [form, setForm] = useState({
        exerciseType: '',
        duration: '',
        intensity: '',
    });

    // [추가] 임시저장 스토어의 함수들을 가져온다
    const {getDraft, setDraft} = useDiaryDraftStore();
    // [추가] 컴포넌트 첫 로딩 시 불필요한 임시저장을 막기 위한 플래그
    const isInitialized = useRef(false);

    // [수정] 날짜 바뀔 때 데이터 로드
    useEffect(() => {
        if (!date) return;
        setLoading(true);
        isInitialized.current = false; // 추가

        // [추가] 'exercise' 키로 저장된 임시 데이터를 가져온다.
        const draft = getDraft(date)?.exercise;

        fetchExerciseByDate(date)
            .then((res) => {
                setData(res || null);
                // if (res) {
                //     setForm({
                //         exerciseType: res.exerciseType || '',
                //         duration: res.duration || '',
                //         intensity: res.intensity || '',
                //     });
                if (draft) {
                    setForm(draft);
                    setEditing(true);
                } else if (res) {
                    setForm({
                        exerciseType: res.exerciseType || '',
                        duration: res.duration || '',
                        intensity: res.intensity || ''
                    });
                    setEditing(false);
                } else {
                    setForm({exerciseType: '', duration: '', intensity: ''});
                    setEditing(true); // 추가
                }
            })
            .catch(console.error)
            .finally(() => {
                setLoading(false);
                setTimeout(() => { // 추가
                    isInitialized.current = true;
                }, 100);
            });
    }, [date]);

    // [추가] 사용자가 폼을 수정할 때마다 자동으로 임시저장
    useEffect(() => {
        if (isInitialized.current && editing) {
            // ✅ 'exercise' 키로 데이터를 저장하여 다른 데이터와 분리
            setDraft(date, {exercise: form});
        }
    }, [form, editing, date, setDraft]);

    // [추가] 현재 위젯의 임시저장 데이터만 삭제하는 함수
    const clearCurrentDraft = () => {
        setDraft(date, {exercise: null});
    };

    // 폼 input 변경 핸들러
    const handleChange = (e) => {
        const {name, value} = e.target;
        setForm((prev) => ({...prev, [name]: value}));
    };

    // [수정] 저장 버튼 클릭 시 임시 데이터를 삭제
    const handleSave = async () => {
        if (!checkLogin()) return;

        if (!date) return showToast.error('날짜가 선택되지 않았습니다.');
        if (!form.exerciseType || !form.duration) return showToast.error('모든 항목을 입력해주세요.');

        setLoading(true);
        try {
            // let res;
            // if (data && data.exerciseId) {
            //     // 수정 API 호출
            //     res = await updateExercise(data.exerciseId, { exerciseDate: date, ...form, duration: Number(form.duration), intensity: form.intensity });
            // } else {
            //     // 새로 생성 API 호출
            //     res = await addOrUpdateExercise({ exerciseDate: date, ...form, duration: Number(form.duration), intensity: form.intensity, });
            // }
            // [수정]
            const payload = {exerciseDate: date, ...form, duration: Number(form.duration)};
            const res = data?.exerciseId ? await updateExercise(data.exerciseId, payload) : await addOrUpdateExercise(payload);
            setData(res);
            setEditing(false);
            clearCurrentDraft(); // [수정] 저장 성공 시 임시저장 삭제
            showToast.success('운동 기록이 저장되었습니다!');
            // if (typeof onDataChange === 'function') {
            //     onDataChange();  // 변경 알림
            // }
            onDataChange?.(); // 간소화
        } catch (err) {
            console.error(err);
            showToast.error('저장 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // [수정] 삭제 성공 시 임시 데이터를 삭제
    const handleDelete = async () => {
        if (!checkLogin()) return;
        if (!data?.exerciseId) return;
        if (!window.confirm('정말 삭제하시겠습니까?')) return;

        setLoading(true);
        try {
            await deleteExercise(data.exerciseId);
            setData(null);
            setForm({exerciseType: '', duration: '', intensity: ''}); // [추가]
            setEditing(true);
            clearCurrentDraft(); // [추가] 삭제 성공 시 임시저장 삭제
            showToast.success('운동 기록이 삭제되었습니다!');
            onDataChange?.(); // 타임라인 데이터 다시 불러오기
        } catch (err) {
            console.error(err);
            showToast.error("삭제 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    }

    // [추가] 취소 버튼 클릭 시 임시 데이터를 삭제하고 초기화
    const handleCancel = () => {
        clearCurrentDraft(); // ✅ 취소 시 임시저장 삭제
        if (data) {
            setForm({
                exerciseType: data.exerciseType || '',
                duration: data.duration || '',
                intensity: data.intensity || ''
            });
            setEditing(false);
        } else {
            setForm({exerciseType: '', duration: '', intensity: ''});
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
                    <p>강도: {data.intensity}</p>
                    <button onClick={() => setEditing(true)}>수정하기</button>
                    <button onClick={handleDelete}>삭제하기</button>
                </div>
            )}

            {/*{!loading && (editing || !data) && (*/}
            {/* [수정] 렌더링 조건을 editing으로 단순화하여, 데이터가 없어도 입력 폼이 보이도록 수정 */}
            {!loading && editing && (
                <div>
                    <input
                        name="exerciseType"
                        type="text"
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
                    <label>
                        <select name="intensity" value={form.intensity} onChange={handleChange}>
                            <option value="">-- 강도선택 --</option>
                            <option value="낮음">낮음</option>
                            <option value="중간">중간</option>
                            <option value="높음">높음</option>
                        </select>
                    </label>
                    <button onClick={handleSave}>저장</button>
                    {/*<button onClick={() => {*/}
                    {/*    if (!checkLogin()) return;*/}
                    {/*    setEditing(false);*/}
                    {/*    if (!data) {*/}
                    {/*        setForm({ exerciseType: '', duration: '', intensity: '' });*/}
                    {/*    }*/}
                    {/*}}>취소</button>*/}
                    {/* [수정] 취소 버튼의 onClick 이벤트를 handleCancel 함수로 교체 */}
                    <button onClick={handleCancel} disabled={loading}>취소</button>
                </div>
            )}
        </div>
    );
}
