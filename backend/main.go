package main

import (
    "github.com/gin-gonic/gin"
    "github.com/wangguoxiang/geocoverner/backend/handlers"
)

func main() {
    r := gin.Default()

    // 设置文件上传大小限制
    r.MaxMultipartMemory = 8 << 20 // 8 MiB

    // 文件上传路由
    r.POST("/api/upload", handlers.UploadFile)

    // 文件下载路由
    r.GET("/api/download/:fileId", handlers.DownloadFile)

    // 启动服务器
    r.Run(":8080")
}