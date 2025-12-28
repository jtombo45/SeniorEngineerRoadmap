import path from 'node:path'
import fs from 'node:fs/promises'
import { sendResponse } from './sendResponse.js'
import { getContentType } from './getContentType.js'

export async function serveStatic(req, res, baseDir) {
  /*
Challenge: 
  1. Write code below to serve files from our public directory.
     
     Don’t worry about handling errors for now.
     hint.md for help!
*/
  try { 

   // 1. Decide which file to serve
  let filePath = path.join(baseDir, 'public', req.url === '/' ? 'index.html' : req.url) // change index.html to index2.html to trigger 404

   // 2. Read the file content
    const content = await fs.readFile(filePath)
    //doesNotExistFunctionCall() // to trigger 500 error

    // 3. Figure out the MIME type (content type)
    const ext = path.extname(filePath)
    const contentType = getContentType(ext)

    // 4. Send the result
    sendResponse(res, 200, contentType, content)

  } catch (err) {
    // 5. If error code is ENOENT -> send 404.html
    if(err.code === 'ENOENT') {
      // Read 404.html
      const notFoundPath = path.join(baseDir, 'public', '404.html')
      const notFoundContent = await fs.readFile(notFoundPath)

      // Get content type for 404.html
      const ext = path.extname(notFoundPath)
      const contentType = getContentType(ext)

      // Send 404 response
      sendResponse(res, 404, contentType, notFoundContent)
    }
    else{
      sendResponse(res, 500, 'text/html', `<html><h1>Server Error: ${err.code}</h1></html>`)
    }

    
  }

}
