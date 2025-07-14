package com.heaildairy.www.auth.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.List;

public class EmotionValidator implements ConstraintValidator<ValidEmotionSelection, List<String>> {

    @Override
    public boolean isValid(List<String> value, ConstraintValidatorContext context) {
        return value != null && value.size() >= 1 && value.size() <= 2;
    }
}
