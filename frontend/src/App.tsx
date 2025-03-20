import React, { useState } from 'react';
import { Layout, Button, message, Progress } from 'antd';
import FileUpload from './components/FileUpload';
import FileDownload from './components/FileDownload';
import { convertFile } from './api'; // 导入 convertFile 方法
import './styles.css'; // 引入样式文件

const App: React.FC = () => {
    const [fileId, setFileId] = useState<string>('');
    const [conversionReady, setConversionReady] = useState<boolean>(false); // 新增状态管理
    const [isConverting, setIsConverting] = useState<boolean>(false); // 新增状态管理
    const [isDownloadEnabled, setIsDownloadEnabled] = useState<boolean>(false); // 新增状态管理

    const handleConversionReady = () => {
        setConversionReady(true);
    };

    const handleConvert = async () => {
        if (!fileId) {
            message.error('File ID is missing. Please upload a file first.');
            return;
        }
        setIsConverting(true); // 设置转换状态为 true
        try {
            console.log(fileId);
            const conversionResult = await convertFile(fileId); // 增加返回值处理
            console.log('Conversion Result:', conversionResult.data); // 打印返回值
            setFileId(conversionResult.data.fileId);
            message.success('Conversion completed successfully');
            setConversionReady(false); // 转换完成后重置状态
            setIsDownloadEnabled(true); // 启用下载按钮
        } catch (error) {
            message.error('Conversion failed.');
        } finally {
            setIsConverting(false); // 设置转换状态为 false
        }
    };

    return (
        <Layout>
            <Layout.Header>
                <h1>Tianditu2 Frontend</h1>
            </Layout.Header>
            <Layout.Content style={{ padding: '24px' }}>
                <FileUpload setFileId={setFileId} onConversionReady={handleConversionReady} />
                {conversionReady && fileId && ( // 添加 fileId 检查
                    <>
                        <Button
                            type="primary"
                            onClick={handleConvert}
                            style={{ marginTop: '16px' }}
                            disabled={isConverting} // 根据转换状态禁用按钮
                        >
                            {isConverting ? 'Converting...' : 'Convert to Location'} 
                        </Button>
                    </>
                )}
                <div style={{ marginTop: '16px' }}> 
                    <FileDownload fileId={fileId} disabled={!isDownloadEnabled || !fileId} />
                </div>
            </Layout.Content>
        </Layout>
    );
};

export default App;