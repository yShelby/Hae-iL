import apiClient from './apiClient';

export const fetchCalendarEntries = async (year, month) => {
    try {
        const response = await apiClient.get(`/api/calendar`, {
            params: { year, month }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching calendar entries:', error);
        throw error;
    }
};
