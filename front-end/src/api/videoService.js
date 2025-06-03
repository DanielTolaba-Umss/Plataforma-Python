import { API_URL } from "./configuracion";
import axios from "axios";

const VIDEO_API_URL = `${API_URL}/resources`;

export const getAllResources = async () => {
  const response = await axios.get(VIDEO_API_URL);
  return response.data;
};

export const getResourceById = async (id) => {
  const response = await axios.get(`${VIDEO_API_URL}/${id}`);
  return response.data;
};

export const createResource = async (resource) => {
  const response = await axios.post(VIDEO_API_URL, resource);
  return response.data;
};

export const updateResource = async (id, resource) => {
  const response = await axios.put(`${VIDEO_API_URL}/${id}`, resource);
  return response.data;
};

export const deleteResource = async (id) => {
  await axios.delete(`${VIDEO_API_URL}/${id}`);
};

export const uploadResourceFile = async (file, title, typeId, contentId) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("title", title);
  formData.append("typeId", typeId);
  formData.append("contentId", contentId);

  const response = await axios.post(`${VIDEO_API_URL}/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
