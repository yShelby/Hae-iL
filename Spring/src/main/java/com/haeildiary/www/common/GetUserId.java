package com.haeildiary.www.common;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 컨트롤러 메소드의 파라미터에 사용하면,
 * 현재 로그인된 사용자의 ID(Integer)를 자동으로 주입해주는 커스텀 어노테이션.
 * @Target(ElementType.PARAMETER): 이 어노테이션은 파라미터에만 사용할 수 있음을 의미
 * @Retention(RetentionPolicy.RUNTIME): 이 어노테이션의 정보가 런타임까지 유지되어 리플렉션을 통해 읽을 수 있음을 의미
 */
@Target(ElementType.PARAMETER)
@Retention(RetentionPolicy.RUNTIME)
// '@interface' 앞의 '@' 기호는 이 파일이 '어노테이션 정의'임을 의미
// 즉, 이 클래스는 일반 클래스가 아니라 '커스텀 어노테이션'을 만들기 위한 특별한 선언이라는 의미
public @interface GetUserId {
}
