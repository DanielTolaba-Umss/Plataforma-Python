package com.coders.backers.plataformapython.backend.dto.resources;

public class ResourceDto {
    private Long resourceId;
    private Long contentId;
    private Long typeId;
    private String url;
    private String title;

    public Long getResourceId() { return resourceId; }
    public void setResourceId(Long resourceId) { this.resourceId = resourceId; }

    public Long getContentId() { return contentId; }
    public void setContentId(Long contentId) { this.contentId = contentId; }

    public Long getTypeId() { return typeId; }
    public void setTypeId(Long typeId) { this.typeId = typeId; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public ResourceDto() {}

    public ResourceDto(Long resourceId, Long contentId, Long typeId, String url, String title) {
        this.resourceId = resourceId;
        this.contentId = contentId;
        this.typeId = typeId;
        this.url = url;
        this.title = title;
    }
}
