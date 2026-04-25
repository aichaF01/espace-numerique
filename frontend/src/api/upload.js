import axiosClient from '../config/axiosClient';

// Envoie le fichier vers MinIO via ms-upload
export const uploadFile = (file) => {
  const fd = new FormData();
  fd.append("file", file);
  return axiosClient.post('/api/upload/', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(r => r.data); 
};