package com.heaildairy.www.dashboard.todolist.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class TodoListDto {
    private String activityType;
    private boolean completed;
}
