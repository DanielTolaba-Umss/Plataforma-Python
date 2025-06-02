package com.coders.backers.plataformapython.backend.mapper;

import com.coders.backers.plataformapython.backend.dto.tryPractice.*;
import com.coders.backers.plataformapython.backend.dto.tryPractice.python.CodeExecutionRequest;
import com.coders.backers.plataformapython.backend.models.TryPracticeEntity;

public class TryPracticeMapper {
    public static TryPracticeEntity mapToEntity(CodeExecutionRequest code) {
        return new TryPracticeEntity(
            code.getCode(),
            code.getStudentId(),
            code.getPracticeId()
        );
    }

    public static TryPracticeEntity mapToEntity(TryPracticeDto dto) {
        return new TryPracticeEntity(
            dto.getId(),
            dto.getStudentId(),
            dto.getPracticeId(),
            dto.getCode(),
            dto.getTestResults(),
            dto.isApproved(),
            dto.getFeedback(),
            dto.getCreateAt()
        );
    }

    public static TryPracticeDto mapToDto(TryPracticeEntity entity) {
        return new TryPracticeDto(
            entity.getId(),
            entity.getStudentId(),
            entity.getPracticeId(),
            entity.getCode(),
            entity.getTestResults(),
            entity.isApproved(),
            entity.getFeedback(),
            entity.getCreateAt()
        );
    }
}
