package com.coders.backers.plataformapython.backend.dto;

public class ResourceTypeDto {
    private Long typeId;
    private String extension;
    private String name;
    private boolean active;

    public Long getTypeId() { return typeId; }
    public void setTypeId(Long typeId) { this.typeId = typeId; }

    public String getExtension() { return extension; }
    public void setExtension(String extension) { this.extension = extension; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public ResourceTypeDto() {}

    public ResourceTypeDto(Long typeId, String extension, String name, boolean active) {
        this.typeId = typeId;
        this.extension = extension;
        this.name = name;
        this.active = active;
    }
}
