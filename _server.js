import express from "express";
import { verify, sign } from "jsonwebtoken";
import cors from "cors";
import { json } from "body-parser";
import { writeFile, readFileSync } from "fs";
import events from "./db/events.json";

const app = express();

app.use(cors());
app.use(json());

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the API.",
  });
});

app.get("/dashboard", verifyToken, (req, res) => {
  verify(req.token, "the_secret_key", (err) => {
    if (err) {
      res.sendStatus(401);
    } else {
      res.json({
        events: events,
      });
    }
  });
});

app.post("/register", (req, res) => {
  var errorsToSend = []; // array to collect errors

  if (dbUserEmail === user.email) {
    // check to see if email already exists in db
    errorsToSend.push("An account with this email already exists.");
  }
  if (user.password.length < 5) {
    // validate password is in correct format
    errorsToSend.push("Password too short.");
  }
  if (errorsToSend.length > 0) {
    // check if there are any errors
    res.status(401).json({ errors: errorsToSend }); // send errors back with status code
  } else {
    if (req.body) {
      const user = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        // You'll want to encrypt the password in a live app
      };
      4;
      var data = JSON.stringify(user, null, 2);

      writeFile("db/user.json", data, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Added user to user.json");
        }
      });
      // The secret key should be an evironment variable in a live app
      const token = sign({ user }, "the_secret_key");
      res.json({
        token,
        email: user.email,
        name: user.name,
      });
    } else {
      res.sendStatus(401);
    }
  }
});

app.post("/login", (req, res) => {
  var userDB = readFileSync("./db/user.json");
  var userInfo = JSON.parse(userDB);
  if (
    req.body &&
    req.body.email === userInfo.email &&
    req.body.password === userInfo.password
  ) {
    // The secret key should be an environment variable in a live app
    const token = sign({ userInfo }, "the_secret_key");
    res.json({
      token,
      email: userInfo.email,
      name: userInfo.name,
    });
  } else {
    res.sendStatus(401);
  }
});

function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(401);
  }
}

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
