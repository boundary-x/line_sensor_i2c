/**
 * Emakefun I2C 5-Way Line Sensor (ITR9909)
 * FINAL VERSION — Sensor-specific threshold + flip correction
 * Verified with real RAW data by BoundaryX
 */

namespace emakefunLine {

    const I2C_ADDR = 0x50

    // Sensor-specific threshold (calculated from real white/black measurements)
    const threshold = [45450, 37200, 25525, 45175, 41000]

    // Sensor-specific polarity (true = black > white)
    const flip = [false, true, true, false, false]

    let initialized = false

    /**
     * Initialize the sensor (Enable MCU & Gain)
     */
    function init(): void {
        if (initialized) return

        // Enable MCU
        pins.i2cWriteNumber(I2C_ADDR, 0x00, NumberFormat.UInt8BE)
        pins.i2cWriteNumber(I2C_ADDR, 0x01, NumberFormat.UInt8BE)

        // Gain preset
        pins.i2cWriteNumber(I2C_ADDR, 0x20, NumberFormat.UInt8BE)
        pins.i2cWriteNumber(I2C_ADDR, 0x01, NumberFormat.UInt8BE)

        initialized = true
    }

    /**
     * Read 16-bit big-endian sensor value
     */
    function read16(reg: number): number {
        init()
        pins.i2cWriteNumber(I2C_ADDR, reg, NumberFormat.UInt8BE)
        return pins.i2cReadNumber(I2C_ADDR, NumberFormat.UInt16BE)
    }

    /**
     * Get RAW 16-bit value of S0~S4
     */
    //% block="get raw value of sensor %index"
    //% index.min=0 index.max=4
    export function raw(index: number): number {
        let reg = 0
        switch (index) {
            case 0: reg = 0x10; break
            case 1: reg = 0x12; break
            case 2: reg = 0x14; break
            case 3: reg = 0x16; break
            case 4: reg = 0x18; break
            default: reg = 0x10
        }
        return read16(reg)
    }

    /**
     * Final binary decision for each sensor
     * 1 = black, 0 = white
     */
    //% block="read sensor %index (0 white / 1 black)"
    //% index.min=0 index.max=4
    export function read(index: number): number {
        const v = raw(index)

        if (!flip[index]) {
            // Normal: white > black
            return (v < threshold[index]) ? 1 : 0
        } else {
            // Flipped: black > white
            return (v >= threshold[index]) ? 1 : 0
        }
    }

    /**
     * Read 5-sensor pattern as 5-bit number
     * Example: 01110 = 14
     */
    //% block="get line pattern (5-bit)"
    export function getPattern(): number {
        let b0 = read(0)
        let b1 = read(1)
        let b2 = read(2)
        let b3 = read(3)
        let b4 = read(4)
        return (b0 << 4) | (b1 << 3) | (b2 << 2) | (b3 << 1) | b4
    }
}
