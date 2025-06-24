package com.heaildairy.www.diary.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity // DB 테이블과 1:1로 연결
@Getter
@Setter
@NoArgsConstructor // JPA는 기본 생성자가 필요함
public class DiaryEntity {
    @Id
    @GeneratedValue // primary key 자동 생성 : 기본값 사용 (entity type을 보고 자동으로 전략 선택)
    private long id;

    private String menu;
    private int count;

    public DiaryEntity(String menu, int count) {
        this.menu = menu;
        this.count = count;
    }
}
