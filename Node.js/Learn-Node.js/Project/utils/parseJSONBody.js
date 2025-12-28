/*
Challenge 1:
  1. Create a function parseJSONBody which:
    - gathers the incoming chunks into a string 'body'.
    - parses 'body'
    - returns 'body'
    - throws an error if 'body' can't be parsed:
        `Invalid JSON format: ${err}`
*/

/*
Challenge 1:
  1. Create a function parseJSONBody which:
    - gathers the incoming chunks into a string 'body'.
    - parses 'body'
    - returns 'body'
    - throws an error if 'body' can't be parsed:
        `Invalid JSON format: ${err}`
*/

export async function parseJSONBody(req) {

  let body = ''

  for await (const chunk of req) {
    body += chunk
  }

  try {
    return JSON.parse(body)
  } catch (err) {
    throw new Error(`Invalid JSON format: ${err}`)
  }

}

// More manual way of parsing JSON body, old way before async iterators. Promise are like Task in C# (pending, fulfilled, rejected -> then, catch)
// JS added async/await syntax later to make working with Promises easier by abrasting the asynchronous code to look synchronous.
/*
export async function parseJSONBody(req) {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', chunk => {
      body += chunk.toString()
    })

    req.on('end', () => {
      try {
        const parsedBody = JSON.parse(body)
        resolve(parsedBody)
      } catch (err) {
        reject(new Error(`Invalid JSON format: ${err.message}`))
      }
    })  
  })
}*/