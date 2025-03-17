package handlers

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/wangguoxiang/geoconverter/backend/services"
)

// ConvertCSVFile handles the conversion of CSV file containing latitude and longitude to addresses.
func ConvertCSVFile(c *gin.Context) {
	fileName := c.Query("fileId")
	if fileName == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "filename query parameter is required"})
		return
	}

	// Construct the full path to the converted file
	convertedFilePath, err := services.GetConvertedFilePath(fileName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// 打印路径进行调试
	log.Printf("Converted file path: %s", convertedFilePath)

	// Ensure the file exists in the converted directory
	if _, err := os.Stat(convertedFilePath); os.IsNotExist(err) {
		c.JSON(http.StatusNotFound, gin.H{"error": "file not found"})
		return
	}

	// Convert the CSV file
	convertedFileName, err := services.ConvertCSV(convertedFilePath, fileName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// 删除 fileName 文件
	err = os.Remove(convertedFilePath)
	if err != nil {
		log.Printf("Error removing file: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to remove file"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "CSV file converted successfully", "fileId": convertedFileName})
}
