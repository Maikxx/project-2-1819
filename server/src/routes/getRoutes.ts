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
const APIUrl = 'http://mirabeau.denniswegereef.nl/api/v1'

export function getIndexRoute(countries: Country[]) {
    return async function(request: Express.Request, response: Express.Response) {
        try {
            const fetchResponse = await fetch(`${APIUrl}/rooms`)
            const data = await fetchResponse.json()
            const rooms: Room[] = data && data.data

            if (rooms && rooms.length > 0) {
                const updatedRooms = rooms.map(room => {
                    const matchingCountries = filterCountriesByRoomTemperature(countries, room)
                    const countriesWithImageUrls = matchingCountries.map(country => {
                        if (country.countryCode && country.countryCode.length > 0) {
                            return {
                                ...country,
                                flagUrl: `../../assets/images/country_flags_png/${country.countryCode.toLowerCase()}.png`,
                            }
                        }

                        return {
                            ...country,
                            flagUrl: null,
                        }
                    })

                    return {
                        ...room,
                        countries: countriesWithImageUrls,
                    }
                })

                response.status(200).render('pages/index', {
                    rooms: sortBy(updatedRooms, 'measurements.occupancy'),
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
        let fetchableName: string | undefined = name && name.toLowerCase().replace(' ', '_')

        if (!fetchableName) {
            return response.status(404).redirect('/')
        }

        if (fetchableName.includes('desk_area') && fetchableName.includes('1')) {
            fetchableName = 'desk_area_1'
        } else if (fetchableName.includes('desk_area') && fetchableName.includes('2')) {
            fetchableName = 'desk_area_2'
        }

        try {
            const data: Response = await fetch(`${APIUrl}/room/${fetchableName}`)
            const { data: room } = await data.json()

            if (room) {
                const matches = filterCountriesByRoomTemperature(countries, room)

                const updatedMatches = await Promise.all(matches.map(async country => {
                    if (country.countryCode && country.countryCode.length > 0) {
                        const shapeSvgUrl = `../../public/assets/images/country_vectors/${country.countryCode.toLowerCase()}/vector.svg`
                        const svg = await readFile(path.join(__dirname, shapeSvgUrl))

                        const countryFlagSvgUrl = `../../public/assets/images/country_flags/${country.countryCode.toLowerCase()}.svg`
                        const countryFlagSvg = await readFile(path.join(__dirname, countryFlagSvgUrl))

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
