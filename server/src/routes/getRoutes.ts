import Express from 'express'

export function getIndexRoute() {
    return async function(request: Express.Request, response: Express.Response) {
        response.status(200).render('pages/index', {})
    }
}
