import { statusCodeToErrorMessage } from './statusCodeToErrorMessage.js'

export const handleResponse = (
    res, 
      {
        statusCode = 200, 
        data = null, 
        contentType = 'application/json', 
        isError = false,
        message = ''
      }) =>
    {
        // Set response headers and status code
        res.setHeader('Content-Type', contentType)
        res.statusCode = statusCode

        // Send error or data response
        if (isError) {
        res.end(JSON.stringify({
            error: statusCodeToErrorMessage(statusCode),
            message: message
        }))
        } 
        else {
            res.end(JSON.stringify(data))
        }
    }

