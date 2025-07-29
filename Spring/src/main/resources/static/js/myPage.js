//// Spring/src/main/resources/static/js/myPage.js
//
//document.addEventListener('DOMContentLoaded', () => {
//    const currentProfileImage = document.getElementById('currentProfileImage');
//    const currentProfileImageDefault = document.getElementById('currentProfileImageDefault');
//    const profileImageUpload = document.getElementById('profileImageUpload');
//    const changeImageBtn = document.getElementById('changeImageBtn');
//    const deleteImageBtn = document.getElementById('deleteImageBtn');
//
//    // 사용자 ID (Thymeleaf에서 주입받은 값)
//    const currentUserId = window.__USER_ID__; // 여기서 직접 참조
//
//    // 이미지 변경 버튼 클릭 시 파일 입력 필드 클릭
//    if (changeImageBtn) {
//        changeImageBtn.addEventListener('click', () => {
//            profileImageUpload.click();
//        });
//    }
//
//    // 파일 선택 시 처리
//    if (profileImageUpload) {
//        profileImageUpload.addEventListener('change', handleProfileImageUpdate);
//    }
//
//    // 이미지 삭제 버튼 클릭 시 처리
//    if (deleteImageBtn) {
//        deleteImageBtn.addEventListener('click', deleteProfileImage);
//    }
//
//    // 프로필 이미지 업데이트 (업로드) 함수
//    async function handleProfileImageUpdate(event) {
//        const file = event.target.files[0];
//        if (!file) {
//            return;
//        }
//
//        // 미리보기 표시
//        const reader = new FileReader();
//        reader.onload = (e) => {
//            if (currentProfileImage) {
//                currentProfileImage.src = e.target.result;
//                currentProfileImage.style.display = 'block';
//            }
//            if (currentProfileImageDefault) {
//                currentProfileImageDefault.style.display = 'none';
//            }
//        };
//        reader.readAsDataURL(file);
//
//        // 로딩 상태 표시 (필요하다면 UI에 반영)
//        console.log('프로필 이미지 업로드 시작...');
//
//        const filename = file.name;
//        const contentType = file.type;
//
//        try {
//            // 1. 백엔드에 Presigned URL 요청 (userId 사용)
//            // currentUserId가 설정되어 있어야 함
//            if (!currentUserId) {
//                throw new Error('사용자 ID를 찾을 수 없습니다.');
//            }
//            const encodedFilename = encodeURIComponent(filename);
//            const encodedContentType = encodeURIComponent(contentType);
//
//            const presignedUrlResponse = await fetch(`/api/s3/profile-presigned-url?identifier=${currentUserId}&filename=${encodedFilename}&contentType=${encodedContentType}`);
//            if (!presignedUrlResponse.ok) {
//                throw new Error('Presigned URL 요청 실패');
//            }
//            const presignedUrl = await presignedUrlResponse.text();
//
//            // 2. S3에 파일 직접 업로드
//            const s3UploadResponse = await fetch(presignedUrl, {
//                method: 'PUT',
//                headers: {
//                    'Content-Type': contentType,
//                },
//                body: file,
//            });
//
//            if (!s3UploadResponse.ok) {
//                throw new Error('S3 업로드 실패');
//            }
//
//            // 3. S3에 저장된 이미지의 최종 객체 키를 백엔드에 전송하여 UserEntity 업데이트
//            const s3ObjectKey = `profile_images/${currentUserId}/profile.${filename.split('.').pop()}`;
//            console.log('S3 업로드 성공. 최종 S3 객체 키:', s3ObjectKey);
//
//            const updateProfileResponse = await fetch('/api/user/profile-image', {
//                method: 'POST',
//                headers: {
//                    'Content-Type': 'application/json',
//                },
//                body: JSON.stringify({ profileImage: s3ObjectKey }),
//            });
//
//            if (!updateProfileResponse.ok) {
//                throw new Error('프로필 이미지 URL 업데이트 실패');
//            }
//
//            const result = await updateProfileResponse.json();
//            console.log('백엔드 프로필 업데이트 응답:', result);
//
//            if (result.success) {
//                showPopup('프로필 이미지가 성공적으로 변경되었습니다.');
//                // UI 업데이트
//                // currentProfileImage.src = s3ObjectKey; // 미리보기에서 설정됨
//                if (currentProfileImage) currentProfileImage.style.display = 'block';
//                if (currentProfileImageDefault) currentProfileImageDefault.style.display = 'none';
//
//                // 변경된 세션 정보를 반영하기 위해 페이지 새로고침
//                setTimeout(() => { location.reload(); }, 3000); // 지연 시간 3초
//            } else {
//                throw new Error(result.message || '프로필 이미지 변경 실패');
//            }
//
//        } catch (error) {
//            console.error('프로필 이미지 업로드 오류:', error);
//            showPopup('프로필 이미지 변경 실패: ' + error.message);
//        }
//    }
//
//    // 프로필 이미지 삭제 함수
//    async function deleteProfileImage() {
//        if (!confirm('프로필 이미지를 삭제하시겠습니까?')) {
//            return;
//        }
//
//        try {
//            // 1. 백엔드에 프로필 이미지 삭제 요청
//            const deleteResponse = await fetch('/api/user/profile-image', {
//                method: 'DELETE',
//                headers: {
//                    'Content-Type': 'application/json',
//                },
//                // body: JSON.stringify({ userId: currentUserId }), // 필요하다면 userId 전송
//            });
//
//            if (!deleteResponse.ok) {
//                throw new Error('프로필 이미지 삭제 요청 실패');
//            }
//
//            const result = await deleteResponse.json();
//            console.log('백엔드 프로필 삭제 응답:', result);
//
//            if (result.success) {
//                showPopup('프로필 이미지가 성공적으로 삭제되었습니다.');
//                // UI 업데이트: 기본 이미지로 변경
//                if (currentProfileImage) currentProfileImage.style.display = 'none';
//                if (currentProfileImageDefault) {
//                    currentProfileImageDefault.style.display = 'block';
//                    // currentProfileImageDefault.src = '/img/user_sample1.png'; // 이미 HTML에 설정됨
//                }
//
//                // 변경된 세션 정보를 반영하기 위해 페이지 새로고침
//                setTimeout(() => { location.reload(); }, 3000);
//            } else {
//                throw new Error(result.message || '프로필 이미지 삭제 실패');
//            }
//
//        } catch (error) {
//            console.error('프로필 이미지 삭제 오류:', error);
//            showPopup('프로필 이미지 삭제 실패: ' + error.message);
//        }
//    }
//
//    // 팝업 모달 함수 (my-page.html에 이미 정의되어 있을 수 있음)
//    // 중복 정의를 피하기 위해 my-page.html의 showPopup 함수를 재활용하거나,
//    // 여기에 별도로 정의해야 함.
//    // 여기서는 my-page.html에 showPopup 함수가 있다고 가정하고 호출.
//    // 만약 없다면 이 함수를 여기에 추가해야 함.
//    function showPopup(message, callback) {
//        const popupModal = document.getElementById('popup-modal');
//        const popupMessage = document.getElementById('popup-message');
//        const popupCloseBtn = document.getElementById('popup-close-btn');
//
//        if (popupModal && popupMessage && popupCloseBtn) {
//            popupMessage.textContent = message;
//            popupModal.style.display = 'flex';
//            popupCloseBtn.onclick = function() {
//                popupModal.style.display = 'none';
//                if (callback) callback();
//            };
//        } else {
//            alert(message); // 모달이 없으면 alert로 대체
//            if (callback) callback();
//        }
//    }
//
//    const withdrawBtn = document.getElementById('withdraw-btn');
//    const withdrawConfirmModal = document.getElementById('withdraw-confirm-modal');
//    const cancelWithdrawBtn = document.getElementById('cancel-withdraw');
//    const confirmWithdrawBtn = document.getElementById('confirm-withdraw');
//
//    // 회원 탈퇴 버튼 클릭 시 모달 열기
//    if (withdrawBtn) {
//        withdrawBtn.addEventListener('click', () => {
//            withdrawConfirmModal.style.display = 'flex';
//        });
//    }
//
//    // 회원 탈퇴 모달 닫기 (취소 버튼)
//    if (cancelWithdrawBtn) {
//        cancelWithdrawBtn.addEventListener('click', () => {
//            withdrawConfirmModal.style.display = 'none';
//        });
//    }
//
//    // 회원 탈퇴 모달 닫기 (모달 외부 클릭)
//    if (withdrawConfirmModal) {
//        withdrawConfirmModal.addEventListener('click', (event) => {
//            if (event.target === withdrawConfirmModal) {
//                withdrawConfirmModal.style.display = 'none';
//            }
//        });
//    }
//
//    // 회원 탈퇴 최종 확인 버튼 클릭 시
//    if (confirmWithdrawBtn) {
//        confirmWithdrawBtn.addEventListener('click', async () => {
//            withdrawConfirmModal.style.display = 'none'; // 모달 닫기
//            // 여기에 실제 회원 탈퇴 로직 호출 (백엔드 API 호출)
//            await handleUserWithdraw();
//        });
//    }
//
//    // 회원 탈퇴 처리 함수
//    async function handleUserWithdraw() {
//        console.log('회원 탈퇴 처리 시작...');
//        try {
//            const response = await fetch('/api/user/withdraw', {
//                method: 'DELETE', // DELETE 메소드 사용
//                headers: { 'Content-Type': 'application/json' },
//            });
//            const result = await response.json();
//            if (result.success) {
//                showPopup('회원 탈퇴가 완료되었습니다. 메인 페이지로 이동합니다.', () => {
//                    window.location.href = '/'; // 메인 페이지로 리다이렉트
//                });
//            } else {
//                showPopup(result.message || '회원 탈퇴에 실패했습니다.');
//            }
//        } catch (error) {
//            console.error('회원 탈퇴 오류:', error);
//            showPopup('회원 탈퇴 중 오류가 발생했습니다.');
//        }
//    }
//});