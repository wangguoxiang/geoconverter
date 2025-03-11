package services

import (
    "encoding/csv"
    "fmt"
    "io"
    "net/http"
    "os"
    "strings"
)

func ConvertCSV(inputPath, fileName string) (string, error) {
    // 打开输入文件
    inputFile, err := os.Open(inputPath)
    if err != nil {
        return "", err
    }
    defer inputFile.Close()

    // 创建一个临时文件来保存转换后的文件
    tempFile, err := os.CreateTemp("", "converted-*.csv")
    if err != nil {
        return "", err
    }
    defer tempFile.Close()

    // 读取CSV文件
    reader := csv.NewReader(inputFile)
    writer := csv.NewWriter(tempFile)

    // 读取并处理每一行
    for {
        record, err := reader.Read()
        if err == io.EOF {
            break
        }
        if err != nil {
            return "", err
        }

        // 假设经纬度在第二和第三列
        lat := record[1]
        lon := record[2]

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

    return tempFile.Name(), nil
}

func GetConvertedFilePath(fileId string) (string, error) {
    // 这里简化为假设文件名即为转换后的文件名
    return fmt.Sprintf("/path/to/converted/%s", fileId), nil
}

func reverseGeocode(lat, lon string) (string, error) {
    url := fmt.Sprintf("https://geo.util.linketech.cn/api/tianditu/reverse?lat=%s&lon=%s", lat, lon)
    resp, err := http.Get(url)
    if err != nil {
        return "", err
    }
    defer resp.Body.Close()

    if resp.StatusCode != http.StatusOK {
        return "", fmt.Errorf("failed to get address: %s", resp.Status)
    }

    var result map[string]interface{}
    if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
        return "", err
    }

    address, ok := result["address"].(string)
    if !ok {
        return "", fmt.Errorf("invalid response format")
    }

    return address, nil
}