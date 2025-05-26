package com.coders.backers.plataformapython.backend.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "resource")
public class ResourceModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "resource_id")
    private Long resourceId;

    @ManyToOne(optional = false)
    @JoinColumn(name = "content_id")
    private ContenidoModel content;

    @ManyToOne(optional = false)
    @JoinColumn(name = "type_id")
    private ResourceTypeModel type;

    @Column(nullable = false)
    private String url;

    @Column(nullable = false)
    private String title;

    public Long getResourceId() { return resourceId; }
    public void setResourceId(Long resourceId) { this.resourceId = resourceId; }

    public ContenidoModel getContent() { return content; }
    public void setContent(ContenidoModel content) { this.content = content; }

    public ResourceTypeModel getType() { return type; }
    public void setType(ResourceTypeModel type) { this.type = type; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }


}
