

Initialize project
- npm init
```
```


Start project
- node.js server

Challenge 1
```
/*
Challenge: 
1. Initialise a nodejs project:
	Name: “from-the-other-side”.
    Description: “A platform for sharing ghostly encounters”.

2. Enable modular js (in package.json).

hint.md for help
*/
```
Hint
```
In terminal:
  npm init

In package.json: 
  "type": "module"
```

What's the difference - res.writeHead() vs res.setHeader()
- res.setHeader()
    - Sets a response header but doesn't send it immediately.
    - Allows you to set or modify headers individually, at any point before sending the response
- res.writeHead()
    - Sends any headers immediately
    - No fruther modification is possible.

Potential problems
- A header set using setHeader after writeHead() will not be included in the response.
- A header set using setHeader() can be overruled by a header set with writeHead().
You'll get unexpected behavior
```
import http from 'node:http'

const PORT = 8000

const server = http.createServer((req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET')
    res.writeHead(200, {'Content-Type': 'text/html', 'Access-Control-Allow-Methods': 'POST'})
    res.end('<html><h1>The server is working!!!</h1></html>')

})

server.listen(PORT, ()=> console.log(`Connected on port: ${PORT}`))
```

Readin and serving data Checklist
- Identify what resources the client wants.
- Indentify the path to that resource:
    - The current modul's directory.
    - The path to the resource from that directory.
- Read the resources we want to serve using FS module.
- Send thos resources to the client.

Paths -> We need OS agnostic solution
- Scrimba: /home/projects/s.../public/index.html
- Mac: /Users/thomas/docs/projects/s.../public/index.html
- Windows: \Users\thomas\docs\projects\s...\public.index.html

IMPORT.META
- import.meta is an object specific to the modular JS environment, which provides metadata about the current module

Current Working Directory
- is the folder you're in when you run your Node.js app, typicall with a command like: node server.js

Absolute Paths
- Show the full location of a file or folder on the system where your code is running
- Always the same, no matter where you run your main script server.js in our case.
- Independent of the current working directory (CWD)

/users/jane/my-app/public/index.html

Relative Paths
- Relative to the file it appears in.
- Often includes .. (current folder) or .. (up one folder).
- We often see this in import statements,

import { serveStatic } from '.utils/serveStatic.s'

Relative paths created with Path Module:
- Start from the Current Working Directory.
- Are therefore affected by changes to the CWD.
- That means they are not as safe, but sometimes more flexible.

Path Module 
- Join path elements to create one path (absolute or relative) which will work on any supporteed OS.
- Extract file names and extensions.

Path Module
- Join path elements to create one path (absolute or relative) which will work on any supported OS.
- Exract file names and extensions

File Systems (fs) Module uses:
- Read files - .readFile()
- Create files - .writeFile()
- Updates files .appendFile()
- Delete files - .unlink()
- Rename files - .rename()

Asise FS Module
- Make sure to encode the content so the browser can interpet the buffer by setting the content type from the setHeader method
```
import path from 'node:path'
import http from 'node:http'
import fs from 'node:fs/promises'

const PORT = 8000

const __dirname = import.meta.dirname

const server = http.createServer(async (req, res) => {

  const pathToResource = path.join(__dirname, 'public', 'index.html')

  const content = await fs.readFile(pathToResource)
  console.log(content)

  res.statusCode = 200
  res.setHeader('Content-Type', 'text/html')
  res.end(content)

})

server.listen(PORT, () => console.log('connected on port 8000'))
```

Key Differences Summarized:
Feature
CommonJS (CJS)
ES Modules (ESM)
Import/Export
require() / module.exports
import / export
Loading
Synchronous
Asynchronous
Dynamic Imports
require() as function
import() as function
Environment
Node.js (primary)
Browser & Node.js (native)
Tree-shaking
Not natively supported
Supported
Top-level await
Not supported
Supported
Conclusion:
While CommonJS remains relevant for legacy Node.js projects, ES Modules are the modern standard for JavaScript development due to their native browser support, optimization capabilities (like tree-shaking), and standardization within the language. Understanding both systems allows developers to choose the appropriate module system based on project requirements and target environments.

Global vars in node
```
/* commonJS */

// console.log(__dirname)
// console.log(__filename)

/* ES Modules before v20 */

import path from 'node:path'
import url from 'node:url'

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log(__filename)
console.log(__dirname)


/* ES Modules using import.meta v20+ */

// console.log(import.meta.dirname)
// console.log(import.meta.filename)
```

Adding POST functionality
- Collect the incoming data
- Parse it
- Sanitize it
- Get our existing data
- Add the new data to the existing data
- Write the completed data to the JSON file

XSS Attacks
- An XSS (Cross-Site Scripting) attack is a security vulnerability that allows an attacker to inject malicious scripts into web pages
- If user adds malicious javascript wrapped in html we would follow victim to it

Santization
- Santization is removing anything suspiciious from incoming input. In this case, we will be removing any tags from user-uploaded text
- We will use santize-html
  - npm install santize-html



