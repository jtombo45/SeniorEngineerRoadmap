import http from 'node:http'
import { serveStatic } from './utils/serveStatic.js'
import { getData } from './utils/getData.js'
import { handleGet } from './handlers/routeHandlers.js'
import { handlePost } from './handlers/routeHandlers.js'
import { sendResponse } from './utils/sendResponse.js'

// 1. Port used by the server
const PORT = 8000

// 2. Get current directory of the this file (like __dirname in CommonJS)
const __dirname = import.meta.dirname 

// Test getData()
// console.log('Data from getData():', await getData(__dirname))

// 3. Create the HTTP server
const server = http.createServer(async (req, res) => {
    console.log(`Received ${req.method} request for: ${req.url}`)
    if (req.url === '/api') {
        if(req.method === 'GET') {
            return await handleGet(res)
        }
        /*
            Challenge: 
            1. Add a route for a POST request to '/api'.
            2. When a request comes in, pass the req and res to handlePost().
        */
        else if (req.method === 'POST') {
            return await handlePost(req, res)
        }
    }
    else if(!req.url.startsWith('/api')) {
        // For *every* request, delegate to serveStatic()
        return await serveStatic(req, res, __dirname)
    }
    else{
        return await sendResponse(res, 404, 'application/json', JSON.stringify({
            error: "not found",
            message: "The requested route does not exist"
        })) 
    }
    
})

// 4. Start listening
server.listen(PORT, () => console.log(`connected on port ${PORT}`))