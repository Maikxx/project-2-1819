import Express from 'express'
import fetch from 'node-fetch'

export function getIndexRoute() {
    return async function(request: Express.Request, response: Express.Response) {
        const data = await fetch('http://mirabeau.denniswegereef.nl/api/v1/rooms')
        const rooms = await data.json()

        response.status(200).render('pages/index', {
            rooms: rooms && rooms.data,
        })
    }
}

export function getRoom() {
    return async function(request: Express.Request, response: Express.Response) {
        const { name } = request.params
        // const data = await fetch('http://mirabeau.denniswegereef.nl/api/v1/rooms')

        response.status(200).render('pages/room', {
            room: {
                name: name,
            },
        })
    }
}
