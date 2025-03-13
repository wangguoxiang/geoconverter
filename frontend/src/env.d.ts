 // 定义环境变量的类型
interface ImportMetaEnv {
    readonly MODE: 'development' | 'production';
    // 补充其他环境变量...
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}