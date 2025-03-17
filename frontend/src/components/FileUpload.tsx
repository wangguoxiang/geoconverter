import React, { useState } from 'react';
import { Upload, Button, message, Progress } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { uploadFile } from '../api';

interface FileUploadProps {
    setFileId: (fileId: string) => void;
    onConversionReady: () => void; // 新增回调函数
}

const FileUpload: React.FC<FileUploadProps> = ({ setFileId, onConversionReady }) => {
    const [fileList, setFileList] = useState<any[]>([]);
    const [uploadProgress, setUploadProgress] = useState<number>(0);

    const handleUpload = async (options: any) => {
        const { file, onSuccess, onError, onProgress } = options;
        try {
            const response = await uploadFile(file, (progressEvent: any) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setUploadProgress(percentCompleted);
                onProgress({ percent: percentCompleted });
            });
            console.log(response.data.fileId);
            setFileId(response.data.fileId);
            onSuccess(response.data, file);
            message.success(`${file.name} file uploaded successfully`);
            onConversionReady(); // 上传完成后调用回调函数
        } catch (error) {
            onError(error);
            message.error(`${file.name} file upload failed.`);
        }
    };

    const beforeUpload = (file: File) => {
        const isCSV = file.type === 'text/csv' || file.name.endsWith('.csv');
        if (!isCSV) {
            message.error('You can only upload CSV file!');
        }
        return isCSV || Upload.LIST_IGNORE;
    };

    return (
        <div>
            <Upload
                fileList={fileList}
                customRequest={handleUpload}
                onChange={(info) => {
                    setFileList(info.fileList);
                    if (info.file.status === 'error') {
                        message.error(`${info.file.name} file upload failed.`);
                    }
                }}
                beforeUpload={beforeUpload} // 添加文件类型检查
            >
                <Button icon={<UploadOutlined />}>Upload CSV</Button>
            </Upload>
            {uploadProgress > 0 && <Progress percent={uploadProgress} status="active" />}
        </div>
    );
};

export default FileUpload;