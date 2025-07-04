/**
 * @file galleryAPI.js
 * @description 갤러리 관련 API 호출 함수들을 모아둔 모듈
 */
import apiClient from './apiClient';

/**
* 서버에서 갤러리 이미지 목록을 조회하는 함수
* @returns {Promise} - Axios 응답 프로미스 반환
*/
export const fetchGalleryImagesAPI = () => {
    // GET 요청을 통해 서버의 '/api/gallery' 엔드포인트에서 이미지 리스트를 받아옴
    return apiClient.get('/api/gallery');
};
