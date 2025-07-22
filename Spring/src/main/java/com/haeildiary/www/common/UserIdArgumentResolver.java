package com.haeildiary.www.common;

import com.haeildiary.www.auth.user.CustomUser;
import org.springframework.core.MethodParameter;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

/**
 * @GetUserId 어노테이션이 붙은 파라미터를 처리하는 Argument Resolver 클래스입니다.
 * WebMvcConfigurer에 등록되어야 동작합니다.
 */
public class UserIdArgumentResolver implements HandlerMethodArgumentResolver {

    /**
     * 이 Argument Resolver가 특정 파라미터를 지원하는지 여부를 반환
     * 파라미터에 @GetUserId 어노테이션이 붙어있고, 타입이 Integer인 경우 true를 반환
     */
    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return parameter.hasParameterAnnotation(GetUserId.class) &&
                parameter.getParameterType().equals(Integer.class);
    }

    /**
     * 실제 파라미터의 값을 결정하여 반환하는 핵심 메소드
     * SecurityContextHolder에서 현재 인증된 사용자 정보를 가져와 User ID를 추출
     * @return 추출된 사용자 ID (Integer) 또는 인증 정보가 없을 경우 null
     */
    @Override
    public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer,
                                  NativeWebRequest webRequest, WebDataBinderFactory binderFactory) throws Exception {
        // Spring Security의 컨텍스트에서 인증 정보를 가져옵니다.
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // 인증 정보가 없거나, 인증되지 않은 사용자(anonymousUser)일 경우 null을 반환
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            return null;
        }

        Object principal = authentication.getPrincipal();

        // Principal 객체가 우리가 정의한 User 클래스의 인스턴스인지 확인
        if (principal instanceof CustomUser) {
            // 맞다면 User 객체로 캐스팅하여 userId를 반환
            return ((CustomUser) principal).getUserId();
        }

        // 예상치 못한 타입의 Principal일 경우 null을 반환
        return null;
    }
}
