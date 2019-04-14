require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const POKEDEX = require("./pokedex.json");

console.log(process.env.API_TOKEN);

const app = express();

app.use(helmet());
const morganSetting = process.env.NODE_ENV === "production" ? "tiny" : "common";
app.use(morgan(morganSetting));
app.use(cors());

app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get("Authorization");

  console.log("validate bearer token middleware");

  if (!authToken || apiToken !== authToken.split(" ")[1]) {
    return res.status(401).json({ error: "Unauthorized request" });
  }
  //move to next middleware
  next();
});

const validTypes = [
  `Bug`,
  `Dark`,
  `Dragon`,
  `Electric`,
  `Fairy`,
  `Fighting`,
  `Fire`,
  `Flying`,
  `Ghost`,
  `Grass`,
  `Ground`,
  `Ice`,
  `Normal`,
  `Poison`,
  `Psychich`,
  `Rock`,
  `Steel`,
  `Water`
];

function handleGetTypes(req, res) {
  res.json(validTypes);
}

app.get("/types", handleGetTypes);

function handleGetPokemon(req, res) {
  //res.send("Hello, Pokemon!");
  let response = POKEDEX.pokemon;
  if (req.query.name) {
    response = response.filter(
      pokemon => pokemon.name.toLowerCase() === req.query.name.toLowerCase()
    );
  }
  if (req.query.type) {
    response = response.filter(pokemon =>
      pokemon.type.includes(req.query.type)
    );
  }

  res.json(response);
}

app.get("/pokemon", handleGetPokemon);

app.use((error, req, res, next) => {
  let response;
  if (process.env.NODE_ENV === "production") {
    response = { error: { message: "server error" } };
  } else {
    response = { error };
  }
  res.status(500).json(response);
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {});
