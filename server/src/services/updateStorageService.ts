require('dotenv').config()
import path from 'path'
import util from 'util'
import fs from 'fs'
import { WeatherByCountry } from '../types/weatherByCountry'
import { NationalAnimalByCountry } from '../types/animalByCountry'
import fetch from 'node-fetch'

const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)

export async function updateStorageService() {
    const weatherByCountryData = await readFile(path.join(__dirname, '../../public/data/average_weather_by_country.json'))
    const weatherByCountry = JSON.parse(weatherByCountryData.toString()) as WeatherByCountry[]
    const nationalAnimalByCountryData = await readFile(path.join(__dirname, '../../public/data/animals_by_country.json'))
    const nationalAnimalByCountry = JSON.parse(nationalAnimalByCountryData.toString()) as NationalAnimalByCountry[]
    const transformedCountries = await Promise.all(weatherByCountry.map(async country => {
        const animalMatch = nationalAnimalByCountry.find(({ country: nac }) => nac === country.country)

        if (animalMatch) {
            // tslint:disable-next-line:ter-max-len
            const unsplashUrl = `https://api.unsplash.com/search/photos?client_id=${process.env.UNSPLASH_KEY}&query=${animalMatch.name}&collections=animals`
            const data = await fetch(unsplashUrl, { headers: { 'X-Ratelimit-Limit': '1000' } })
            const results = data && await data.json()
            const images = results && results.results as any[]
            let b64

            if (images && images.length > 0) {
                const filteredImages = images
                    .filter(image => image.tags && image.tags.filter((tag: { title: string }) => tag.title.includes('animal')).length > 0)

                if (filteredImages && filteredImages.length > 0) {
                    const imageUrl = filteredImages[0].urls && filteredImages[0].urls.small

                    if (imageUrl) {
                        const response = await fetch(imageUrl, { headers: { 'X-Ratelimit-Limit': '1000' } })

                        if (response) {
                            const contentType = 'image/jpeg'
                            const buffer = await response.buffer()

                            b64 = `data:${contentType};base64,${buffer.toString('base64')}`
                        }
                    }
                }

                return {
                    ...country,
                    animalName: animalMatch.name,
                    imageUrl: b64,
                }
            }
        }

        return null
    }).filter(match => !!match))

    await writeFile(path.join(__dirname, '../../public/data/countries.json'), JSON.stringify(transformedCountries))
}
