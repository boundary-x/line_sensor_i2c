//% weight=100 color=#0080FF icon="\uf063" block="FiveWayTracker V3"
namespace FiveWayTracker {

    const I2C_ADDR = 0x50

    // Register map (Arduino 라이브러리 기반)
    const REG_DEVICE_ID = 0x00
    const REG_FIRMWARE = 0x01

    const REG_ANALOG_BASE = 0x10  // S0=0x10/0x11 ~ S4=0x18/0x19
    const REG_DIGITAL = 0x1A      // bit-pack digital S0~S4

    const REG_THRESHOLD_HIGH = 0x1C   // 2바이트씩 5개
    const REG_THRESHOLD_LOW = 0x26    // 2바이트씩 5개


    //---------------------------------------------
    // 🔹 내부 I2C 통신 함수
    //---------------------------------------------

    function readU8(reg: number): number {
        pins.i2cWriteNumber(I2C_ADDR, reg, NumberFormat.UInt8BE)
        return pins.i2cReadNumber(I2C_ADDR, NumberFormat.UInt8BE)
    }

    function readU16(reg: number): number {
        pins.i2cWriteNumber(I2C_ADDR, reg, NumberFormat.UInt8BE)
        return pins.i2cReadNumber(I2C_ADDR, NumberFormat.UInt16BE)
    }

    function writeU16(reg: number, value: number) {
        let buf = pins.createBuffer(3)
        buf[0] = reg
        buf[1] = (value >> 8) & 0xFF
        buf[2] = value & 0xFF
        pins.i2cWriteBuffer(I2C_ADDR, buf)
    }

    //---------------------------------------------
    // 🔹 Device Info
    //---------------------------------------------

    //% block="get device ID"
    export function getDeviceID(): number {
        return readU8(REG_DEVICE_ID)
    }

    //% block="get firmware version"
    export function getFirmware(): number {
        return readU8(REG_FIRMWARE)
    }

    //---------------------------------------------
    // 🔹 RAW Analog Reading (0~65535)
    //---------------------------------------------

    //% block="read RAW value of sensor %channel"
    //% channel.min=0 channel.max=4
    export function readRaw(channel: number): number {
        if (channel < 0 || channel > 4) return 0
        let reg = REG_ANALOG_BASE + channel * 2
        return readU16(reg)
    }

    //---------------------------------------------
    // 🔹 Digital (0 or 1)
    //---------------------------------------------

    //% block="read digital value of sensor %channel"
    //% channel.min=0 channel.max=4
    export function readDigital(channel: number): number {
        if (channel < 0 || channel > 4) return 0
        let data = readU8(REG_DIGITAL)
        return (data >> channel) & 0x01
    }

    //---------------------------------------------
    // 🔹 Threshold Read & Write
    //---------------------------------------------

    //% block="set HIGH threshold of sensor %channel to %value"
    //% channel.min=0 channel.max=4
    export function setHighThreshold(channel: number, value: number) {
        if (channel < 0 || channel > 4) return
        writeU16(REG_THRESHOLD_HIGH + channel * 2, value)
    }

    //% block="set LOW threshold of sensor %channel to %value"
    //% channel.min=0 channel.max=4
    export function setLowThreshold(channel: number, value: number) {
        if (channel < 0 || channel > 4) return
        writeU16(REG_THRESHOLD_LOW + channel * 2, value)
    }

    //% block="read HIGH threshold of sensor %channel"
    //% channel.min=0 channel.max=4
    export function readHighThreshold(channel: number): number {
        if (channel < 0 || channel > 4) return 0
        return readU16(REG_THRESHOLD_HIGH + channel * 2)
    }

    //% block="read LOW threshold of sensor %channel"
    //% channel.min=0 channel.max=4
    export function readLowThreshold(channel: number): number {
        if (channel < 0 || channel > 4) return 0
        return readU16(REG_THRESHOLD_LOW + channel * 2)
    }
}
