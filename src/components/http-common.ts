import axios, { AxiosInstance } from 'axios';

const apiClient: AxiosInstance = axios.create({
  baseURL: '192.168.104.235:3000/api/v1/file/upload',
  headers: {
    'Content-Type': 'application/json'
  }
});

export default apiClient;
