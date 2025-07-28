import React from 'react';

function UserProfileInfo({ user }) {
    if (!user) return null;

    const imageUrl = user.profileImage
        ? `https://haeil-gallery-images-garamink.s3.ap-northeast-2.amazonaws.com/${user.profileImage}`
        : null;

    return (
        <section className="user-profile-info" style={{ marginBottom: '2rem' }}>
            <h3>내 정보</h3>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <div>
                    <p><strong>닉네임:</strong> {user.nickname}</p>
                    <p><strong>이메일:</strong> {user.email}</p>
                </div>
            </div>
        </section>
    );
}

export default UserProfileInfo;
