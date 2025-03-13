package services

import (
	"encoding/csv"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strconv"
	"strings"

	"github.com/yanmengfei/coord"
)

func ConvertCSV(inputPath, fileName string) (string, error) {
	// 打开输入文件
	inputFile, err := os.Open(inputPath)
	if err != nil {
		return "", err
	}
	defer inputFile.Close()

	// 创建一个临时文件来保存转换后的文件
	tempFile, err := os.CreateTemp("./converted/", "converted-*.csv")
	if err != nil {
		return "", err
	}
	defer tempFile.Close()

	// 读取CSV文件
	reader := csv.NewReader(inputFile)
	writer := csv.NewWriter(tempFile)

	// 读取第一行（字段名称）
	headers, err := reader.Read()
	if err != nil {
		return "", err
	}

	// 检查字段名称中是否包含 "lat" 和 "lon"，并记录它们的位置
	latIndex := -1
	lonIndex := -1
	for i, header := range headers {
		if header == "lat" {
			latIndex = i
		}
		if header == "lng" {
			lonIndex = i
		}
	}
	if latIndex == -1 || lonIndex == -1 {
		return "", fmt.Errorf("CSV file must contain 'lat' and 'lon' fields")
	}

	// 添加 "address" 字段到 headers
	headers = append(headers, "address")

	// 写入字段名称到临时文件
	if err := writer.Write(headers); err != nil {
		return "", err
	}

	// 读取并处理每一行
	for {
		record, err := reader.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			return "", err
		}

		// 检查记录长度是否足够
		if len(record) <= latIndex || len(record) <= lonIndex {
			return "", fmt.Errorf("invalid CSV format: record does not contain 'lat' and 'lon' fields")
		}

		// 使用记录的位置获取经纬度值并转换为 float64
		latStr := record[latIndex]
		lonStr := record[lonIndex]
		lat, err := strconv.ParseFloat(latStr, 64)
		if err != nil {
			return "", fmt.Errorf("failed to parse latitude: %v", err)
		}
		lon, err := strconv.ParseFloat(lonStr, 64)
		if err != nil {
			return "", fmt.Errorf("failed to parse longitude: %v", err)
		}

		// 调用第三方API进行经纬度逆地址转换
		address, err := reverseGeocode(lat, lon)
		if err != nil {
			return "", err
		}

		// 将转换后的地址添加到记录中
		record = append(record, address)

		// 写入转换后的记录到临时文件
		if err := writer.Write(record); err != nil {
			return "", err
		}
	}

	// 刷新写入器
	writer.Flush()

	return strings.Replace(tempFile.Name(), "./converted/", "", 1), nil
}

func GetConvertedFilePath(fileId string) (string, error) {
	// 这里简化为假设文件名即为转换后的文件名
	return fmt.Sprintf("./converted/%s", fileId), nil
}

func reverseGeocode(Lat, Lng float64) (string, error) {
	// 构建请求URL
	url := "https://geo.util.linketech.cn/api/tianditu/reverse"
	var lon, lat, _ = coord.LocationToFloat64Coord(fmt.Sprintf("%.6f,%.6f", Lat, Lng))
	// 创建请求
	request, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return "", fmt.Errorf("failed to create request: %v", err)
	}

	// 添加查询参数
	params := request.URL.Query()
	params.Add("coordtype", "wgs84")
	params.Add("location", fmt.Sprintf("%.6f,%.6f", lon, lat))
	params.Add("getcache", "false")
	request.URL.RawQuery = params.Encode()

	// 创建HTTP客户端
	client := &http.Client{}

	// 发送请求
	response, err := client.Do(request)
	if err != nil {
		return "", fmt.Errorf("failed to send request: %v", err)
	}
	defer response.Body.Close()

	// 检查响应状态码
	if response.StatusCode != http.StatusOK {
		return "", fmt.Errorf("unexpected status code: %d", response.StatusCode)
	}

	// 检查响应状态码
	if response.StatusCode != 200 {
		return "", fmt.Errorf("respones status code: %d", response.StatusCode)
	}

	// 修改后的响应解析部分
	var results []requestMsg // 值类型声明
	if err := json.NewDecoder(response.Body).Decode(&results); err != nil {
		return "", fmt.Errorf("failed to decode response1: %v", err)
	}

	if len(results) == 0 {
		return "", fmt.Errorf("empty result array")
	}

	// 打印获取到的 address 数据
	fmt.Println("Address:", results[0].Address)

	return results[0].Address, nil
}

type requestMsg struct {
	Latitude  float32 `json:"latitude"`
	Longitude float32 `json:"longitude"`
	GeoHash   string  `json:"geoHash"`
	IsCache   bool    `json:"isCache"`
	Address   string  `json:"address"`
}