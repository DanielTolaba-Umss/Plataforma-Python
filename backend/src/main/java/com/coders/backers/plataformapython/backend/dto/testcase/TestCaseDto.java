package com.coders.backers.plataformapython.backend.dto.testcase;

import lombok.*;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TestCaseDto {
    private Long id;
    private Long practiceId;
    private String entrada;
    private String salida;
}