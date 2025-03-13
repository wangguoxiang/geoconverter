package handlers

import (
	"io"
	"net/http"
	"os"

	"log"

	"github.com/gin-gonic/gin"
)

func UploadFile(c *gin.Context) {
	// 设置文件上传大小限制
	maxSize := 100 << 20 // 8 MiB
	c.Request.Body = http.MaxBytesReader(c.Writer, c.Request.Body, int64(maxSize))

	// 创建一个管道来读取上传的文件
	file, _, err := c.Request.FormFile("file")
	if err != nil {
		if err == http.ErrMissingFile {
			log.Printf("Error retrieving form file: no file provided")
			c.JSON(http.StatusOK, gin.H{"status": "error", "message": "Error retrieving form file: no file provided", "error": "no file provided"})
		} else {
			log.Printf("Error retrieving form file: %v", err)
			if err.Error() == "http: request body too large" {
				log.Printf("Error retrieving form file: file too large")
				c.JSON(http.StatusOK, gin.H{"status": "error", "message": "Error retrieving form file: file too large", "error": "file size exceeds the limit of 100 MiB"})
			} else {
				c.JSON(http.StatusOK, gin.H{"status": "error", "message": "Error", "error": err.Error()})
			}
		}
		return
	}
	defer file.Close()

	// 创建一个临时文件来保存上传的文件
	tempFile, err := os.CreateTemp("./converted/", "uploaded-*.csv")
	if err != nil {
		log.Printf("Error creating temp file: %v", err)
		c.JSON(http.StatusOK, gin.H{"status": "error", "message": "Error creating temp file", "error": err.Error()})
		return
	}
	defer tempFile.Close()

	// 使用 io.Copy 简化文件读取和写入操作
	_, err = io.Copy(tempFile, file)
	if err != nil {
		log.Printf("Error copying file to temp file: %v", err)
		c.JSON(http.StatusOK, gin.H{"status": "error", "message": "Error copying file to temp file", "error": err.Error()})
		return
	}

	// 关闭临时文件
	if err := tempFile.Close(); err != nil {
		log.Printf("Error closing temp file: %v", err)
		c.JSON(http.StatusOK, gin.H{"status": "error", "message": "Error closing temp file", "error": err.Error()})
		return
	}

	// 返回临时文件名
	c.JSON(http.StatusOK, gin.H{"status": "success", "message": "success", "filename": tempFile.Name()})
}
