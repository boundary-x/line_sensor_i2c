// emakefun I2C 5-way Line Sensor
namespace emkfLineSensor {

    const ADDR = 0x50

    /**
     * Read 16-bit value from register
     */
    function read16(reg: number): number {
        // Write register address
        pins.i2cWriteNumber(ADDR, reg, NumberFormat.UInt8BE)

        // Read 16-bit big-endian from same device
        let val = pins.i2cReadNumber(ADDR, NumberFormat.UInt16BE)

        return val
    }

    /**
     * Read RAW 5 sensor values (16-bit each)
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
     * Convert RAW to digital using threshold
     * Returns TRUE if black line detected
     */
    //% block="Read digital line (threshold %threshold)"
    export function readDigital(threshold: number = 30000): boolean[] {
        let raw = readRaw()
        let out: boolean[] = []
        for (let i = 0; i < 5; i++) {
            // 검은색 = 값 작음
            out.push(raw[i] < threshold)
        }
        return out
    }

    /**
     * Display digital sensor state on LED matrix
     */
    //% block="Show line sensor on LED (threshold %threshold)"
    export function showLED(threshold: number = 30000): void {
        let dig = readDigital(threshold)
        basic.clearScreen()

        for (let col = 0; col < 5; col++) {
            if (dig[col]) { // black line detected
                for (let row = 0; row < 5; row++) {
                    led.plot(col, row)
                }
            }
        }
    }
}
