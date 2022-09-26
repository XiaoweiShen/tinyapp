# TinyApp Project

an HTTP Server that handles requests from the browser (client). Along the way get introduced to some more 

advanced JavaScript and Node concepts, and also learn more about Express.

## Final Product

!["Screenshot of registration/login page"](https://github.com/XiaoweiShen/tinyapp/blob/master/views/4.jpg)

!["Screenshot of urls page"](https://github.com/XiaoweiShen/tinyapp/blob/master/views/1.jpg)

!["Screenshot of update url page"](https://github.com/XiaoweiShen/tinyapp/blob/master/views/3.jpg)

## Dependencies

- Node.js
- Morgan(for debug)
- Express
- EJS
- bcrypt
- body-parser
- cookie-session
- cookie-parser


## Getting Started

1) Install all dependencies (using the `npm install` command).
2) Run the development web server using the `npm start` command.
3) Go to `localhost:8080` on your browser, enjoy!

## How To Use TinyApp

- GET /
- GET /urls
- GET /urls/new
- GET /urls/:id
- GET /u/:idbcrypt
- POST /urls
- POST /urls/:id
- GET /login
- GET /register
- POST /login
- POST /register
- POST /logout

#### Register/Login
Users must be logged in to create new links, view them, and edit them.

Just click Register on right top, lead to register/login page, put in your email and password, and you're good to go.

#### Create New Links

Create New URL on navigation bar.

Then simply enter the long URL you want to shorten,short URL will generate automatically.

#### Edit or Delete Short Links

In My URLs, you can delete any link you want.

You can also click Edit, and then enter a new long URL to update your link. It will be the same short URL, but redirect to an updated long URL.

