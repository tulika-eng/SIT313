
// This loads the variables from our .env file
// We use this for things like the SendGrid API key
require("dotenv").config();


// Importing Express so we can create our server
const express = require("express");


// This package lets us send emails using SendGrid
const sgMail = require("@sendgrid/mail");


// Used for working with file paths
const path = require("path");


// Creating our Express app
const app = express();


// Port where our server will run
// If PORT is not in .env, it will use 3000
const PORT = process.env.PORT || 3000;


// Set up SendGrid using the API key from .env
// We don't put the actual API key directly in the code
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


// Middleware

// This allows the server to read JSON data
// sent from the frontend
app.use(express.json());


// This allows us to read data submitted through forms
app.use(express.urlencoded({ extended: true }));


// Enable CORS so the React frontend can make HTTP requests to the backend
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    next();
});


// This array stores the emails of people who subscribe
// It only lasts while the server is running
const subscribers = [];


// API Root / Health Check
// The React frontend is served independently by Vite (http://localhost:5173).
// The Express backend serves API endpoints such as POST /subscribe.
app.get("/", (req, res) => {
    res.status(200).json({
        message: "DEV@Deakin Backend API is running.",
        status: "healthy",
        endpoints: {
            subscribe: "POST /subscribe"
        }
    });
});


// Subscribe endpoint

// This is called when someone submits their email
// from the newsletter subscription form
app.post("/subscribe", async (req, res) => {

    try {

        // Safely extract and trim email string
        const email = req.body && typeof req.body.email === "string" ? req.body.email.trim() : null;


        // Check if the user actually entered an email
        if (!email) {

            return res.status(400).json({
                success: false,
                message: "Email address is required."
            });
        }


        // Validate email format using standard RFC-compatible pattern
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {

            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address."
            });
        }


        // Convert the email to lowercase
        // This makes it easier to compare emails later
        // For example Test@gmail.com becomes test@gmail.com
        const normalisedEmail = email.toLowerCase();


        // Check if this email has already subscribed
        if (subscribers.includes(normalisedEmail)) {

            return res.status(409).json({
                success: false,
                message: "This email is already subscribed."
            });
        }


        // Creating the welcome email we want to send
        const message = {

            // Email address of the person who subscribed
            to: normalisedEmail,

            // The email address we are sending the email from
            // This is stored in the .env file
            from: process.env.SENDGRID_FROM_EMAIL,

            // Subject of the welcome email
            subject: "Welcome to DEV@Deakin!",

            // Message that the subscriber will receive
            text: "Welcome to DEV@Deakin! Thank you for subscribing to our newsletter. You will now receive updates, news and information from DEV@Deakin. Happy learning!"
        };


        // Send the email through SendGrid
        // await waits for SendGrid to respond
        const response = await sgMail.send(message);


        // Show the genuine Email API response in the terminal
        console.log("SendGrid Status Code:", response[0].statusCode);
        console.log("Email API Response Status:", response[0].statusCode);
        console.log("[POST /subscribe] Status: 200 OK - Email successfully sent to", normalisedEmail);


        // Add the email to our subscribers list
        // We only do this after the email was successfully sent
        subscribers.push(normalisedEmail);


        // Show the new subscriber in the terminal
        console.log("New subscriber:", normalisedEmail);


        // Show how many people have subscribed so far
        console.log("Total subscribers:", subscribers.length);


        // Tell the frontend that everything worked
        return res.status(200).json({
            success: true,
            message: "Successfully subscribed! A welcome email has been sent."
        });


    } catch (error) {

        // If something goes wrong, we come here
        // This is mainly used for SendGrid or server errors
        console.error("Email sending error:");


        // SendGrid can give us extra information about the error
        if (error.response) {

            console.error(error.response.body);

        } else {

            // If SendGrid didn't give a response,
            // just show the normal error message
            console.error(error.message);
        }


        // Tell the frontend that something went wrong
        return res.status(500).json({
            success: false,
            message: "Subscription failed. Please try again later."

        });
    }
}

);


// Start server

// Starts our server and listens on the selected port
app.listen(PORT, () => {

    // This message appears in the terminal
    // when the server starts successfully
    console.log("Server running at http://localhost:" + PORT);
});

