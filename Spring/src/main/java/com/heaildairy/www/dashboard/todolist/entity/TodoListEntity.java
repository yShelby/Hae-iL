package com.heaildairy.www.dashboard.todolist.entity;

import com.heaildairy.www.auth.entity.UserEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "todo_list")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class TodoListEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "todo_id")
    private Long todoId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @Column(name = "activity_type", nullable = false)
    private String activityType;

    @Column(name = "is_completed", nullable = false)
    private boolean isCompleted;

    @Column(name = "todo_date", nullable = false)
    private LocalDate todoDate;

    @Builder
    public TodoListEntity(UserEntity userId, String activityType, boolean isCompleted, LocalDate todoDate) {
        this.user = userId;
        this.activityType = activityType;
        this.isCompleted = isCompleted;
        this.todoDate = todoDate;
    }

    // 완료 상태를 업데이트하는 편의 메서드
    public void updateCompletion(boolean isCompleted) {
        this.isCompleted = isCompleted;
    }
}
