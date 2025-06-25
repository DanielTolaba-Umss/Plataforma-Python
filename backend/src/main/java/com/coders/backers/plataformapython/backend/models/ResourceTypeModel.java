package com.coders.backers.plataformapython.backend.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "resource_type")
public class ResourceTypeModel {
    
    @Id
    @Column(name = "type_id")
    private Long typeId;

    @Column(nullable = false)
    private String extension;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private boolean active;

    public Long getTypeId() { return typeId; }
    public void setTypeId(Long typeId) { this.typeId = typeId; }

    public String getExtension() { return extension; }
    public void setExtension(String extension) { this.extension = extension; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

}
