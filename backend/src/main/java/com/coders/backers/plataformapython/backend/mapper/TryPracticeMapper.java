package com.coders.backers.plataformapython.backend.mapper;

import org.springframework.stereotype.Component;

import com.coders.backers.plataformapython.backend.dto.tryPractice.*;
import com.coders.backers.plataformapython.backend.dto.tryPractice.python.CodeExecutionRequest;
import com.coders.backers.plataformapython.backend.models.PracticeEntity;
import com.coders.backers.plataformapython.backend.models.TryPracticeEntity;
import com.coders.backers.plataformapython.backend.models.userModel.StudentEntity;
@Component
public class TryPracticeMapper {


   
    public static TryPracticeEntity mapToEntity(CodeExecutionRequest code, StudentEntity student, PracticeEntity practice) {
        return new TryPracticeEntity(
            code.getCode(),
            student,
            practice
        );
    }



    public static TryPracticeDto mapToDto(TryPracticeEntity entity) {
        if (entity == null) {
            return null;
        }

        TryPracticeDto dto = new TryPracticeDto();
        dto.setId(entity.getId());
        dto.setStudent(StudentMapper.mapToDto(entity.getStudent()));
        dto.setPractice(PracticeMapper.toDto(entity.getPractice()));
        dto.setCode(entity.getCode());
        dto.setTestResults(entity.getTestResults());
        dto.setApproved(entity.getApproved());
        dto.setFeedback(entity.getFeedback());
        dto.setCreateAt(entity.getCreateAt());
        return dto;
    }

    public static TryPracticeEntity mapToEntity(TryPracticeDto dto) {
        if (dto == null) {
            return null;
        }

        TryPracticeEntity entity = new TryPracticeEntity();
        entity.setId(dto.getId());
        entity.setStudent(StudentMapper.mapToEntity(dto.getStudent()));
        entity.setPractice(PracticeMapper.mapToEntity(dto.getPractice()));
        entity.setCode(dto.getCode());
        entity.setTestResults(dto.getTestResults());
        entity.setApproved(dto.getApproved());
        entity.setFeedback(dto.getFeedback());
        entity.setCreateAt(dto.getCreateAt());
        return entity;
    }
}
