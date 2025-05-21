package com.coders.backers.plataformapython.backend.models.userModel;

import lombok.Getter;
import lombok.Setter;

import jakarta.persistence.*;
import com.coders.backers.plataformapython.backend.enums.Role;

@Getter
@Setter
@Entity
@Table(name = "admins")
@PrimaryKeyJoinColumn(name = "user_id")
public class AdminEntity extends UserEntity {

    @Column(name = "special_permit")
    private String specialPermits;
    
    public AdminEntity() {
        setRole(Role.ADMIN.name());
    }

    
    public AdminEntity(String specialPermits) {
        setRole(Role.ADMIN.name());
        this.specialPermits = specialPermits;
    }
}
