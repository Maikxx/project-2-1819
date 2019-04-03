require('dotenv').config()
import Express from 'express'
import fetch, { Response } from 'node-fetch'
import { uniqBy, sortBy } from 'lodash'
import { Countries } from '../types/countries'

export function getIndexRoute() {
    return async function(request: Express.Request, response: Express.Response) {
        try {
            const data = await fetch('http://mirabeau.denniswegereef.nl/api/v1/rooms')
            const rooms = await data.json()

            response.status(200).render('pages/index', {
                rooms: rooms && rooms.data && sortBy(rooms.data, 'measurements.occupancy'),
            })
        } catch (error) {
            console.error(error)
            response.status(500).redirect('/')
        }
    }
}

export function getRoomRoute(countries: Countries[]) {
    const currentMonthNumber: number = new Date().getMonth()

    return async function(request: Express.Request, response: Express.Response) {
        const { name } = request.params as { name?: string }
        const fetchableName: string | undefined = name && name.toLowerCase().replace(' ', '_')

        try {
            const data: Response = await fetch(`http://mirabeau.denniswegereef.nl/api/v1/room/${fetchableName}`)
            const { data: room } = await data.json()

            if (room) {
                const roomTemperature: number = Math.floor(room.measurements.temperature / 1000)

                const matches = countries.filter(country => {
                    if (country) {
                        const monthlyAvg = country.monthlyAvg[currentMonthNumber]

                        return monthlyAvg
                            ? monthlyAvg.low <= roomTemperature && monthlyAvg.high >= roomTemperature
                            : false
                    } else {
                        return false
                    }
                })

                response.status(200).render('pages/room', {
                    room,
                    matches: sortBy(uniqBy(matches, 'country'), 'country'),
                })
            } else {
                response.status(500).redirect('/')
            }
        } catch (error) {
            console.error(error.message)
            response.status(500).redirect('/')
        }
    }
}

export function getOfflineRoute() {
    return function (request: Express.Request, response: Express.Response) {
        response.status(200).render('pages/offline')
    }
}
