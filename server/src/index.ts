import Express from 'express'
import Helmet from 'helmet'
import path from 'path'
import compression from 'compression'
import { cache } from './services/memoryCache'
import { decompress } from './services/decompressionService'
import { getIndexRoute, getRoomRoute, getOfflineRoute } from './routes/getRoutes'
import util from 'util'
import fs from 'fs'
import { Countries } from './types/countries'
import { updateStorageService } from './services/updateStorageService'

const readFile = util.promisify(fs.readFile)

; (async() => {
    const app = Express()

    try {
        const countryData: Buffer = await readFile(path.join(__dirname, '../public/data/countries.json'))
        const countries: Countries[] = JSON.parse(countryData.toString())
        const aWeekInSeconds: number = 60 * 60 * 24 * 7

        updateStorageService()

        app.use(Helmet())

        // This must stay before the Express.static, else it won't work
        app.get('*.js', decompress)
        app.get('*.css', decompress)

        app.use(Express.static(path.join(__dirname, '../public')))
        app.use(compression({
            filter: (request: Express.Request) => !!request.headers.accept && request.headers.accept.includes('text/html'),
        }))

        app.set('view engine', 'ejs')
        app.set('views', path.join(__dirname, 'views'))

        app.get('/', cache(aWeekInSeconds), getIndexRoute())
        app.get('/room/:name', cache(aWeekInSeconds), getRoomRoute(countries))
        app.get('/offline', cache(aWeekInSeconds), getOfflineRoute())

        app.listen(({ port: process.env.PORT || 3000 }), () => {
            console.info(`App is now open for action on port ${process.env.PORT || 3000}.`)
        })
    } catch (error) {
        console.error(error)
        throw new Error(error.message)
    }
})()
