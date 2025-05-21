package com.coders.backers.plataformapython.backend.dto.content;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class ContenidoDto {
    private Long contenidoId;
    private Long leccionId;
    private boolean active;
    private LocalDateTime creationDate;
    private LocalDateTime updateDate;
}
