// handleGet
/*
Challenge:
1. Export a function called handleGet(). 
2. It should:
   - use getData() to get the data
   - stringify that data
   - use sendResponse() to serve it
   
Open the browser and load the sightings page to see if it works.
*/
import { getData } from '../utils/getData.js'
import { sendResponse } from '../utils/sendResponse.js'
import { parseJSONBody } from '../utils/parseJSONBody.js'
import { addNewSighting } from '../utils/addNewSighting.js'
import { sanitizeInput } from '../utils/sanitizeInput.js' 

export async function handleGet(res) {
  const data = await getData()
  const content = JSON.stringify(data)
  console.log('Data to be sent:', content)
  return sendResponse(res, 200, 'application/json', content)
}
// handlePost

// parseJSONBody() will collect and parse the incoming JSON
// santizeData() 
// addNewSighting() will do the donkey work of adding the data to our dataset
// sendResponse()

/*
Challenge:
  1. Create and export a function called handlePost().
  2. For now, that function can just log 'POST request received'.
Challenge 2:
  1. Create a const 'rawBody' to store whatever is returned by parseJSONBody()
  2. For now, log 'rawBody'.
  3. Input an entry on the front end to test.
*/
/*
Challenge:
  1. Replace ??? with the correct status code!
*/
export async function handlePost(req, res) {
    try{
        // Log the receipt of the POST request
        console.log('POST request received')

        // Parse the JSON body
        const parsedBody = await parseJSONBody(req)

        // Sanitize inputs
        const sanitizedBody = sanitizeInput(parsedBody)
        /* old way: too repetitive
        parsedBody.location = sanitizeHtml(parsedBody.location, {allowedTags: ['b']}) // Allow <b> tags only]})
        parsedBody.title = sanitizeHtml(parsedBody.title, {allowedTags: ['b']}) // Allow <b> tags only]})  
        parsedBody.text = sanitizeHtml(parsedBody.text, {allowedTags: ['b']}) // Allow <b> tags only]})
        */

        // Log the sanitized parsed body
        console.log('Parsed Body:', sanitizedBody);

        // Now add the new sighting
        await addNewSighting(sanitizedBody)

        // 201 is used for successful resource creation
        sendResponse(res, 201, 'application/json', JSON.stringify({ message: 'Data received', data: sanitizedBody }));
    }
    catch(err){
        console.error('Error handling POST request:', err);
        sendResponse(res, 400, 'application/json', JSON.stringify({ error: 'Internal Server Error' }));
    }
  
}

// handlePut
// handleDelete
