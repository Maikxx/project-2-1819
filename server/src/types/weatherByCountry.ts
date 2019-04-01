export interface MonthlyAvg {
    high: number
    low: number
    dryDays: number
    snowDays?: number
    rainfall: number
}

export interface WeatherByCountry {
    id: number
    city: string
    country: string
    monthlyAvg: MonthlyAvg[]
}
