import apiClient from './apiClient';

// current date, userId
export async function fetchSelfDiagnosisStatus( year, month, date) {
    try {
        const response = await apiClient.get(`/api/self-diagnosis/status`,{
            params:  { year, month, date }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching selfDiagnosisApi entries', error);
        throw error;
    }
}

/**
 * 자가진단 결과 제출 API
 * @param {number} totalScore - 검사 총점
 * @param {string} type - 자기진단 종류 ( 'depression', 'anxiety', 'stress')
 * @returns 서버 응답 Promise
 */

export function submitDiagnosis({ totalScore, type }) {
    return apiClient.post(`/api/self-diagnosis/${type}`, {
        totalScore,
    })
        .then(response => response.data)
        .catch(error => {
            console.error('자가진단 제출 오류:', error);
            throw error;
        });
}
