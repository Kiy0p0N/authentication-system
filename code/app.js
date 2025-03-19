import express from "express";
import bodyParser from "body-parser";
import pg from 'pg';
import bcrypt from 'bcrypt';

const app = express();
const port = 3000;
const salt = 10;

// Database connection setup
const db = new pg.Client({
  user: 'postgres',
  database: 'secrets',
  host: 'localhost',
  password: 'hades',
  port: '5432'
});

try {
  db.connect();
  console.log("Connected to database");
} catch (error) {
  console.error('Database connection error: ', error);
}

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Route handlers
app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

// Handle user registration
app.post("/register", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  try {
    // Check if user already exists
    const checkUser = await db.query("SELECT email FROM users WHERE email = $1", [email]);

    if (checkUser.rows[0]) {
      console.log("Email already exists. Try logging in.");
      res.redirect("/login");
    } else {
      // Hash the password before storing it
      bcrypt.hash(password, salt, async (err, hash) => {
        if (err) {
          console.log("Error hashing password: ", err);
          res.redirect("/register");
        } else {
          try {
            await db.query("INSERT INTO users(email, password) VALUES ($1, $2)", [email, hash]);
            res.redirect("/");
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

// Handle user login
app.post("/login", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  try {
    // Fetch user from database
    const response = await db.query("SELECT * FROM users WHERE email = $1", [email]);

    if (response.rows[0]) {
      const storedHashPassword = response.rows[0].password;

      // Compare provided password with stored hash
      bcrypt.compare(password, storedHashPassword, (err, result) => {
        if (result) {
          console.log("Successful login");
          res.render("secrets.ejs");
        } else {
          console.log("Password mismatch: ", err);
          res.redirect("/login");
        }
      });
    } else {
      console.log("No user found");
      res.redirect("/login");
    }
  } catch (error) {
    console.error("Database query error: ", error);
    res.status(500);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});