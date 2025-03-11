import React, { useState } from 'react';
import { Layout } from 'antd';
import FileUpload from './components/FileUpload';
import FileDownload from './components/FileDownload';
import './styles.css'; // 引入样式文件

const App: React.FC = () => {
    const [fileId, setFileId] = useState<string>('');

    return (
        <Layout>
            <Layout.Header>
                <h1>Tianditu2 Frontend</h1>
            </Layout.Header>
            <Layout.Content style={{ padding: '24px' }}>
                <FileUpload setFileId={setFileId} />
                <FileDownload fileId={fileId} />
            </Layout.Content>
        </Layout>
    );
};

export default App;