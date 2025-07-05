// 📁 src/features/widgets/SleepWidget.jsx

import React, { useEffect, useState } from 'react';
import {
    fetchSleepByDate,
    addOrUpdateSleep,
    updateSleep,
} from '@/api/sleepApi.js';

export default function SleepWidget({ date }) {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({
        bedtime: '',
        waketime: '',
    });

    useEffect(() => {
        if (!date) return;
        setLoading(true);
        setEditing(false);
        fetchSleepByDate(date)
            .then((res) => {
                setData(res || null);
                if (res) {
                    setForm({
                        bedtime: res.bedtime || '',
                        waketime: res.waketime || '',
                    });
                } else {
                    setForm({ bedtime: '', waketime: '' });
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [date]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        if (!date) return alert('날짜가 선택되지 않았습니다.');
        if (!form.bedtime || !form.waketime) return alert('취침 시간과 기상 시간을 모두 입력해주세요.');


        setLoading(true);
        try {
            let res;
            if (data && data.sleepId) {
                res = await updateSleep(data.sleepId, {
                    sleepDate: date,
                    bedtime: form.bedtime,
                    waketime: form.waketime,
                });
            } else {
                res = await addOrUpdateSleep({
                    sleepDate: date,
                    bedtime: form.bedtime,
                    waketime: form.waketime,
                });
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
        <div className="widget sleep-widget">
            <h4>💤 수면 ({date})</h4>

            {loading && <p>로딩 중...</p>}

            {!loading && !editing && data && (
                <>
                    <p>취침 시간: {data.bedtime}</p>
                    <p>기상 시간: {data.waketime}</p>
                    <p>수면 시간: {data.totalHours} 시간</p>
                    <button onClick={() => setEditing(true)}>수정하기</button>
                </>
            )}

            {!loading && !editing && !data && (
                <button onClick={() => setEditing(true)}>수면 기록 추가</button>
            )}

            {!loading && editing && (
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
                    <button onClick={() => setEditing(false)}>취소</button>
                </div>
            )}
        </div>
    );
}
