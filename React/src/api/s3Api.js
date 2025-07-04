/**
 * @file s3API.js
 * @description ☁️ S3 관련 API 호출 함수들을 모아둔 모듈
 */
import apiClient from './apiClient';

/**
 * 🔑 S3에 업로드할 파일의 Presigned URL을 서버에서 요청하는 함수
 * @param {string} filename - 업로드할 파일 이름
 * @returns {Promise} - Axios 응답 프로미스 반환 (Presigned URL 포함)
 */
export const getPresignedUrl = (filename) => {
    // 1️⃣ 서버에 GET 요청: 파일 이름을 쿼리 파라미터로 전달하여 Presigned URL 요청
    return apiClient.get(`/api/s3/presigned-url?filename=${filename}`);

    // 2️⃣ 서버는 해당 파일명에 대해 S3 업로드 권한이 있는 Presigned URL을 생성해 응답
    // 3️⃣ 호출자는 이 Presigned URL을 받아서 S3에 직접 PUT 요청으로 파일 업로드 수행
};
