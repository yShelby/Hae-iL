// 📁 src/features/widgets/MealWidget.jsx

import React, {useEffect, useState} from 'react';
import {
    fetchMealByDate,
    addOrUpdateMeal,
    updateMeal, deleteMeal,
} from '@/api/mealApi.js';
import {useCheckLogin} from "@/hooks/useCheckLogin.js";
import {showToast} from "@shared/UI/Toast.jsx";
import Input from "@shared/styles/Input.jsx";
import Button from "@shared/styles/Button.jsx";
import {useAuth} from "@shared/context/AuthContext.jsx";

export default function MealWidget({date, onDataChange}) {
    const checkLogin = useCheckLogin();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [editing, setEditing] = useState(true);
    const [form, setForm] = useState({
        breakfast: '',
        lunch: '',
        dinner: '',
        snack: '',
    });

    useEffect(() => {
        if (!date) return;
        if (!user) {
            setLoading(false);
            setData(null);
            setEditing(true);
            setForm({ breakfast: '', lunch: '', dinner: '', snack: '' });
            return;
        }

        setLoading(true);

        fetchMealByDate(date)
            .then((res) => {
                setData(res || null);
                if (res) {
                    setForm({
                        breakfast: res.breakfast || '',
                        lunch: res.lunch || '',
                        dinner: res.dinner || '',
                        snack: res.snack || '',
                    });
                    setEditing(false);
                } else {
                    setForm({breakfast: '', lunch: '', dinner: '', snack: ''});
                    setEditing(true);
                }
            })
            .catch(console.error)
            .finally(() =>setLoading(false));
    }, [date]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setForm((prev) => ({...prev, [name]: value}));
    };

    const handleSave = async () => {
        if (!checkLogin()) return;

        if (!date) return showToast.error('날짜가 선택되지 않았습니다.');

        const hasContent = Object.values(form).some((v) => v.trim());
        if (!hasContent) {
            showToast.error('최소 하나의 식사를 입력해주세요.');
            return;
        }

        setLoading(true);
        try {
            let res;
            if (data && data.mealId) {
                res = await updateMeal(data.mealId, {mealDate: date, ...form});
            } else {
                res = await addOrUpdateMeal({mealDate: date, ...form});
            }
            setData(res);
            setEditing(false);
            showToast.success('식사 기록이 저장되었습니다!');
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
        if (!data?.mealId) return;
        if (!window.confirm('정말 삭제하시겠습니까?')) return;

        setLoading(true);
        try {
            await deleteMeal(data.mealId);
            setData(null);
            setForm({breakfast: '', lunch: '', dinner: '', snack: ''});
            setEditing(true);
            showToast.success('식사 기록이 삭제되었습니다!');
            onDataChange?.();
        } catch (err) {
            console.error(err);
            showToast.error("삭제 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="widget meal-widget">
            <h4>식사 기록</h4>

            {loading && <p>로딩 중...</p>}

            {!loading && !editing && data && (
                <>
                    <div className={"meal-details"}>
                        {data.breakfast && <p>아침: {data.breakfast}</p>}
                        {data.lunch && <p>점심: {data.lunch}</p>}
                        {data.dinner && <p>저녁: {data.dinner}</p>}
                        {data.snack && <p>간식: {data.snack}</p>}
                    </div>
                    <div style={{ display :'flex', justifyContent: 'center'}}>
                        <Button variant={"button2"} onClick={() => setEditing(true)}>수정</Button>
                        <Button variant={"button2"} onClick={handleDelete}>삭제</Button>
                    </div>
                </>
            )}

            {!loading && (editing || !data) && (
                <div>
                    <Input
                        name="breakfast"
                        type="text"
                        placeholder="아침"
                        value={form.breakfast}
                        onChange={handleChange}
                    />
                    <Input
                        name="lunch"
                        type="text"
                        placeholder="점심"
                        value={form.lunch}
                        onChange={handleChange}
                    />
                    <Input
                        name="dinner"
                        type="text"
                        placeholder="저녁"
                        value={form.dinner}
                        onChange={handleChange}
                    />
                    <Input
                        name="snack"
                        type="text"
                        placeholder="간식"
                        value={form.snack}
                        onChange={handleChange}
                    />
                    <div style={{ display :'flex', justifyContent: 'center'}}>
                        <Button variant={"button2"} onClick={handleSave}>저장</Button>
                        <Button variant={"button2"} onClick={() => {
                            if (!checkLogin()) return;
                            setEditing(false);
                            if (!data) setForm({breakfast: '', lunch: '', dinner: '', snack: ''});
                        }}>취소
                        </Button>
                    </div>

                </div>
            )}
        </div>
    );
}
