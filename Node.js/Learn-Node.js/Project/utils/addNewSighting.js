import { getData } from './getData.js'
import fs from 'node:fs/promises'
import path from 'node:path'
import { sortObjectKeysRecursively } from './sortObjectKeysRecursively.js'
import crypto from 'node:crypto'

export async function addNewSighting(newSighting) {

  try {
/*
    1. Get the existing data (remember, this will already be a JS array)
    2. Push the new sighting to it (we parsed it to a JS object in the last scrim)
    3. Write data to the file.
    4. Add the new sighting and check out the 'read' page.
    5. Throw an error (in the catch block) if any of 1-3 above fail.
    
    To write data:
    Import fs/promises
    Use the writeFile method with the following:
      - the relative path to the file 
      - The data (what should we do to this data first?)
      - The encoding 'utf8'
    
    Bonus: figure out how to prettify the JSON!
*/
    // Assign a unique UUID to the new sighting
    newSighting.uuid = crypto.randomUUID()

    // Logging for debugging purposes
    console.log(typeof newSighting)
    console.log('New sighting:', newSighting)

    // Get existing sightings, add the new one, and write back to file
    const sightings = await getData()
    sightings.push(newSighting)

    // Write updated sightings back to the JSON file
    const dataPath = path.join('data', 'data.json')
    // await fs.writeFile(dataPath, JSON.stringify(await sortObjectKeysRecursively(data), null, 2), 'utf-8')
    await fs.writeFile(dataPath, JSON.stringify(await sightings, null, 2), 'utf-8') // Prettify with 2 spaces indentation
    
  } catch (err) {
    throw new Error('Error adding new sighting: ' + err.message)
  }

}
