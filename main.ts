/**
 * Emakefun 5-Way Tracking Sensor V2.0 Extension
 * Official register-based implementation
 */

//% weight=100 color=#3CA6FF icon="\uf41b" block="FiveWayTracker"
namespace fiveway {

    const I2C_ADDR = 0x50
    const ANALOG_START = 0x02   // 10 bytes (S0~S4)
    const DIGITAL_ADDR = 0x0C   // 1 byte

    /**
     * I2C에서 n바이트 읽기
     */
    function i2cRead(buf: number, len: number): Buffer {
        pins.i2cWriteNumber(I2C_ADDR, buf, NumberFormat.UInt8BE)
        return pins.i2cReadBuffer(I2C_ADDR, len)
    }

    /**
     * 센서 RAW 값 읽기 (0~1023 범위)
     * @param index 센서 번호 0~4
     */
    //% block="read RAW of sensor %index"
    //% index.min=0 index.max=4
    export function readRaw(index: number): number {
        const buffer = i2cRead(ANALOG_START, 10)
        const high = buffer[index * 2]
        const low = buffer[index * 2 + 1]
        return (high << 8) | low
    }

    /**
     * 전체 RAW 배열 읽기
     * @returns number[] (길이 5)
     */
    //% block="read all RAW values"
    export function readAllRaw(): number[] {
        const buffer = i2cRead(ANALOG_START, 10)
        let result: number[] = []
        for (let i = 0; i < 5; i++) {
            const high = buffer[i * 2]
            const low = buffer[i * 2 + 1]
            const raw = (high << 8) | low
            result.push(raw)
        }
        return result
    }

    /**
     * 디지털 판정 읽기
     * 1 = White, 0 = Black
     */
    //% block="digital state of sensor %index"
    //% index.min=0 index.max=4
    export function readDigital(index: number): number {
        const buffer = i2cRead(DIGITAL_ADDR, 1)
        const bits = buffer[0]
        return (bits >> index) & 0x01
    }

    /**
     * 전체 디지털 상태 배열 반환
     */
    //% block="read all digital states"
    export function readAllDigital(): number[] {
        const buffer = i2cRead(DIGITAL_ADDR, 1)
        let bits = buffer[0]
        let result: number[] = []
        for (let i = 0; i < 5; i++) {
            result.push((bits >> i) & 0x01)
        }
        return result
    }

    /**
     * RAW 기반 threshold 판정
     * @param index 0~4 센서 번호
     * @param threshold 기준값
     */
    //% block="is sensor %index over %threshold ?"
    //% index.min=0 index.max=4
    export function isOver(index: number, threshold: number): boolean {
        const raw = readRaw(index)
        return raw > threshold
    }
}

