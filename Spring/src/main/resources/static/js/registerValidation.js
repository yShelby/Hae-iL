  // 유효성 검사 메시지를 표시할 span 요소들
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('emailError');
    const nicknameInput = document.getElementById('nickname');
    const nicknameError = document.getElementById('nicknameError');
    const passwordInput = document.getElementById('password');
    const passwordError = document.getElementById('passwordError');
    const passwordConfirmInput = document.getElementById('passwordConfirm');
    const passwordConfirmError = document.getElementById('passwordConfirmError');
    const profileImageInput = document.getElementById('profileImage');
    const profileImageError = document.getElementById('profileImageError');
    const phoneInput = document.getElementById('phone');
    const phoneError = document.getElementById('phoneError');

  // 팝업 관련 요소들
    const errorModal = document.getElementById('errorModal');
    const closeButton = document.getElementById('closeErrorBtn');
    const errorList = document.getElementById('errorList');

    // 1. 이메일 유효성 검사
    function validateEmail() {
        if (emailInput.validity.valueMissing) { // 필수 입력 여부
            emailError.textContent = '이메일을 입력해주세요.';
        } else if (emailInput.validity.typeMismatch) { // 이메일 형식 검사 (type="email"에 의해 자동 검사)
            emailError.textContent = '유효한 이메일 주소를 입력해주세요.';
        } else {
            emailError.textContent = ''; // 오류 없으면 메시지 제거
        }
        return emailInput.validity.valid; // 유효성 결과 반환
    }

    // 2. 닉네임 유효성 검사
    function validateNickname() {
        if (nicknameInput.validity.valueMissing) { // 필수 입력 여부
            nicknameError.textContent = '닉네임을 입력해주세요.';
        } else if (nicknameInput.validity.tooShort) { // 최소 길이 검사
            nicknameError.textContent = `닉네임은 최소 ${nicknameInput.minLength}자 이상이어야 합니다.`;
        } else if (nicknameInput.validity.tooLong) { // 최대 길이 검사
            nicknameError.textContent = `닉네임은 최대 ${nicknameInput.maxLength}자 이하여야 합니다.`;
        } else {
            nicknameError.textContent = '';
        }
        return nicknameInput.validity.valid;
    }

    // 3. 비밀번호 유효성 검사
    function validatePassword() {
        if (passwordInput.validity.valueMissing) { // 필수 입력 여부
            passwordError.textContent = '비밀번호를 입력해주세요.';
        } else if (passwordInput.validity.tooShort || passwordInput.validity.tooLong) { // 길이 검사
            passwordError.textContent = `비밀번호는 ${passwordInput.minLength}~${passwordInput.maxLength}자여야 합니다.`;
        } else if (passwordInput.validity.patternMismatch) { // 정규식 패턴 검사
            passwordError.textContent = '비밀번호는 영문 대/소문자, 숫자, 특수문자를 포함해야 합니다.';
        } else {
            passwordError.textContent = '';
        }
        return passwordInput.validity.valid;
    }

    // 4. 비밀번호 확인 일치 여부 검사
    function checkPasswordMatch() {
        const password = passwordInput.value;
        const passwordConfirm = passwordConfirmInput.value;

        if (passwordConfirm.length === 0) { // 비밀번호 확인 필드가 비어있을 때
            passwordConfirmError.textContent = '비밀번호를 다시 입력해주세요.';
            return false;
        } else if (password !== passwordConfirm) { // 두 비밀번호가 다를 때
            passwordConfirmError.textContent = '비밀번호가 일치하지 않습니다.';
            return false;
        } else {
            passwordConfirmError.textContent = '';
            return true;
        }
    }

    // 핸드폰 번호 포맷팅 함수
    function formatPhoneNumber(phone) {
      // 1. 숫자만 추출
      const cleaned = phone.replace(/\D/g, '');

      // 2. 01012345678 → +821012345678
      if (cleaned.startsWith('010') && (cleaned.length === 10 || cleaned.length === 11)) {
          return '+82' + cleaned.substring(1);
      }

      // 3. 821012345678 → +821012345678
      if (cleaned.startsWith('82') && (cleaned.length === 10 || cleaned.length === 11)) {
          return '+' + cleaned;
      }

      // 4. 그 외: 숫자에만 + 붙여서 반환
      return '+' + cleaned;
    }


    // 폼 제출 시 전체 유효성 검사
    function validateForm(event) { // event 파라미터 추가
        console.log("validateForm called.");
        // 모든 유효성 검사 함수를 호출하고 결과를 논리곱(AND)으로 연결
        const isEmailValid = validateEmail();
        const isNicknameValid = validateNickname();
        const isPasswordValid = validatePassword();
        const isPasswordMatch = checkPasswordMatch();
        const isPhoneValid = validatePhone(); // [추가] 전화번호 유효성 검사
        // 추가 장르와 감정 유효성 검사를 위한 함수 호출
        const isGenreCheckValid = validateCheckboxes("initialGenre", "좋아하는 영화 장르", 1, 3);
        const isEmotionCheckValid = validateCheckboxes("initialEmotion", "최근 자주 느낀 감정", 1, 2);

        console.log("Validation results:", { isEmailValid, isNicknameValid, isPasswordValid, isPasswordMatch, isPhoneValid });

        // 전화번호 포맷팅 (유효성 검사 후)
        if (isPhoneValid) { // 유효할 때만 포맷팅
            phoneInput.value = formatPhoneNumber(phoneInput.value);
        }

        // 모든 검사를 통과해야 폼 제출 허용
        if (isEmailValid && isNicknameValid && isPasswordValid && isPasswordMatch && isPhoneValid
            && isGenreCheckValid.valid && isEmotionCheckValid.valid
        ) {
            return true;
        } else {
             console.log("Some validations failed. Preventing default and returning false.");
             event.preventDefault(); // [추가] 유효성 검사 실패 시 폼 제출 방지
             // 클라이언트 측 유효성 검사 오류 메시지를 팝업으로 표시
            const clientErrors = [];
            if (!isEmailValid) clientErrors.push(emailError.textContent);
            if (!isNicknameValid) clientErrors.push(nicknameError.textContent);
            if (!isPasswordValid) clientErrors.push(passwordError.textContent);
            if (!isPasswordMatch) clientErrors.push(passwordConfirmError.textContent);
            if (!isPhoneValid) clientErrors.push(phoneError.textContent); // [추가] 전화번호 오류 메시지
            if (!isGenreCheckValid.valid) clientErrors.push(isGenreCheckValid.message)
            if (!isEmotionCheckValid.valid) clientErrors.push(isEmotionCheckValid.message)

            // 중복 메시지 제거 및 빈 메시지 필터링
            const uniqueClientErrors = [...new Set(clientErrors.filter(msg => msg && msg.trim() !== ''))];
            if (uniqueClientErrors.length > 0) {
                showModal(uniqueClientErrors); // 오류 팝업 표시
            }
            return false;
        }
    }

    // [신규] 전화번호 유효성 검사 함수
    function validatePhone() {
        const phone = phoneInput.value.trim();
        const cleaned = phone.replace(/\D/g, ''); // 숫자만 남김

        if (phone.length === 0) {
            phoneError.textContent = '전화번호를 입력해주세요.';
            return false;
        }
        // 숫자 외의 문자가 있거나, '+'가 맨 앞에 없는데 '+'가 있는 경우
        // 즉, 순수하게 숫자만 있거나, 맨 앞에 '+'가 있고 나머지는 숫자인 경우만 허용
        else if (!/^[+]?[0-9]+$/.test(phone)) { // '+'는 선택적으로 맨 앞에만, 나머지는 숫자만
            phoneError.textContent = '전화번호는 숫자만 입력 가능합니다.';
            return false;
        }
        // 포맷팅 후의 길이를 고려하여 10~11자리 숫자인지 확인
        else if (cleaned.length < 10 || cleaned.length >= 12) {
            phoneError.textContent = '유효한 전화번호 형식이 아닙니다. (10~11자리 숫자)';
            return false;
        } else {
            phoneError.textContent = '';
            return true;
        }
    }

            // [추가] 장르 및 감정 선택 유효성 검사
    function validateCheckboxes(name, messageName, min, max){
        const checkboxes = document.querySelectorAll(`input[name="${name}"]:checked`)
        const checkedCount = checkboxes.length;

        if(checkedCount < min){
            return {valid : false, message : `${messageName}은(는) 최소 ${min}개 이상 선택해 주세요.`}
        }
        if(checkedCount > max){
            return {valid : false, message : `${messageName}은(는) 최대 ${max}개 까지 선택해 주세요.`}
        }
        return {valid : true, message : ""}
    }


    // DOMContentLoaded 이벤트에서 초기 유효성 검사 메시지 숨기기 및 서버 오류 감지
    document.addEventListener('DOMContentLoaded', () => {
          // 초기 유효성 검사 메시지 숨기기 (기존 코드)
            emailError.textContent = '';
            nicknameError.textContent = '';
            passwordError.textContent = '';
            passwordConfirmError.textContent = '';
//            profileImageError.textContent = '';

        // 서버로부터 전달받은 오류 메시지가 있다면 팝업 표시
        if (serverErrorMessages && serverErrorMessages.length > 0) {
            const messagesToShow = serverErrorMessages.map(error => error.defaultMessage || error);
            showModal(messagesToShow); // 팝업 내용 채우고 표시
        }
        // 팝업 닫기 버튼과 외부 클릭 이벤트 리스너는 errorModal이 존재할 때만 추가
        if (errorModal) {
            if (closeButton) {
                closeButton.addEventListener('click', closeModal);
            }
            window.addEventListener('click', (event) => {
                if (event.target === errorModal) {
                    closeModal();
                }
            });
        }
    });


    // 팝업을 표시하는 함수
    function showModal(messages) {
        // errorModal 자체가 없을 수도 있으므로 null 체크
        if (!errorModal) return;

        errorList.innerHTML = ''; // 이전 오류 메시지 초기화
        messages.forEach(msg => {
            const li = document.createElement('li');
            li.textContent = msg;
            errorList.appendChild(li);
        });
        // 모달 자체가 th:if로 표시되므로, 여기서는 내용만 채우면 됨.
        errorModal.style.display = 'flex';
    }

    // 오류 팝업을 닫는 함수
    function closeModal() {
        errorModal.style.display = 'none';
        errorList.innerHTML = '';
    }

//    // 프로필 이미지 관련 요소들
//    const profileImageFileInput = document.getElementById('profileImageFile');
//    const profileImagePreview = document.getElementById('profileImagePreview');
//    const profileImageUrlInput = document.getElementById('profileImageUrl'); // 숨겨진 필드
//
//    // 프로필 이미지 변경 핸들러
//    async function handleProfileImageChange(event) {
//        const file = event.target.files[0];
//        if (!file) {
//            profileImagePreview.style.display = 'none';
//            profileImagePreview.src = '#';
//            profileImageUrlInput.value = ''; // 파일 선택 취소 시 URL 초기화
//            return;
//        }
//
//        // 1. 이미지 미리보기 표시
//        const reader = new FileReader();
//        reader.onload = (e) => {
//            profileImagePreview.src = e.target.result;
//            profileImagePreview.style.display = 'block';
//        };
//        reader.readAsDataURL(file);
//
//        // 2. 임시 ID (UUID) 생성
//        const tempIdentifier = crypto.randomUUID();
//        const filename = file.name;
//        const contentType = file.type;
//
//        profileImageError.textContent = '이미지 업로드 중...'; // 로딩 메시지
//
//        try {
//            // 3. 백엔드에 Presigned URL 요청
//            const encodedFilename = encodeURIComponent(filename);
//            const encodedContentType = encodeURIComponent(contentType);
//
//            const requestUrl = `/api/s3/profile-presigned-url?identifier=${tempIdentifier}&filename=${encodedFilename}&contentType=${encodedContentType}`;
//            console.log('Presigned URL 요청 URL:', requestUrl);
//
//            const presignedUrlResponse = await fetch(requestUrl);
//            if (!presignedUrlResponse.ok) {
//                throw new Error('Presigned URL 요청 실패');
//            }
//            const presignedUrl = await presignedUrlResponse.text();
//
//            // 4. S3에 파일 직접 업로드
//            console.log('S3 업로드 Presigned URL:', presignedUrl);
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
//            // 5. S3에 저장된 이미지의 임시 객체 키를 숨겨진 필드에 저장
//            // S3Service에서 objectKey를 'profile_images/{identifier}/profile.ext'로 생성했으므로,
//            // 이 경로를 그대로 사용하면 됨.
//            const s3ObjectKey = `profile_images/${tempIdentifier}/profile.${filename.split('.').pop()}`;
//            profileImageUrlInput.value = s3ObjectKey;
//
//            profileImageError.textContent = '이미지 업로드 완료!'; // 성공 메시지
//            profileImageError.style.color = 'green';
//
//        } catch (error) {
//            console.error('프로필 이미지 업로드 오류:', error);
//            profileImageError.textContent = '이미지 업로드 실패: ' + error.message;
//            profileImageError.style.color = 'red';
//            profileImagePreview.style.display = 'none';
//            profileImagePreview.src = '#';
//            profileImageUrlInput.value = ''; // 실패 시 URL 초기화
//        }
//    }
