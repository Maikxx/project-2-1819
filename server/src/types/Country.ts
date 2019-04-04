export interface Country extends WeatherByCountry {
    animalName: string | undefined
    countryCode: string
}

export interface CountryCodeToCountryName {
    [key: string]: string
}

export interface NationalAnimalByCountry {
    country: string
    name: string
}

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
