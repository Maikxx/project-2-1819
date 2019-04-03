import Express from 'express'

export function decompress(request: Express.Request, response: Express.Response, next: Express.NextFunction) {
    const encoding: string | string[] | undefined = request.headers['accept-encoding']
    const extensionIndex: number = request.originalUrl.lastIndexOf('.')
    const extension: string | undefined = request.originalUrl.slice(extensionIndex)

    if (encoding) {
        if (encoding.includes('br')) {
            request.url = `${request.url}.br`
            response.setHeader('Content-Encoding', 'br')
        } else if (encoding.includes('gzip')) {
            request.url = `${request.url}.gz`
            response.setHeader('Content-Encoding', 'gzip')
        }
    }

    response.setHeader('Content-Type', extension === '.js' ? 'text/javascript' : 'text/css')
    next()
}
