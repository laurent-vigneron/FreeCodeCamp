# API Project - Project #3 - URL Shortener Microservice

## Introduction

To complete this project, I've used the Mongoose library (Schema-based JS library for MongoDB) to access a MongoDB cluster created on MongoDB Atlas.
I could have used the MongoDB JS library directly, and this is what I will do in a future project. But since Mongoose is widely used and was recommended for this project, here we are.

---
## Technologies
* NodeJS
* Express
* Mongoose
---
## See it in action

[Check on Repl.it](https://GranularSnarlingNumericalanalysis--five-nine.repl.co)

---
### User stories:
1. I can POST a URL to `[project_url]/api/shorturl/new` and I will receive a shortened URL in the JSON response. Example : `{"original_url":"www.google.com","short_url":1}`
2. If I pass an invalid URL that doesn't follow the valid `http(s)://www.example.com(/more/routes)` format, the JSON response will contain an error like `{"error":"invalid URL"}`. *HINT*: to be sure that the submitted url points to a valid site you can use the function `dns.lookup(host, cb)` from the `dns` core module.
3. When I visit the shortened URL, it will redirect me to my original link.

#### Creation Example:

POST [project_url]/api/shorturl/new - body (urlencoded) :  url=https://www.google.com

#### Usage:

[this_project_url]/api/shorturl/3

#### Will redirect to:

https://www.freecodecamp.org/forum/
