import Express from 'express'
import fetch from 'node-fetch'
import { WeatherByCountry } from '../types/weatherByCountry'
import { uniqBy, sortBy } from 'lodash'

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

export function getRoom(weatherByCountry: WeatherByCountry[]) {
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

                if (monthlyAvg) {
                    return monthlyAvg.low <= roomTemperature && monthlyAvg.high >= roomTemperature
                } else {
                    return false
                }
            })

            const uniqueMatches = sortBy(uniqBy(matches, 'country'), 'country')

            response.status(200).render('pages/room', {
                room,
                matches: uniqueMatches,
            })
        } catch (error) {
            console.error(error)
            response.status(500).redirect('/')
        }
    }
}
