package com.coders.backers.plataformapython.backend.dto.teacher;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateTeacherDto {
    private String name;
    private String lastName;
    private String email;
    private String phone;
    private String password;
    private String specialty;
    
    private List<Long> moduleIds;
}
