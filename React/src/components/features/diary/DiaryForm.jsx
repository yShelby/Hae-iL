import {useState} from "react";
import axios from 'axios';

export default function OrderForm(){

    const [menu, setMenu] = useState('');
    const [count, setCount] = useState(1);

    const handleSubmit = async () => {
        try {
            const response = await axios.post("http://localhost:8080/diary/form", {
                menu,
                count
            });
            alert(response.data); // 주문이 접수되었습니다!
        } catch (error) {
            console.error('주문 실패:', error);
            alert('주문에 실패했습니다.');
        }
    };

    return(
        <div>
            <input
                type="text" value={menu} onChange={(e) => setMenu(e.target.value)} placeholder="Menu name"/>
            <input type="number" value={count} onChange={(e) => setCount(Number(e.target.value))} placeholder="Number of count"/>
            <button onClick={handleSubmit}>ORDER</button>
        </div>
    )
}
