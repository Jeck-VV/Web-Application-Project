// imports
import express from "express";
import morgan from "morgan";
import { check, validationResult } from "express-validator";

import passport from 'passport';
import LocalStrategy from 'passport-local';
import session from 'express-session';

import cors from "cors";
import { getStazioni, getUser, getTratte, getLinee, getClassifica, submitPartita, getPartitaStart } from "./dao.js";

const app = express();
const port = 3001;

const corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200,
  exposedHeaders: ["WWW-Authenticate"],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan("dev"));

app.use(session({
  secret: "shhhhh... it's a secret!",
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.authenticate("session"));

passport.use(new LocalStrategy(async function verify(username, password, cb) {
  const user = await getUser(username, password);
  if (!user) {
    return cb(null, false, "Incorrect username or password.");
  }
  return cb(null, user);
}));

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (user, cb) {
  return cb(null, user);
});

// Middleware di protezione rotte
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: "Not authorized" });
}

// Middleware validazione richieste
const validationRes = (req, res, next) =>{
  const errors = validationResult(req)
  if (errors.isEmpty()){
    return next();
  }
  return res.status(422).json({ errors: errors.array() });
}

app.listen(port, () => {
  console.log(`API server started at http://localhost:${port}`);
});


/* ROUTES */

// POST /api/sessions (Login)
app.post("/api/sessions",
  check('username').notEmpty().isString().withMessage('username è obbligatorio'),
  check('password').notEmpty().isString().withMessage('password è obbligatoria'),
  validationRes,
  passport.authenticate("local"),
  function (req, res) {
    return res.status(201).json(req.user);
  }
);

// GET /api/sessions/current (Verifica stato login)
app.get("/api/sessions/current", isLoggedIn, (req, res) => {
  res.json(req.user);
});

// DELETE /api/sessions/current (Logout)
app.delete("/api/sessions/current", (req, res) => {
  req.logout((err) => {
    if (err) { return res.status(500).json({ error: "Logout failed" }); }
    res.end();
  });
});

// GET /api/stazioni (Lista stazioni)
app.get("/api/stazioni", isLoggedIn, async (req, res) => {
  try {
    const stazioni = await getStazioni();
    res.json(stazioni);
  }
  catch (err) {
    res.status(500).json({ error: err });
  }
});

// GET /api/tratte (Lista tratte)
app.get("/api/tratte", isLoggedIn, async (req, res) => {
  try {
    const tratte = await getTratte();
    res.json(tratte);
  }
  catch (err) {
    res.status(500).json({ error: err });
  }
});

// GET /api/linee (Lista linee)
app.get("/api/linee", isLoggedIn, async (req, res) => {
  try {
    const linee = await getLinee();
    res.json(linee);
  }
  catch (err) {
    res.status(500).json({ error: err });
  }
});

// GET /api/leaderboard (leaderboard)
app.get("/api/leaderboard", isLoggedIn, async (req, res) => {
  try {
    const classifica = await getClassifica();
    res.json(classifica);
  }
  catch (err) {
    res.status(500).json({ error: err });
  }
});

// POST /api/partita
app.post("/api/partita", isLoggedIn,
  check('path').isArray().withMessage('path deve essere un array di tid'),
  check('path.*').isInt().withMessage('ogni elemento di path deve essere un intero'),
  check('startStation').isInt().withMessage('startStation deve essere un intero'),
  check('endStation').isInt().withMessage('endStation deve essere un intero'),
  validationRes,
  async (req, res) => {
    try {
      const { path, startStation, endStation } = req.body;
      const result = await submitPartita(
        req.user.id,
        path,
        parseInt(startStation),
        parseInt(endStation)
      );
      res.json(result);
    }
    catch (err) {
      res.status(500).json({ error: err });
    }
});

// GET /api/partita/start 
app.get("/api/partita/start", isLoggedIn, async (req, res) => {
  try {
    const start = await getPartitaStart();
    res.json(start);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

