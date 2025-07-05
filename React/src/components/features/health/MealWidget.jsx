// 📁 src/features/widgets/MealWidget.jsx

import React, { useEffect, useState } from 'react';
import {
    fetchMealByDate,
    addOrUpdateMeal,
    updateMeal,
} from '@/api/mealApi.js';

export default function MealWidget({ date }) {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({
        breakfast: '',
        lunch: '',
        dinner: '',
        snack: '',
    });

    useEffect(() => {
        if (!date) return;
        setLoading(true);
        setEditing(false);
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
                } else {
                    setForm({ breakfast: '', lunch: '', dinner: '', snack: '' });
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

        setLoading(true);
        try {
            let res;
            if (data && data.mealId) {
                res = await updateMeal(data.mealId, { mealDate: date, ...form });
            } else {
                res = await addOrUpdateMeal({ mealDate: date, ...form });
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
        <div className="widget meal-widget">
            <h4>🍽️ 식사 ({date})</h4>

            {loading && <p>로딩 중...</p>}

            {!loading && !editing && data && (
                <>
                    {data.breakfast && <p>아침: {data.breakfast}</p>}
                    {data.lunch && <p>점심: {data.lunch}</p>}
                    {data.dinner && <p>저녁: {data.dinner}</p>}
                    {data.snack && <p>간식: {data.snack}</p>}
                    <button onClick={() => setEditing(true)}>수정하기</button>
                </>
            )}

            {!loading && !editing && !data && (
                <button onClick={() => setEditing(true)}>식사 기록 추가</button>
            )}

            {!loading && editing && (
                <div>
                    <input
                        name="breakfast"
                        placeholder="아침"
                        value={form.breakfast}
                        onChange={handleChange}
                    />
                    <input
                        name="lunch"
                        placeholder="점심"
                        value={form.lunch}
                        onChange={handleChange}
                    />
                    <input
                        name="dinner"
                        placeholder="저녁"
                        value={form.dinner}
                        onChange={handleChange}
                    />
                    <input
                        name="snack"
                        placeholder="간식"
                        value={form.snack}
                        onChange={handleChange}
                    />
                    <button onClick={handleSave}>저장</button>
                    <button onClick={() => setEditing(false)}>취소</button>
                </div>
            )}
        </div>
    );
}
