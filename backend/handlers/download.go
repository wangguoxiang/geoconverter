package handlers

import (
    "fmt"
    "net/http"
    "os"
    "github.com/gin-gonic/gin"
    "github.com/wangguoxiang/geocoverner/backend/services"
)

func DownloadFile(c *gin.Context) {
    fileId := c.Param("fileId")

    // 调用服务层获取转换后的文件路径
    convertedFilePath, err := services.GetConvertedFilePath(fileId)
    if err != nil {
        c.JSON(http.StatusNotFound, gin.H{"status": "error", "message": "File not found", "error": err.Error()})
        return
    }

    // 打开转换后的文件
    file, err := os.Open(convertedFilePath)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Failed to open file", "error": err.Error()})
        return
    }
    defer file.Close()

    // 设置响应头
    c.Header("Content-Disposition", fmt.Sprintf("attachment; filename=%s", fileId))
    c.Header("Content-Type", "text/csv")

    // 将文件内容写入响应
    _, err = io.Copy(c.Writer, file)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Failed to send file", "error": err.Error()})
        return
    }
}