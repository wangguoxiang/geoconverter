import React from 'react';
import { Button, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { downloadFile } from '../api';

interface FileDownloadProps {
    fileId: string;
}

const FileDownload: React.FC<FileDownloadProps> = ({ fileId }) => {
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
        <Button icon={<DownloadOutlined />} onClick={handleDownload} disabled={!fileId}>
            Download CSV
        </Button>
    );
};

export default FileDownload;