需求文档
项目概述
本项目旨在开发一个简单的前后端服务，前端使用 React + TypeScript 6 开发，后端使用 Golang 开发。前端页面提供上传 .csv 文件和下载经纬度转位置的功能，后端提供接口处理 .csv 文件上传、转换 .csv 文件中的经纬度字段值为地理位置值，并调用第三方 API 进行经纬度逆地址转换。

功能需求
前端功能
上传 .csv 文件

用户可以通过页面上的文件选择器上传 .csv 文件。

文件上传后，前端将文件发送到后端进行处理。

下载转换后的文件

用户可以在页面上点击下载按钮，下载经过经纬度转换后的 .csv 文件。

下载的文件应包含原始数据及转换后的地理位置信息。

页面布局

页面应包含一个文件上传区域和一个下载按钮。

上传区域应显示文件选择器和上传按钮。

下载按钮应在文件上传并处理完成后可用。

后端功能
文件上传接口

提供一个 RESTful API 接口，用于接收前端上传的 .csv 文件。

接口应支持 multipart/form-data 格式的文件上传。

经纬度转换接口

读取上传的 .csv 文件，解析其中的经纬度字段。

调用第三方 API（https://geo.util.linketech.cn/api/tianditu/reverse）进行经纬度逆地址转换。

将转换后的地理位置信息写入新的 .csv 文件。

文件下载接口

提供一个 RESTful API 接口，用于前端下载转换后的 .csv 文件。

接口应返回转换后的 .csv 文件。

技术栈
前端
框架: React

语言: TypeScript 6

UI 库: Ant Design 或 Material-UI（可选）

状态管理: Redux 或 Context API（可选）

HTTP 请求库: Axios

后端
语言: Golang

Web 框架: Gin 或 Echo

文件处理库: encoding/csv

HTTP 请求库: net/http 或 go-resty

第三方 API 调用: 使用 https://geo.util.linketech.cn/api/tianditu/reverse 进行经纬度逆地址转换

接口设计
前端与后端接口
文件上传接口

URL: /api/upload

Method: POST

Request Body: multipart/form-data

file: .csv 文件

Response:

json
复制
{
  "status": "success",
  "message": "File uploaded successfully",
  "fileId": "unique-file-id"
}
文件下载接口

URL: /api/download/:fileId

Method: GET

Response: .csv 文件

后端与第三方 API 接口
经纬度逆地址转换接口

URL: https://geo.util.linketech.cn/api/tianditu/reverse

Method: GET

Query Parameters:

lat: 纬度

lon: 经度

Response:

json
复制
{
  "address": "地理位置信息"
}
数据库设计
本项目不涉及数据库存储，所有文件处理均在内存中进行。

项目结构
前端项目结构
复制
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── FileUpload.tsx
│   │   └── FileDownload.tsx
│   ├── App.tsx
│   ├── index.tsx
│   └── api.ts
├── package.json
└── tsconfig.json
后端项目结构
复制
backend/
├── main.go
├── handlers/
│   ├── upload.go
│   └── download.go
├── services/
│   └── geoconversion.go
├── go.mod
└── go.sum
开发环境
前端
Node.js: v16.x

npm: v8.x

React: v18.x

TypeScript: v6.x

后端
Golang: v1.20.x

Gin: v1.9.x

部署
前端
使用 npm run build 生成生产环境代码。

部署到 Nginx 或任何静态文件服务器。

后端
编译 Golang 代码为可执行文件。

使用 Docker 或直接部署到服务器。

测试
前端
使用 Jest 和 React Testing Library 进行单元测试。

使用 Cypress 进行端到端测试。

后端
使用 Go 的内置测试框架进行单元测试。

使用 Postman 或 curl 进行 API 测试。

项目时间表
任务	预计时间
前端开发	5 天
后端开发	5 天
测试与调试	2 天
部署	1 天
风险与挑战
第三方 API 的稳定性

第三方 API 可能会出现不可用或响应缓慢的情况，需考虑重试机制和超时处理。

大文件处理

如果上传的 .csv 文件过大，可能会导致内存占用过高，需考虑流式处理或分块处理。

跨域问题

前端与后端可能部署在不同的域名下，需配置 CORS 以允许跨域请求。

参考资料
React 官方文档

TypeScript 官方文档

Golang 官方文档

Gin 框架文档

第三方 API 文档

备注: 本文档为初步需求文档，具体实现细节可能会根据开发过程中的实际情况进行调整。