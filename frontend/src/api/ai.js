// api/ai.js
import axiosClient from '../config/axiosClient';

export const askAI = (prompt) => {
  return axiosClient.post('/api/ai/chat', { prompt })
    .then(res => res.data);
};