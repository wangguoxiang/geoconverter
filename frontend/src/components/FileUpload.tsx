import React, { useState } from 'react';
import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { uploadFile } from '../api';

interface FileUploadProps {
    setFileId: (fileId: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ setFileId }) => {
    const [fileList, setFileList] = useState<any[]>([]);

    const handleUpload = async (info: any) => {
        if (info.file.status === 'done') {
            try {
                const response = await uploadFile(info.file.originFileObj)
                // .then(
                //     data =>   console.log(data)
                // ).catch(
                //     error => console.error(error)
                // );
                setFileId(response.data.fileId);
                message.success(`${info.file.name} file uploaded successfully`);
           
            } catch (error) {
                message.error(`${info.file.name} file upload failed.`);
            }
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    };

    return (
        <Upload
            fileList={fileList}
            onChange={(info) => setFileList(info.fileList)}
            customRequest={handleUpload}
            beforeUpload={() => false}
        >
            <Button icon={<UploadOutlined />}>Upload CSV</Button>
        </Upload>
    );
};

export default FileUpload;