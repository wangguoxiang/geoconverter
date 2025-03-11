package handlers

import (
    "fmt"
    "io"
    "net/http"
    "os"
    "github.com/gin-gonic/gin"
    "github.com/wangguoxiang/geocoverner/backend/services"
)

func UploadFile(c *gin.Context) {
    file, header, err := c.Request.FormFile("file")
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "File upload failed", "error": err.Error()})
        return
    }
    defer file.Close()

    // 创建一个临时文件来保存上传的文件
    tempFile, err := os.CreateTemp("", "upload-*.csv")
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Failed to create temporary file", "error": err.Error()})
        return
    }
    defer tempFile.Close()

    // 将上传的文件内容复制到临时文件
    _, err = io.Copy(tempFile, file)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Failed to save file", "error": err.Error()})
        return
    }

    // 调用服务层进行经纬度转换
    convertedFilePath, err := services.ConvertCSV(tempFile.Name(), header.Filename)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Failed to convert CSV", "error": err.Error()})
        return
    }

    // 返回文件ID（这里简化为文件名）
    c.JSON(http.StatusOK, gin.H{"status": "success", "message": "File uploaded successfully", "fileId": header.Filename})
}