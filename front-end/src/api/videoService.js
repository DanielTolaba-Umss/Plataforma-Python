import api from "./configuracion";

export const getAllResources = async () => {
  const response = await api.get('/resources');
  console.log("🚀 ~ getAllResources ~ response:", response);
  return response.data;
};

//recurso por leccion

export const getResourceByLesson = async (lessonId) => {
  console.log("🚀 ~ getResourceByLesson ~ lessonId:", lessonId);
  const response = await api.get(`/resources/by-lesson/${lessonId}`);
  console.log("🚀 ~ getResourceByLesson ~ response:", response);
  return response.data;
};

export const getResourceById = async (id) => {
  const response = await api.get(`/resources/${id}`);
  return response.data;
};

export const createResource = async (resource) => {
  console.log("🚀 ~ createResource ~ resource:", resource);
  const response = await api.post('/resources', resource);
  return response.data;
};

export const updateResource = async (id, resource) => {
  const response = await api.put(`/resources/${id}`, resource);
  return response.data;
};

export const deleteResource = async (id) => {
  await api.delete(`/resources/${id}`);
};

export const uploadResourceFile = async (file, title, typeId, contentId) => {
  const formData = new FormData();
  console.log("🚀 ~ uploadResourceFile ~ formData:", formData);
  formData.append("file", file);
  formData.append("title", title);
  formData.append("typeId", typeId);
  formData.append("contentId", contentId);

  const response = await api.post(`/resources/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
