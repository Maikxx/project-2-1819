import Express from 'express'
import fetch from 'node-fetch'
import { WeatherByCountry } from '../types/weatherByCountry'
import { uniqBy, sortBy } from 'lodash'
import { NationalAnimalByCountry } from '../types/animalByCountry'

export function getIndexRoute() {
    return async function(request: Express.Request, response: Express.Response) {
        try {
            const data = await fetch('http://mirabeau.denniswegereef.nl/api/v1/rooms')
            const rooms = await data.json()

            response.status(200).render('pages/index', {
                rooms: rooms && rooms.data,
            })
        } catch (error) {
            console.error(error)
            response.status(500).redirect('/')
        }
    }
}

export function getRoom(weatherByCountry: WeatherByCountry[], nationalAnimalByCountry: NationalAnimalByCountry[]) {
    const currentMonthNumber = new Date().getMonth()

    return async function(request: Express.Request, response: Express.Response) {
        const { name } = request.params as { name?: string }
        const fetchableName = name && name.toLowerCase().replace(' ', '_')

        try {
            const data = await fetch(`http://mirabeau.denniswegereef.nl/api/v1/room/${fetchableName}`)
            const { data: room } = await data.json()
            const roomTemperature = Math.floor(room.measurements.temperature / 1000)

            const matches = weatherByCountry.filter(country => {
                const monthlyAvg = country.monthlyAvg[currentMonthNumber]

                return monthlyAvg
                    ? monthlyAvg.low <= roomTemperature && monthlyAvg.high >= roomTemperature
                    : false
            }).map(match => {
                const animalForMatch = nationalAnimalByCountry.find(nc => nc.country === match.country)
                return {
                    ...match,
                    nationalAnimal: animalForMatch && animalForMatch.name,
                }
            })

            response.status(200).render('pages/room', {
                room,
                matches: sortBy(uniqBy(matches, 'country'), 'country'),
            })
        } catch (error) {
            console.error(error)
            response.status(500).redirect('/')
        }
    }
}
