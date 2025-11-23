/** 
 * Emakefun I2C 5-Way Line Sensor
 * Address: 0x50
 */

namespace emkfLineSensor {

    const ADDR = 0x50

    // 16bit 읽기
    function read16(reg: number): number {
        pins.i2cWriteNumber(ADDR, reg, NumberFormat.UInt8BE)
        let hi = pins.i2cReadNumber(ADDR, NumberFormat.UInt8BE)
        let lo = pins.i2cReadNumber(ADDR + 1, NumberFormat.UInt8BE)
        return (hi << 8) | lo
    }

    /**
     * Read all 5 raw sensor values
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
     * Convert to digital using threshold
     */
    //% block="Read digital (threshold %threshold)"
    export function readDigital(threshold: number = 150): boolean[] {
        let raw = readRaw()
        let out: boolean[] = []
        for (let i = 0; i < 5; i++) {
            out.push(raw[i] < threshold)
        }
        return out
    }

    /**
     * Show sensor values on micro:bit LED
     */
    //% block="Show sensor on LED (threshold %threshold)"
    export function showLED(threshold: number = 150): void {
        let dig = readDigital(threshold)
        basic.clearScreen()

        for (let col = 0; col < 5; col++) {
            if (dig[col]) {
                for (let y = 0; y < 5; y++) {
                    led.plot(col, y)
                }
            }
        }
    }
}
