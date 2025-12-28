import fs from 'node:fs/promises'
import path from 'node:path'

export async function handleFiles(req, res, dir) {
  try {
    // Determine the file to serve based on the request URL
    const fileName = req.url === '/' ? 'index.html' : 'index.js'
    const filePath = path.join(dir, 'public', fileName)

    // Read the file content
    const content = await fs.readFile(filePath, "utf-8")
    const contentType = req.url === '/' ? 'text/html' : 'text/javascript'

    // Send the file content as the response
    res.setHeader('Content-Type', contentType)
    res.end(content)
  } catch (error) {
    res.statusCode = 500
    res.end("Error loading the file")
    console.error(error)
  }
}
