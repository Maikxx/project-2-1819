import path from 'path'
import util from 'util'
import fs from 'fs'
import { WeatherByCountry } from '../types/weatherByCountry'
import { NationalAnimalByCountry } from '../types/animalByCountry'

const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)

export async function updateStorageService() {
    const weatherByCountryData = await readFile(path.join(__dirname, '../public/data/average_weather_by_country.json'))
    const weatherByCountry = JSON.parse(weatherByCountryData.toString()) as WeatherByCountry[]
    const nationalAnimalByCountryData = await readFile(path.join(__dirname, '../public/data/animals_by_country.json'))
    const nationalAnimalByCountry = JSON.parse(nationalAnimalByCountryData.toString()) as NationalAnimalByCountry[]
    const ddd = weatherByCountry.map(country => {
        const animalMatch = nationalAnimalByCountry.find(cc => cc.country === country.country)

        return {
            ...country,
            animalName: animalMatch ? animalMatch.name : undefined,
        }
    })

    await writeFile(path.join(__dirname, '../public/data/country.json'), JSON.stringify(ddd))
}
