import Express from 'express'
import memoryCache from 'memory-cache'

export function cache(duration: number) {
    return function (request: Express.Request, response: Express.Response, next: Express.NextFunction): any {
        const key = `__express__${request.originalUrl || request.url}`
        const cachedBody = memoryCache.get(key)

        if (cachedBody) {
            return response.send(cachedBody)
        } else {
            (response as any).sendResponse = response.send
            ; (response as any).send = (body: any) => {
                memoryCache.put(key, body, duration * 1000)
                ; (response as any).sendResponse(body)
            }
        }

        next()
    }
}
