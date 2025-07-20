package com.haeildiary.www.journal.dto;

import com.haeildiary.www.journal.entity.Category;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@NoArgsConstructor
public class JournalRequestDto {

    @NotBlank(message = "제목을 입력해주세요.")
    private String title;

    @NotBlank(message = "내용을 입력해주세요.")
    private String content;

    @NotNull(message = "카테고리를 선택해주세요.")
    private Category category;

    @NotNull(message = "별점을 선택해주세요.")
    @DecimalMin(value = "0.5", message = "별점은 0.5점 이상이어야 합니다.")
    @DecimalMax(value = "5.0", message = "별점은 5점을 초과할 수 없습니다.")
    private Double rating;

    @NotNull(message = "날짜를 선택해주세요.")
    private LocalDate journalDate;
}
