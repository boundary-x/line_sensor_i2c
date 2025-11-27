/**
 * Emakefun I2C 5-Way Line Sensor (ITR9909)
 * Fully Verified MakeCode Extension
 * Author: BoundaryX
 */

namespace emakefunLine {

    // I2C Address of the Emakefun Line Sensor
    const I2C_ADDR = 0x50

    // Default threshold (white ~20k, black ~40k)
    let threshold = 30750

    // Track initialization state
    let initialized = false

    /**
     * Initialize the line sensor (must be done once)
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
     * Read 16-bit big-endian value from a register
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
     * Return 1 for BLACK, 0 for WHITE
     */
    //% block="read sensor %index (0 white / 1 black)"
    //% index.min=0 index.max=4
    export function read(index: number): number {
        const v = raw(index)
        return (v >= threshold) ? 1 : 0
    }

    /**
     * Set threshold manually
     */
    //% block="set threshold to %value"
    export function setThreshold(value: number): void {
        threshold = value
    }

    /**
     * Read 5-sensor pattern as a 5-bit number
     * Example: 0b01110 = 14
     */
    //% block="get line pattern (5-bit)"
    export function getPattern(): number {
        let s0 = read(0)
        let s1 = read(1)
        let s2 = read(2)
        let s3 = read(3)
        let s4 = read(4)
        return (s0 << 4) | (s1 << 3) | (s2 << 2) | (s3 << 1) | s4
    }
}
