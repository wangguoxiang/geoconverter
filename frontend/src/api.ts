import axios, { AxiosProgressEvent } from 'axios';

const apiClient = axios.create({
    // 使用相对路径，避免跨域问题
    baseURL:  '/api',
});

// 添加请求拦截器
apiClient.interceptors.request.use(
    (config) => {
        // 在发送请求之前做些什么，例如设置token
        config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
        // 确保 baseURL 和 url 正确拼接
        config.url = `${config.url}`;
        console.log(config);
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

export const uploadFile = async (file: File, onUploadProgress?: (progressEvent: AxiosProgressEvent) => void) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: onUploadProgress,
    });
};

export const downloadFile = async (fileId: string) => {
    return apiClient.get('/download', {
        params: { fileId }, // 将 fileId 作为参数传递
        responseType: 'blob',
    });
};

export const convertFile = async (fileId: string) => {
    return apiClient.get('/convert', { // 修改: 将 post 改为 get
        params: { fileId }, // 将 fileId 作为参数传递
    });
};