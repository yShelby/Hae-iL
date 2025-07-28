// src/components/ProfileImageUploader.jsx
import React, { useState, useRef } from 'react';
import { useAuth } from '@shared/context/AuthContext.jsx';
import { showToast } from '@shared/UI/Toast.jsx';

function ProfileImageUploader() {
    const { user, setUser } = useAuth();
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const fileInputRef = useRef(null);

    const imageUrl = previewUrl
        ? previewUrl
        : user?.profileImage
            ? `https://haeil-gallery-images-garamink.s3.ap-northeast-2.amazonaws.com/${user.profileImage}`
            : null;

    const handleFileChange = async (event) => {

        if (!user || !user.id) {
            showToast.error('로그인이 필요합니다.');
            return;
        }

        const file = event.target.files[0];
        if (!file) return;

        // 이미지 미리보기 설정
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);

        setUploading(true);

        try {
            // 1. Presigned URL API 호출
            const encodedFilename = encodeURIComponent(file.name);
            const encodedContentType = encodeURIComponent(file.type);

            const presignedRes = await fetch(
                `/api/s3/profile-presigned-url?identifier=${user.id}&filename=${encodedFilename}&contentType=${encodedContentType}`,
                { method: 'GET', credentials: 'include' }
            );

            if (!presignedRes.ok) throw new Error('Presigned URL 요청 실패');

            const presignedUrl = await presignedRes.text();

            // 2. S3 업로드
            const uploadRes = await fetch(presignedUrl, {
                method: 'PUT',
                headers: { 'Content-Type': file.type },
                body: file,
            });

            if (!uploadRes.ok) throw new Error('S3 업로드 실패');

            // 3. S3 객체 키 구성 및 백엔드 프로필 이미지 업데이트 API 호출
            const fileExt = file.name.split('.').pop();
            const s3ObjectKey = `profile_images/${user.id}/profile.${fileExt}`;

            const updateRes = await fetch('/api/user/profile-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ profileImage: s3ObjectKey }),
            });

            const updateData = await updateRes.json();

            if (updateRes.ok && updateData.success) {
                showToast.success('프로필 이미지가 성공적으로 변경되었습니다.');
                setUser(prev => ({ ...prev, profileImage: s3ObjectKey }));
                setPreviewUrl(null);  // 프리뷰 초기화 (실제 URL로 변경되어 보여짐)
                setTimeout(()=>{
                    window.location.reload();
                }, 1000); // 1초 딜레이 후 새로고침
            } else {
                throw new Error(updateData.message || '프로필 이미지 업데이트 실패');
            }
        } catch (error) {
            console.error('프로필 이미지 업로드 에러:', error);
            showToast.error(`프로필 이미지 업로드 실패: ${error.message}`);
            setPreviewUrl(null);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async () => {

        if (!user || !user.id) {
            showToast.error('로그인이 필요합니다.');
            return;
        }

        if (!window.confirm('프로필 이미지를 삭제하시겠습니까?')) return;

        try {
            const res = await fetch('/api/user/profile-image', {
                method: 'DELETE',
                credentials: 'include',
            });

            const data = await res.json();

            if (res.ok && data.success) {
                showToast.success('프로필 이미지가 삭제되었습니다.');
                setUser(prev => ({ ...prev, profileImage: null }));
                setPreviewUrl(null);
                setTimeout(()=>{
                    window.location.reload();
                }, 1000); // 1초 딜레이 후 새로고침
            } else {
                throw new Error(data.message || '프로필 이미지 삭제 실패');
            }
        } catch (error) {
            console.error('프로필 이미지 삭제 에러:', error);
            showToast.error(`프로필 이미지 삭제 실패: ${error.message}`);
        }
    };

    return (
        <section className="profile-image-uploader" style={{ marginBottom: '2rem' }}>
            <h3>프로필 이미지 수정</h3>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt="프로필"
                        width={136}
                        height={136}
                        style={{ objectFit: 'cover', borderRadius: '50%', marginRight: '1rem' }}
                    />
                ) : (
                    <div
                        style={{
                            width: 136,
                            height: 136,
                            backgroundColor: '#ddd',
                            borderRadius: '50%',
                            marginRight: '1rem',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            color: '#666',
                            fontSize: '0.9rem',
                        }}
                    >
                        No Image
                    </div>
                )}
                <div>
                    <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        disabled={uploading}
                    />
                    <button onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                        {uploading ? '업로드 중...' : '이미지 변경'}
                    </button>
                    {user?.profileImage && (
                        <button
                            onClick={handleDelete}
                            disabled={uploading}
                            style={{ marginLeft: '1rem', color: 'red' }}
                        >
                            이미지 삭제
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
}

export default ProfileImageUploader;
