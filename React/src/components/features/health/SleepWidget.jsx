// 📁 src/features/widgets/SleepWidget.jsx

import React, {useEffect, useRef, useState} from 'react';
import {
    fetchSleepByDate,
    addOrUpdateSleep,
    updateSleep, deleteSleep,
} from '@/api/sleepApi.js';
import {useCheckLogin} from "@/hooks/useCheckLogin.js";
import {showToast} from "@shared/UI/Toast.jsx";
import useDiaryDraftStore from "@/stores/useDiaryDraftStore.js";

export default function SleepWidget({date, onDataChange}) {
    const checkLogin = useCheckLogin();

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [editing, setEditing] = useState(true);
    const [form, setForm] = useState({
        bedtime: '',
        waketime: '',
    });

    // [추가] 임시저장 스토어 및 초기화 플래그
    const {getDraft, setDraft} = useDiaryDraftStore();
    const isInitialized = useRef(false);

    // [수정] 데이터 로딩 시 임시저장 데이터를 우선으로 적용
    useEffect(() => {
        if (!date) return;
        setLoading(true);
        isInitialized.current = false; // 추가
        const draft = getDraft(date)?.sleep; // [추가] 'sleep' 키로 저장된 임시 데이터를 가져온다

        fetchSleepByDate(date)
            .then((res) => {
                setData(res || null);
                // if (res) {
                //     setForm({
                //         bedtime: res.bedtime || '',
                //         waketime: res.waketime || '',
                //     });
                if (draft) {
                    setForm(draft);
                    setEditing(true);
                } else if (res) {
                    setForm({bedtime: res.bedtime || '', waketime: res.waketime || ''});
                    setEditing(false);
                } else {
                    setForm({bedtime: '', waketime: ''});
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
    }, [date, getDraft]); // 의존성 추가

    // [추가] 폼 내용이 변경될 때마다 임시저장
    useEffect(() => {
        if (isInitialized.current && editing) {
            setDraft(date, { sleep: form }); // ✅ 'sleep' 키로 데이터 저장
        }
    }, [form, editing, date, setDraft]);

    // [추가] 현재 위젯의 임시저장 데이터만 삭제하는 함수
    const clearCurrentDraft = () => {
        setDraft(date, { sleep: null });
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setForm((prev) => ({...prev, [name]: value}));
    };

    const handleSave = async () => {
        if (!checkLogin()) return;

        if (!date) return showToast.error('날짜가 선택되지 않았습니다.');
        if (!form.bedtime || !form.waketime) return showToast.error('취침 시간과 기상 시간을 모두 입력해주세요.');


        setLoading(true);
        try {
            // let res;
            // if (data && data.sleepId) {
            //     res = await updateSleep(data.sleepId, {
            //         sleepDate: date,
            //         bedtime: form.bedtime,
            //         waketime: form.waketime,
            //     });
            // } else {
            //     res = await addOrUpdateSleep({
            //         sleepDate: date,
            //         bedtime: form.bedtime,
            //         waketime: form.waketime,
            //     });
            // }
            // [수정]
            const payload = { sleepDate: date, ...form };
            const res = data?.sleepId ? await updateSleep(data.sleepId, payload) : await addOrUpdateSleep(payload);
            setData(res);
            setEditing(false);
            clearCurrentDraft(); // [추가] 저장 성공 시 임시저장 삭제
            showToast.success('수면 기록이 저장되었습니다!');
            onDataChange?.();
        } catch (err) {
            console.error(err);
            showToast.error('저장 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };
    const handleDelete = async () => {
        if (!checkLogin()) return;

        if (!data?.sleepId) return;
        if (!window.confirm('정말 삭제하시겠습니까?')) return;

        setLoading(true);
        try {
            await deleteSleep(data.sleepId);
            setData(null);
            setForm({bedtime: '', waketime: ''});
            setEditing(true);
            clearCurrentDraft(); // [추가] 삭제 성공 시 임시저장 삭제
            showToast.success('수면 기록이 삭제되었습니다!');
            onDataChange?.();
        } catch (err) {
            console.error(err);
            showToast.error("삭제 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    // [추가] 취소 버튼 핸들러
    const handleCancel = () => {
        clearCurrentDraft(); // ✅ 취소 시 임시저장 삭제
        if (data) {
            setForm({ bedtime: data.bedtime || '', waketime: data.waketime || '' });
            setEditing(false);
        } else {
            setForm({ bedtime: '', waketime: '' });
        }
    };

    return (
        <div className="widget sleep-widget">
            <h4>💤 수면 ({date})</h4>

            {loading && <p>로딩 중...</p>}

            {!loading && !editing && data && (
                <>
                    <p>취침 시간: {data.bedtime}</p>
                    <p>기상 시간: {data.waketime}</p>
                    <p>수면 시간: {data.totalHours} 시간</p>
                    <button onClick={() => setEditing(true)}>수정하기</button>
                    <button onClick={handleDelete}>삭제하기</button>
                </>
            )}

            {!loading && (editing || !data) && (
                <div>
                    <label>
                        취침 시간:
                        <input
                            name="bedtime"
                            type="time"
                            value={form.bedtime}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        기상 시간:
                        <input
                            name="waketime"
                            type="time"
                            value={form.waketime}
                            onChange={handleChange}
                        />
                    </label>
                    <button onClick={handleSave}>저장</button>
                    {/*<button onClick={() => {*/}
                    {/*    if (!checkLogin()) return;*/}
                    {/*    setEditing(false);*/}
                    {/*    if (!data) {*/}
                    {/*        setForm({bedtime: '', waketime: ''});*/}
                    {/*    }*/}
                    {/*}}>취소*/}
                    {/*</button>*/}
                    <button onClick={handleCancel} disabled={loading}>취소</button>
                </div>
            )}
        </div>
    );
}
