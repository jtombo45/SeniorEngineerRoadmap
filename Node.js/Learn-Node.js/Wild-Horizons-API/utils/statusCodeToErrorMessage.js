export const statusCodeToErrorMessage = (statusCode) => {
  const statusMessages = {
    400: 'Bad Request', 
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',           
    500: 'Internal Server Error'
  }
  return statusMessages[statusCode] || 'Unknown Error'
}

