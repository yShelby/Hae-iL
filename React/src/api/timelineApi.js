import axios from 'axios';

export const fetchWeeklyTimelineAPI = (start, end) => {
    return axios.get(`/api/timeline?start=${start}&end=${end}`);
}