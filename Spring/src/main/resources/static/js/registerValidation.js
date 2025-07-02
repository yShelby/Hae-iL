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
    const closeButton = document.querySelector('.close-button');
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

    // 5. 프로필 이미지 URL 유효성 검사 (필수 아님)
    function validateProfileImage() {
        // type="url" 속성에 의해 기본적인 URL 형식 검사 자동 수행
        if (profileImageInput.validity.typeMismatch && profileImageInput.value.length > 0) {
            profileImageError.textContent = '유효한 이미지 URL을 입력해주세요.';
            return false;
        } else {
            profileImageError.textContent = '';
            return true;
        }
    }

    // 핸드폰 번호 포맷팅 함수
    function formatPhoneNumber(phone) {
      // 하이픈(-), 공백 등 제거
      const cleaned = phone.replace(/\D/g, '');
      // 01012345678 → +821012345678
      if (cleaned.startsWith('010')) {
        return '+82' + cleaned.substring(1);
      }
      // 이미 +82로 시작하면 그대로 반환
      if (cleaned.startsWith('+82')) {
        return cleaned;
      }
      // 그 외의 경우는 그대로 반환 (추가적인 변환 필요시 확장)
      return cleaned;
    }


    // 폼 제출 시 전체 유효성 검사
    function validateForm() {
        // 모든 유효성 검사 함수를 호출하고 결과를 논리곱(AND)으로 연결
        const isEmailValid = validateEmail();
        const isNicknameValid = validateNickname();
        const isPasswordValid = validatePassword();
        const isPasswordMatch = checkPasswordMatch();
        const isProfileImageValid = validateProfileImage(); // 선택 사항이지만 형식이 맞는지 확인
        // 전화번호 포맷팅
        phoneInput.value = formatPhoneNumber(phoneInput.value);

        // 모든 검사를 통과해야 폼 제출 허용
        if (isEmailValid && isNicknameValid && isPasswordValid && isPasswordMatch && isProfileImageValid) {
            return true;
        } else {
             // 클라이언트 측 유효성 검사 오류 메시지를 팝업으로 표시
            const clientErrors = [];
            if (!isEmailValid) clientErrors.push(emailError.textContent);
            if (!isNicknameValid) clientErrors.push(nicknameError.textContent);
            if (!isPasswordValid) clientErrors.push(passwordError.textContent);
            if (!isPasswordMatch) clientErrors.push(passwordConfirmError.textContent);
            if (!isProfileImageValid && profileImageInput.value.length > 0) clientErrors.push(profileImageError.textContent); // 입력값이 있을 때만 이미지 URL 오류 표시

            // 중복 메시지 제거 및 빈 메시지 필터링
            const uniqueClientErrors = [...new Set(clientErrors.filter(msg => msg && msg.trim() !== ''))];
            if (uniqueClientErrors.length > 0) {
                showModal(uniqueClientErrors); // 오류 팝업 표시
            }
            return false;
        }
    }

    // DOMContentLoaded 이벤트에서 초기 유효성 검사 메시지 숨기기 및 서버 오류 감지
    document.addEventListener('DOMContentLoaded', () => {
          // 초기 유효성 검사 메시지 숨기기 (기존 코드)
            emailError.textContent = '';
            nicknameError.textContent = '';
            passwordError.textContent = '';
            passwordConfirmError.textContent = '';
            profileImageError.textContent = '';

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
