import axiosClient from '../config/axiosClient';

export const listCours = () =>
  axiosClient.get('/api/download/cours').then(r => r.data);