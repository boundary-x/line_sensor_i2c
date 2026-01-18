# 5-Way Line Sensor Extension for MakeCode

This extension allows you to control the **I2C 5-Channel Line Tracking Sensor** with the BBC micro:bit.
It provides easy-to-use blocks for reading digital states, raw analog values, and calibrating thresholds.

> **Developed by [Boundary X](http://boundaryx.io)**

## Hardware Connection

The sensor communicates via the **I2C interface** (Default Address: `0x50`).
Connect the sensor to the micro:bit as follows:

* **VCC**: 3.3V (or 5V depending on sensor specifications)
* **GND**: GND
* **SDA**: Pin 20
* **SCL**: Pin 19

## Usage

### 1. Read Digital Values
Reads the simple On/Off state of the sensor. This is useful for basic line following logic.
* **Returns**: `0` (Line detected) or `1` (Background), *logic may vary depending on hardware.*
* **Channel**: `0` to `4`

```blocks
basic.forever(function () {
    // Example: If the center sensor (2) sees the line (0)
    if (FiveWayTracker.readDigital(2) == 0) {
        basic.showIcon(IconNames.Happy)
    } else {
        basic.showIcon(IconNames.Sad)
    }
})
```

### 2. Read Raw Analog Values
Reads the raw sensor value for precision control (e.g., PID algorithms).
* **Returns**: 0 ~ 65535 (16-bit integer).
```blocks
let sensorVal = FiveWayTracker.readRaw(2)
serial.writeValue("Center", sensorVal)
```

### 3. Calibration (Thresholds)
You can set the sensitivity of the digital detection by adjusting the High/Low thresholds.
* **High Threshold**: Above this value, the sensor state is considered High (e.g., White).
* **Low Threshold**: Below this value, the sensor state is considered Low (e.g., Black).
```blocks
// Set thresholds for Channel 2
FiveWayTracker.setHighThreshold(2, 40000)
FiveWayTracker.setLowThreshold(2, 20000)
```

### API Documentation
* getDeviceID(): Returns the device ID (Register 0x00).
* getFirmware(): Returns the firmware version (Register 0x01).
* readRaw(channel): Reads the 16-bit analog value of the specified channel (0-4).
* readDigital(channel): Reads the digital value (0 or 1) of the specified channel.
* setHighThreshold(channel, value): Sets the high threshold for hysteresis.
* setLowThreshold(channel, value): Sets the low threshold for hysteresis.

### About
This extension was developed by Boundary X. We provide AI and digital education solutions for schools and institutions.

### License
MIT


## 확장으로 사용

이 저장소는 MakeCode에서 **확장**으로 추가될 수 있습니다.

* [https://makecode.microbit.org/](https://makecode.microbit.org/) 열기
* **새로운 프로젝트**에서 클릭
* 톱니바퀴 모양 메뉴에서 **확장**을 클릭합니다
* **https://github.com/boundary-x/line_sensor_i2c**으로 검색하고 가져오기

## 이 프로젝트 편집

MakeCode에서 이 저장소를 편집합니다.

* [https://makecode.microbit.org/](https://makecode.microbit.org/) 열기
* **가져오기**를 클릭한 다음 **가져오기 URL**를 클릭합니다
* **https://github.com/boundary-x/line_sensor_i2c**를 붙여넣고 가져오기를 클릭하세요.

#### 메타데이터(검색, 렌더링에 사용)

* for PXT/microbit
<script src="https://makecode.com/gh-pages-embed.js"></script><script>makeCodeRender("{{ site.makecode.home_url }}", "{{ site.github.owner_name }}/{{ site.github.repository_name }}");</script>
