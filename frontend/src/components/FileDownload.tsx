import React from 'react';
import { Button, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { downloadFile } from '../api';

interface FileDownloadProps {
    fileId: string;
    disabled: boolean; // 新增 disabled 属性
}

const FileDownload: React.FC<FileDownloadProps> = ({ fileId, disabled }) => {
    const handleDownload = async () => {
        try {
            const response = await downloadFile(fileId);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${fileId}`);
            document.body.appendChild(link);
            link.click();
            message.success('File downloaded successfully');
        } catch (error) {
            message.error('File download failed.');
        }
    };

    return (
        <Button icon={<DownloadOutlined />} onClick={handleDownload} disabled={disabled}>
            Download CSV
        </Button>
    );
};

export default FileDownload;