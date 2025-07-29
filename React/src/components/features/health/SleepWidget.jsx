// 📁 src/features/widgets/SleepWidget.jsx

import React, {useEffect, useState} from 'react';
import {
    fetchSleepByDate,
    addOrUpdateSleep,
    updateSleep, deleteSleep,
} from '@/api/sleepApi.js';
import {useCheckLogin} from "@/hooks/useCheckLogin.js";
import {showToast} from "@shared/UI/Toast.jsx";
import Button from "@shared/styles/Button.jsx";
import Input from "@shared/styles/Input.jsx";
import {useAuth} from "@shared/context/AuthContext.jsx";

export default function SleepWidget({date, onDataChange}) {
    const checkLogin = useCheckLogin();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [editing, setEditing] = useState(true);
    const [form, setForm] = useState({
        bedtime: '',
        waketime: '',
    });

    useEffect(() => {
        if (!date) return;
        if (!user) {
            setData(null);
            setEditing(true);
            setForm({ bedtime: '', waketime: '' });
            setLoading(false);
            return;
        }
        setLoading(true);

        fetchSleepByDate(date)
            .then((res) => {
                setData(res || null);
                if (res) {
                    setForm({
                        bedtime: res.bedtime || '',
                        waketime: res.waketime || '',
                    });
                    setEditing(false);
                } else {
                    setForm({bedtime: '', waketime: ''});
                    setEditing(true);
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [date]);

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
            showToast.success('수면 기록이 삭제되었습니다!');
            onDataChange?.();
        } catch (err) {
            console.error(err);
            showToast.error("삭제 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="widget sleep-widget">
            <h4>수면 기록</h4>

            {loading && <p>로딩 중...</p>}

            {!loading && !editing && data && (
                <div>
                    <div className={"sleep-details"}>
                        <p>취침 시간: {data.bedtime}</p>
                        <p>기상 시간: {data.waketime}</p>
                        <p>수면 시간: {data.totalHours} 시간</p>
                    </div>
                    <div style={{ display :'flex', justifyContent: 'center'}}>
                        <Button variant={"button2"} onClick={() => setEditing(true)}>수정</Button>
                        <Button variant={"button2"} onClick={handleDelete}>삭제</Button>
                    </div>
                </div>
            )}

            {!loading && (editing || !data) && (
                <div>
                    <div style={{marginBottom: '10px'}}>
                        <label className="inline-label">
                            <span>취침 </span>
                            <Input
                                name="bedtime"
                                type="time"
                                value={form.bedtime}
                                onChange={handleChange}
                                placeholder="취침 시간"
                            />
                        </label>
                        <label className="inline-label">
                            <span>기상 </span>
                            <Input
                                name="waketime"
                                type="time"
                                value={form.waketime}
                                onChange={handleChange}
                            />
                        </label>
                    </div>
                    <div style={{ display :'flex', justifyContent: 'center'}}>
                        <Button variant={"button2"} onClick={handleSave}>저장</Button>
                        <Button variant={"button2"} onClick={() => {
                            if (!checkLogin()) return;
                            setEditing(false);
                            if (!data) {
                                setForm({bedtime: '', waketime: ''});
                            }
                        }}>취소
                        </Button>
                    </div>

                </div>
            )}
        </div>
    );
}
