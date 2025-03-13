package main

import (
	"github.com/gin-gonic/gin"
	"github.com/wangguoxiang/geoconverter/backend/handlers"
)

func main() {
	r := gin.Default()
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Connection", "keep-alive")
		c.Next()
	})
	gin.SetMode(gin.DebugMode)

	// 设置文件上传大小限制
	r.MaxMultipartMemory = 10000 << 20 // 8 MiB

	// 文件上传路由
	r.POST("/api/upload", handlers.UploadFile)

	// 文件转换路由
	r.GET("/api/convert:fileId", handlers.ConvertCSVFile) // 修改为GET方法

	// 文件下载路由
	r.GET("/api/download:fileId", handlers.DownloadFile)

	// 启动服务器
	r.Run(":8080")
}
