import { WeatherByCountry } from './weatherByCountry'

export interface Countries extends WeatherByCountry {
    animalName: string | undefined
}

export interface CountryCodeToCountryName {
    [key: string]: string
}
