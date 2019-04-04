 export interface Measurements {
    bapLevel: number
    temperature: number
    batt: number
    mic_level: number
    ambient_light: number
    humidity: number
    co2: number
    occupancy: boolean
    uv_index: number
    voc: number
}

export interface Room {
    timestamp: number
    hwaddr: string
    room_name: string
    measurements: Measurements
}
