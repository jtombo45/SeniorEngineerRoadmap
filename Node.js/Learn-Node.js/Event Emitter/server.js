import http from 'node:http'
import { handleFiles } from './handleFiles.js'
import { getTemp } from './getTemp.js'

const __dirname = import.meta.dirname

const server = http.createServer(async (req, res) => {

    // Handle file requests (other than /temp/live)
  if (!req.url.startsWith('/temp/live')) {
    return await handleFiles(req, res, __dirname)
  } 
  // Handle live temperature updates
  else if (req.url === '/temp/live') {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
   
    // Call getTemp immediately every 2 seconds and send temperature updates
    const temperature = getTemp()
    res.write(
      `data: ${JSON.stringify({ event: 'temp-updated', temp: temperature})}\n\n`
    )

    setInterval( () => {

      const temperature = getTemp()
      res.write(
        `data: ${JSON.stringify({ event: 'temp-updated', temp: temperature})}\n\n`
      )

    }, 2000)
  }

})

server.listen(8000, () => console.log('listening 8000'))
