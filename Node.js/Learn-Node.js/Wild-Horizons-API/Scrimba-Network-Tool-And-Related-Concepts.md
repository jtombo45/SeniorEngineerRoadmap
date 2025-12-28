Scrimba Network Tool and Related Concepts
- client and server
    - client: client is the part of a web app that user interact with directly
        - Browser
        - Mobile App
        - Smart Watch
    - server: server is a remote machine which handles data and sends back information (e.g: html/css) or content to the client in response to requests
- Visual
            request
    Client --------> Server
            response
           <--------
- REST (Representation State Transfer (REST):
    - REST API: allows a client to talk to a server to get access (and possible edit or add to) some data stored remotely.
        - ex:
            - Weather data
            - Currency exchange rates
            - Stock prices
- Controlling communication between client and server
    - Browser's dev tools Network Tab
    - CURL (Terminal)
    - VS Code extensions
    - Postman
    - Scrimba's Network Tool
        - click the left tab and right click and select Network
            - 
- Structure of a URL
    - ex: https://blob.bytebytego.com:8080/subscribe?utm_source=menu#nowhere
        - protocol: https://
        - domain name: blob.bytebytego.com
        - port: :8080
        - path: /subscribe
        - query: ?
        - parameters: utm_source=menu
        - fragments: #nowhere

- Endpoint is a specific url in an api that represents a resource or actions
    - ex: https://localhost:3000/api/js/libraries -> api/js/libraries

- Scrimba Network Tool
    - Specify URL & Endpoint
        - ex: https://localhost:3000/api/js/libraries
    - Specify Method
        - ex:
            - GET: get some data from the backend
            - POST: create and send new data to the backend
            - DELETE: delete some data
            - PUT: update existing data from the backend
            - PATCH: apply partial updates existing data from the backend
    - Click Send
    - Look at Response tab
    - Look at Headers to see status
- Response Codes
    - 200 -> OK
    - 400 -> Bad Request
    - 404 -> Not Found
    - 500 -> Server Error
- Content Types: data response type
    - applicaition/json
    - text/html
    - text/css
    - application/javascript
    - application/xml
    - + many more (e.g like video format, etc)
- Note: 
    Any data that is being sent or received needs to be parsed.

    Specifying the content type helps client and server do that.

    Failure to do that could cause bugs.



