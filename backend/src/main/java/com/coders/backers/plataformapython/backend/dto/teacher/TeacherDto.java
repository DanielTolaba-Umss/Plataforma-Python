package com.coders.backers.plataformapython.backend.dto.teacher;

import java.sql.Date;



import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;




@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class TeacherDto {
    private Long id;
    private String name;
    private String lastName;
    private String email;
    private String phone;
    private String role;
    private String specialty;
    private Date createdAt;
    private Date updatedAt;
    private boolean active;
    
    
    public TeacherDto(Long id, String name, String lastName, String email, String phone, 
                      String specialty, String role, boolean active) {
        this.id = id;
        this.name = name;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.specialty = specialty;
        this.role = role;
        this.active = active;
    }

}
