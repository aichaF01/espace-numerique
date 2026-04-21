import axiosClient from '../config/axiosClient';

// Étudiant — liste tous les cours disponibles
export const listCours = () =>
  axiosClient.get('/api/download/cours').then(r => r.data);

// Prof — uploader un nouveau cours (FormData)
export const uploadCours = (formData) =>
  axiosClient.post('/api/upload/cours', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(r => r.data);