🌍 Simple Node.js API — Beginner-Friendly Guide (With Real Server Code Concepts)

This project is a small Node.js server built with the native http module—no frameworks, no libraries. It’s perfect for beginners learning how APIs work under the hood, and still clean enough for developers who want to understand low-level fundamentals.

⸻

🚀 What This API Does

Users can retrieve travel destination data in three ways:

1. Get ALL data

GET /api

2. Filter by path parameter

GET /api/continent/india

3. Filter using query parameters

GET /api?country=turkey&is_open_to_public=true

All responses are returned as JSON.

⸻

🧠 What You Will Learn

This project teaches the real fundamentals beneath Express.js and other frameworks:

✔ Core http Module
	•	creating a server
	•	handling requests & writing responses
	•	sending status codes (200, 404, 500, etc.)
	•	setting headers (Content-Type)
	•	writing JSON
	•	routing based on req.url
	•	filtering data
	•	extracting path parameters
	•	extracting query parameters (URLSearchParams)

✔ Understanding Client–Server

You’ll see how a client (browser, phone app, smartwatch, etc.) sends a request, and the server returns a response.

Client  ----request---->  Server
Client  <---response----  Server

✔ REST API Basics

REST is a style of designing APIs.
Examples:

/api/courses
/api/topics
/api?topic=node&price=free


⸻

📦 Understanding package.json (For Absolute Beginners)

Think of package.json like a project’s blueprint:
	•	Project metadata (name, version, author, description)
	•	Dependency management
	•	Scripts (like npm start)
	•	Makes collaboration easy

You can create it:

npm init

or manually.

⸻

🔧 How the HTTP Module Works (Beginner-Friendly Explanation)

Think of your Node server like a tiny restaurant:
	•	Browser → customer
	•	Request → customer order
	•	Response → the food
	•	HTTP module → the kitchen that lets you cook and serve

Minimal Example

import http from "node:http";

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "Hello from a Node server!" }));
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});


⸻

🧩 The Request–Response Cycle

🔹 Request

Contains:
	•	method (GET, POST, etc.)
	•	URL (/api, /api/continent/europe)
	•	headers
	•	query parameters
	•	path parameters

🔹 Server Handles the Request
	•	filters data
	•	validates data
	•	builds a response
	•	sends errors if needed

🔹 Response
	•	JSON, HTML, images, etc.
	•	includes headers (Content-Type)
	•	includes status codes (200 = OK, 404 = Not Found)

⸻

📡 API Routes Explained (Matches Your server.js)

1. GET /api

Returns all destination data.

⸻

2. GET /api/continent/:continent

Path parameter example:

/api/continent/asia
/api/continent/europe

Server extracts the continent:

const continent = req.url.split("/").pop();
console.log("Requested continent:", continent);

Filters the data:

const filtered = destinations.filter((destination) => {
  return destination.continent.toLowerCase() === continent.toLowerCase();
});


⸻

3. GET /api?country=turkey&is_open_to_public=true

Uses query params via:

const url = new URL(req.url, `http://${req.headers.host}`);
const params = url.searchParams;


⸻

🧰 Error Handling (Actual Code from Your Server)

handleResponse(res, {
  statusCode: 404,
  isError: true,
  message: "The requested route does not exist"
});

Return example:

{
  "error": "Not Found",
  "message": "The requested route does not exist"
}


⸻

🛠 Helper Function (Matches Your Code)

Your handleResponse() normalizes all responses:

function handleResponse(
  res,
  {
    statusCode = 200,
    data = null,
    contentType = "application/json",
    isError = false,
    message = ""
  }
) {
  res.setHeader("Content-Type", contentType);
  res.statusCode = statusCode;

  if (isError) {
    res.end(JSON.stringify({
      error: statusCodeToErrorMessage(statusCode),
      message
    }));
  } else {
    res.end(JSON.stringify(data));
  }
}

This makes your server cleaner and avoids repetitive .setHeader, .statusCode, .end.

⸻

🧭 How to Read Node.js Documentation (Beginner Guide)

Reading docs is a skill — here’s a simple system.

⸻

✔ Step 1: Start With the Overview

Go to:
https://nodejs.org/api/http.html

Scroll to the top summary — don’t start with the giant walls of text.

⸻

✔ Step 2: Focus on These Sections

Beginner-friendly order:
	1.	http.createServer
	2.	IncomingMessage (req)
	3.	ServerResponse (res)
	4.	Events (request, error, etc.)

⸻

✔ Step 3: Look for Examples FIRST

Node docs always include examples above the deep details.
They look like this:

const server = http.createServer((req, res) => {});

Copy these before reading heavy explanations.

⸻

✔ Step 4: Use MDN for Definitions

When you don’t know a term:
	•	“What is a MIME type?” → MDN
	•	“What’s the difference between GET and POST?” → MDN
	•	“What does writeHead do?” → MDN

MDN is MUCH easier for beginners.

⸻

✔ Step 5: Apply What You Read

If the docs say:

res.setHeader(name, value)

Try it immediately:

res.setHeader("Content-Type", "application/json");

Learning by applying beats reading 100% of the time.

⸻

🧪 How to Run and Test the API

1. Start the server

cd <your-folder>
node server.js

2. Make requests

✔ Using curl

curl http://localhost:8000/api
curl http://localhost:8000/api/continent/asia
curl "http://localhost:8000/api?country=turkey"

✔ Using Postman
	•	Create GET request
	•	Paste URL
	•	Send

✔ Using Browser
Just type:

http://localhost:8000/api


⸻

🧳 Path Parameters Example (Matches Your Code)

else if (req.url.startsWith('/api/continent/') && req.method === 'GET') {
  const continent = req.url.split('/').pop();
  console.log(continent);

  const filtered = destinations.filter(destination =>
    destination.continent.toLowerCase() === continent.toLowerCase()
  );

  handleResponse(res, { statusCode: 200, data: filtered });
}

⸻

🧳 Util Query Parameters Update
export const getDataByQueryParams = (data, queryObj) => {

  const { continent, country, is_open_to_public } = queryObj

  if (continent) {
    data = data.filter(destination =>
      destination.continent.toLowerCase() === continent.toLowerCase()
    )
  }
  .
  .
  .
  return data
} 

⸻

🎓 Final Notes

By building this project, you’ve learned:
	•	how HTTP works at a fundamental level
	•	how to route requests manually
	•	how to serialize JSON
	•	how to extract path + query params
	•	how to filter data
	•	how to structure cleaner response helpers
	•	how to read Node.js docs effectively

This is solid foundational knowledge that makes learning Express, Fastify, or even backend frameworks in other languages MUCH easier.


