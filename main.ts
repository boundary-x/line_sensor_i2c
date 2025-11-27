// ======================================================
//  I2C 5-Way Line Sensor (emakefun / DFRobot 호환) 
//  Micro:bit MakeCode Extension  — main.ts
//  RAW 16bit 읽기 + S4 반전 보정 + LED/Serial 테스트 포함
// ======================================================

namespace emkfLineSensor {

    const ADDR = 0x50

    /**
     * 16비트 레지스터 읽기
     */
    function read16(reg: number): number {
        pins.i2cWriteNumber(ADDR, reg, NumberFormat.UInt8BE)
        let hi = pins.i2cReadNumber(ADDR, NumberFormat.UInt8BE)
        let lo = pins.i2cReadNumber(ADDR, NumberFormat.UInt8BE)
        return (hi << 8) | lo
    }

    /**
     * RAW 값 읽기 (S0 ~ S4)
     * returns [s0, s1, s2, s3, s4]
     */
    //% block="Read RAW line sensor values"
    export function readRaw(): number[] {
        let s0 = read16(0x10)
        let s1 = read16(0x12)
        let s2 = read16(0x14)
        let s3 = read16(0x16)
        let s4 = read16(0x18)
        return [s0, s1, s2, s3, s4]
    }

    /**
     * RAW → Digital 변환
     * 숫자가 클수록 "검은색"
     * 단, S4는 반대로 동작하므로 자동 보정
     */
    //% block="Read DIGITAL (threshold %threshold)"
    export function readDigital(threshold: number = 30000): boolean[] {

        let raw = readRaw()
        let dig: boolean[] = []

        for (let i = 0; i < 5; i++) {
            let isBlack = raw[i] > threshold // 큰 값이면 검정
            dig.push(isBlack)
        }

        // ⚠ S4만 반전되어 들어오므로 추가 보정
        dig[4] = !dig[4]

        return dig
    }

    /**
     * LED 행렬에 센서 반응 표시
     * S0~S4 → LED 4~0열 (좌→우 보정)
     */
    //% block="Show sensor on LED (threshold %threshold)"
    export function showLED(threshold: number = 30000): void {
        let dig = readDigital(threshold)
        basic.clearScreen()

        for (let i = 0; i < 5; i++) {
            if (dig[i]) {
                let col = 4 - i   // 방향 맞추기 (S0=왼쪽 → col4)
                for (let y = 0; y < 5; y++) {
                    led.plot(col, y)
                }
            }
        }
    }
}


// ======================================================
//  테스트 코드 (시리얼 + LED 매트릭스)
// ======================================================

basic.forever(function () {

    let raw = emkfLineSensor.readRaw()
    let dig = emkfLineSensor.readDigital(30000)

    // ---- 시리얼 출력 ----
    serial.writeLine(
        "RAW: " +
        raw[0] + " " +
        raw[1] + " " +
        raw[2] + " " +
        raw[3] + " " +
        raw[4]
    )

    serial.writeLine(
        "DIG: " +
        dig[0] + " " +
        dig[1] + " " +
        dig[2] + " " +
        dig[3] + " " +
        dig[4]
    )
    serial.writeLine("")

    // ---- LED 시각화 ----
    emkfLineSensor.showLED(30000)

    basic.pause(120)
})
