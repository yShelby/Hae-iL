import {useEffect, useState} from "react";
import {getJournals} from "@api/journalApi.js";
import "./css/JournalList.css";

export const JournalList = ({category}) => {
    const [journals, setJournals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchJournals = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getJournals(category);
                setJournals(data);
            } catch (e) {
                setError("데이터를 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.");
            } finally {
                setLoading(false);
            }
        };
        fetchJournals();
    }, [category]);

    if (loading) {
        return <div className={"status-message"}>로딩 중...</div>;
    }
    if (error) {
        return <div className={"status-message"}>{error}</div>;
    }
    if (journals.length === 0) {
        return <div className={"status-message"}>작성된 기록이 없습니다.</div>;
    }

    return (
        <div className={"journal-list-container"}>
            {journals.map((journal) => (
                <JournalItem key={journal.id} journal={journal} />
                ))}
        </div>
    );
};