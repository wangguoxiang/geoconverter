import axios from 'axios';

const apiClient = axios.create({
     // 确认后端的 IP 和端口为 192.168.3.100:8080
    baseURL: 'http://192.168.3.100:8080/api',
    timeout: 10000,
});

// 添加请求拦截器
apiClient.interceptors.request.use(
    (config) => {
         // 在发送请求之前做些什么，例如设置token
        config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
        config.url = `${config.url}`;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 添加响应拦截器
apiClient.interceptors.response.use(
    (response) => {
        // 确保响应数据以 JSON 格式处理
        if (typeof response.data === 'string') {
            try {
                response.data = JSON.parse(response.data);
            } catch (e) {
                // 如果解析失败，保持原始数据
            }
        }
        return response;
    },
    (error) => {
         // 对响应错误做点什么
        if (error.response && error.response.status === 401) {
            // 例如，处理401未授权错误
            console.error('Unauthorized access');
        }
        return Promise.reject(error);
    }
);



export const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const downloadFile = async (fileId: string) => {
    return apiClient.get(`/download/${fileId}`, {
        responseType: 'blob',
    });
};