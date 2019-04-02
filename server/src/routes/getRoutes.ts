require('dotenv').config()
import Express from 'express'
import fetch from 'node-fetch'
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
    const currentMonthNumber = new Date().getMonth()

    return async function(request: Express.Request, response: Express.Response) {
        const { name } = request.params as { name?: string }
        const fetchableName = name && name.toLowerCase().replace(' ', '_')

        try {
            const data = await fetch(`http://mirabeau.denniswegereef.nl/api/v1/room/${fetchableName}`)
            const { data: room } = await data.json()
            const roomTemperature = Math.floor(room.measurements.temperature / 1000)

            const matches = await Promise.all(countries
                .filter(country => {
                    const monthlyAvg = country.monthlyAvg[currentMonthNumber]

                    return monthlyAvg
                        ? monthlyAvg.low <= roomTemperature && monthlyAvg.high >= roomTemperature
                        : false
                }).map(async match => {
                    if (match.animalName) {
                        // tslint:disable-next-line:ter-max-len
                        const unsplashUrl = `https://api.unsplash.com/search/photos?client_id=${process.env.UNSPLASH_KEY}&query=${match.animalName}&collections=animals`
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
                                ...match,
                                imageUrl: b64,
                            }
                        }
                    }

                    return null
                }).filter(match => !!match))

            response.status(200).render('pages/room', {
                room,
                matches: sortBy(uniqBy(matches, 'country'), 'country'),
            })
        } catch (error) {
            console.error(error.message)
            response.status(500).redirect('/')
        }
    }
}
