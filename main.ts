// emakefun I2C 5-way Line Sensor for micro:bit
// Address: 0x50

namespace emkfLineSensor {

    const ADDR = 0x50

    // ---- I2C 16bit Read ----
    function read16(reg: number): number {
        pins.i2cWriteNumber(ADDR, reg, NumberFormat.UInt8BE)
        let hi = pins.i2cReadNumber(ADDR, NumberFormat.UInt8BE)
        pins.i2cWriteNumber(ADDR, reg + 1, NumberFormat.UInt8BE)
        let lo = pins.i2cReadNumber(ADDR, NumberFormat.UInt8BE)
        return (hi << 8) | lo
    }

    /**
     * Read RAW values for all 5 sensors
     */
    //% block="Read RAW line sensor values"
    export function readRaw(): number[] {
        let s1 = read16(0x10)
        let s2 = read16(0x12)
        let s3 = read16(0x14)
        let s4 = read16(0x16)
        let s5 = read16(0x18)
        return [s1, s2, s3, s4, s5]
    }

    /**
     * Read digital line sensor (auto threshold per sensor)
     */
    //% block="Read digital line sensors"
    export function readDigital(): boolean[] {

        // 센서별 threshold (데이터 기반 분석)
        // S1: 38,000   / S2: 40,000 / S3: 32,000
        // S4: 40,000 (역반사 → 작으면 검정)
        // S5: 46,000
        const T = [38000, 40000, 32000, 40000, 46000]

        let raw = readRaw()
        let out: boolean[] = []

        // Sensor 1,2,3,5 → RAW 큰 값 = 검정
        out[0] = raw[0] > T[0]
        out[1] = raw[1] > T[1]
        out[2] = raw[2] > T[2]

        // Sensor 4 → RAW 작은 값 = 검정 (역반사형)
        out[3] = raw[3] < T[3]

        // Sensor 5 → RAW 큰 값 = 검정 (신뢰 낮음)
        out[4] = raw[4] > T[4]

        return out
    }

    /**
     * Show digital results on LED
     */
    //% block="Show line sensor on LED"
    export function showLED(): void {
        let dig = readDigital()
        basic.clearScreen()

        for (let i = 0; i < 5; i++) {
            if (dig[i]) {
                for (let y = 0; y < 5; y++) {
                    led.plot(i, y)
                }
            }
        }
    }
}
