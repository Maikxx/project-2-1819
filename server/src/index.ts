import Express from 'express'
import Helmet from 'helmet'
import path from 'path'
import compression from 'compression'
import { cache } from './services/memoryCache'
import { decompress } from './services/decompressionService'
import { getIndexRoute, getRoom } from './routes/getRoutes'
import util from 'util'
import path from 'path'
import fs from 'fs'
const readFile = util.promisify(fs.readFile)

; (async() => {
    const app = Express()

    try {
        const weatherByCountryData = await readFile(path.join(__dirname, '../public/data/average_weather_by_country.json'))
        const weatherByCountry = JSON.parse(weatherByCountryData.toString())

        app.use(Helmet())
        app.use(Express.static(path.join(__dirname, '../public')))
        app.use(compression({
            filter: (request: Express.Request) => {
                if (request.headers.accept) {
                    return request.headers.accept.includes('text/html')
                }

                return false
            },
        }))
        app.get('scripts/*.js', decompress)
        app.get('*.css', decompress)

        app.set('view engine', 'ejs')
        app.set('views', path.join(__dirname, 'views'))

        const aWeekInSeconds = 60 * 60 * 24 * 7

        app.get('/', cache(aWeekInSeconds), getIndexRoute())
        app.get('/room/:name', cache(aWeekInSeconds), getRoom(weatherByCountry))

        app.listen(({ port: process.env.PORT || 3000 }), () => {
            console.info(`App is now open for action on port ${process.env.PORT || 3000}.`)
        })
    } catch (error) {
        console.error(error)
        throw new Error(error.message)
    }
})()
