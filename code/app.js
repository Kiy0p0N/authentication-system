import express from "express";
import bodyParser from "body-parser";
import pg from 'pg';
import bcrypt from 'bcrypt';
import session from 'express-session';
import passport from 'passport';
import { Strategy } from 'passport-local';
import env from 'dotenv';

const app = express();
const port = 3000;
const salt = 10;
env.config(); // Load environment variables from .env file

// Database connection setup
const db = new pg.Client({
  user: process.env.DB_USER, // Database username
  database: process.env.DB_DATABASE, // Database name
  host: process.env.DB_HOST, // Database host address
  password: process.env.DB_PASSWORD, // Database password
  port: process.env.DB_PORT, // Database port
});

try {
  db.connect(); // Attempt to connect to the database
  console.log("Connected to database");
} catch (error) {
  console.error('Database connection error: ', error);
}

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true })); // Parses URL-encoded data from forms
app.use(express.static("public")); // Serves static files from the "public" folder

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Secret key for session encryption
    resave: false, // Prevents resaving session if nothing changed
    saveUninitialized: true, // Saves uninitialized sessions
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // Session expires after 24 hours
    }
  })
);

app.use(passport.initialize()); // Initializes Passport authentication middleware
app.use(passport.session()); // Enables persistent login sessions

// Route handlers
app.get("/", (req, res) => {
  res.render("home.ejs"); // Renders the home page
});

app.get("/login", (req, res) => {
  res.render("login.ejs"); // Renders the login page
});

app.get("/register", (req, res) => {
  res.render("register.ejs"); // Renders the registration page
});

app.get("/secrets", (req, res) => {
  console.log(req.user);

  if (req.isAuthenticated()) { // Checks if user is logged in
    res.render("secrets.ejs"); // Renders the secrets page
  } else {
    res.redirect("/login"); // Redirects to login page if not authenticated
  }
});

// Handle user registration
app.post("/register", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  try {
    // Check if user already exists in the database
    const checkUser = await db.query("SELECT email FROM users WHERE email = $1", [email]);

    if (checkUser.rows[0]) {
      console.log("Email already exists. Try logging in.");
      res.redirect("/login");
    } else {
      // Hash the password before storing it in the database
      bcrypt.hash(password, salt, async (err, hash) => {
        if (err) {
          console.log("Error hashing password: ", err);
          res.redirect("/register");
        } else {
          try {
            // Store new user in the database
            const result = await db.query("INSERT INTO users(email, password) VALUES ($1, $2) RETURNING *", [email, hash]);
            const user = result.rows[0];
            
            req.login(user, (err) => { // Logs in the new user automatically after registration
              console.log(err);
              res.redirect("/secrets");
            });
          } catch (error) {
            console.log("Error registering user: ", error);
            res.status(500);
          }
        }
      });
    }
  } catch (error) {
    console.error("Database query error: ", error);
    res.status(500);
  }
});

// Handle user login using Passport authentication
app.post("/login", passport.authenticate("local", {
  successRedirect: "/secrets", // Redirects to secrets page if login is successful
  failureRedirect: "/login", // Redirects to login page if authentication fails
}));

// Configure Passport authentication strategy
passport.use(new Strategy(async function verify(username, password, cb) {
  try {
    // Fetch user from database by email
    const response = await db.query("SELECT * FROM users WHERE email = $1", [username]);

    if (response.rows[0]) {
      const user = response.rows[0];
      const storedHashPassword = user.password;

      // Compare the provided password with the stored hash
      bcrypt.compare(password, storedHashPassword, (err, result) => {
        if (err) {
          console.log("Error comparing passwords: ", err);
          return cb(err);
        } else {
          if (result) {
            return cb(null, user); // Authentication successful
          } else {
            console.log("Incorrect password");
            return cb(null, false); // Incorrect password
          }
        }
      });
    } else {
      console.log("User not found");
      return cb("User not found");
    }
  } catch (error) {
    console.error("Database query error: ", error);
    return cb(error);
  }
}));

// Serialize user information to store in session
passport.serializeUser((user, cb) => {
  cb(null, user);
});

// Deserialize user information when retrieving from session
passport.deserializeUser((user, cb) => {
  cb(null, user);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`); // Logs server start message
});