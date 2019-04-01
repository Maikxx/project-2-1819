import Express from 'express'

export function decompress(request: Express.Request, response: Express.Response, next: Express.NextFunction) {
    const encoding = request.headers['accept-encoding']
    const extensionIndex = request.originalUrl.lastIndexOf('.')
    const extension = request.originalUrl.slice(extensionIndex)

    if (encoding) {
        if (encoding.includes('br')) {
            request.url = `${request.url}.br`
            response.setHeader('Content-Encoding', 'br')
        } else if (encoding.includes('gzip')) {
            request.url = `${request.url}.gz`
            response.setHeader('Content-Encoding', 'gzip')
        }
    }

    response.set('Content-Type', extension === '.js' ? 'text/javascript' : 'text/css')
    next()
}
