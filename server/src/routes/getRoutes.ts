require('dotenv').config()
import Express from 'express'
import fetch, { Response } from 'node-fetch'
import { uniqBy, sortBy } from 'lodash'
import { Country } from '../types/Country'
import util from 'util'
import fs from 'fs'
import path from 'path'
import { Room } from '../types/Room'
const readFile = util.promisify(fs.readFile)

export function getIndexRoute() {
    return async function(request: Express.Request, response: Express.Response) {
        try {
            const fetchResponse = await fetch('http://mirabeau.denniswegereef.nl/api/v1/rooms')
            const data = await fetchResponse.json()
            const rooms: Room[] = data && data.data

            if (rooms && rooms.length > 0) {
                response.status(200).render('pages/index', {
                    rooms: sortBy(rooms, 'measurements.occupancy'),
                })
            } else {
                throw new Error('No rooms could be found!')
            }
        } catch (error) {
            console.error(error)
            response.status(500).redirect('/offline')
        }
    }
}

export function getRoomRoute(countries: Country[]) {
    return async function(request: Express.Request, response: Express.Response) {
        const { name } = request.params as { name?: string }
        const fetchableName: string | undefined = name && name.toLowerCase().replace(' ', '_')

        try {
            const data: Response = await fetch(`http://mirabeau.denniswegereef.nl/api/v1/room/${fetchableName}`)
            const { data: room } = await data.json()

            if (room) {
                const matches = filterCountriesByRoomTemperature(countries, room)

                const updatedMatches = await Promise.all(matches.map(async country => {
                    if (country.countryCode && country.countryCode.length > 0) {
                        // tslint:disable-next-line:ter-max-len
                        const svg = await readFile(path.join(__dirname, `../../public/assets/images/country_vectors/${country.countryCode.toLowerCase()}/vector.svg`))
                        // tslint:disable-next-line:ter-max-len
                        const countryFlagSvg = await readFile(path.join(__dirname, `../../public/assets/images/country_flags/${country.countryCode.toLowerCase()}.svg`))

                        return {
                            ...country,
                            shape: svg.toString(),
                            countryFlag: countryFlagSvg.toString(),
                        }
                    } else {
                        return {
                            ...country,
                            shape: null,
                            countryFlag: null,
                        }
                    }
                }))

                response.status(200).render('pages/room', {
                    room,
                    matches: sortBy(uniqBy(updatedMatches, 'country'), 'country'),
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

function filterCountriesByRoomTemperature(countries: Country[], room: Room) {
    const roomTemperature: number = Math.floor(room.measurements.temperature / 1000)
    const currentMonthNumber: number = new Date().getMonth()

    return countries.filter(country => {
        if (country) {
            const monthlyAvg = country.monthlyAvg[currentMonthNumber]

            return monthlyAvg
                ? monthlyAvg.low <= roomTemperature && monthlyAvg.high >= roomTemperature
                : false
        } else {
            return false
        }
    })
}

export function getOfflineRoute() {
    return function (request: Express.Request, response: Express.Response) {
        response.status(200).render('pages/offline')
    }
}
