// src/utils/jsonParser.jsx

/**
 * JSON 문자열을 배열로 파싱
 * @param {string} json
 * @returns {string[]} 배열 또는 빈 배열 반환
 */
export default function parseJsonToList(json) {
    if (!json) return [];
    try {
        const parsed = JSON.parse(json);
        if (Array.isArray(parsed)) {
            return parsed;
        }
        return [];
    } catch (e) {
        console.error('JSON parsing error:', e);
        return [];
    }
}
