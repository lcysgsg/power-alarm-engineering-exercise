package com.example.poweralarm.alarm;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AckRequest(
        @NotBlank(message = "确认人不能为空")
        @Size(max = 40, message = "确认人不能超过40个字符")
        String operator
) {
}
