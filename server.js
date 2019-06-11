const express = require("express");
const cors = require("cors");
const ogs = require("open-graph-scraper");
//import express from 'express';

// Set up the express app
const app = express();

// app.use(function(req, res) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
// });
app.use(cors());
app
  .get("/", (req, res) => {
    let website = req.query.website;

    if (!website) {
      let errMsg = { error: "Missing website" };
      res.status(401).json(errMsg);
    }

    let options = {
      url: website,
      onlyGetOpenGrapInfo: true,
      headers: { "accept-language": "en" }
    };
    ogs(options, function(error, results) {
      console.log("error:", error); // This is returns true or false. True if there was a error. The error it self is inside the results object.
      //console.log("results:", results);
      res.status(200).send({ results });
    });

    //Listen on port 5000
  })
  .listen(5000, () => {
    console.log("Server started on port 5000");
  });

// let options = {'url': 'http://ogp.me/', 'onlyGetOpenGrapInfo': true};
// ogs(options, function (error, results) {
//   console.log('error:', error); // This is returns true or false. True if there was a error. The error it self is inside the results object.
//   console.log('results:', results);
// });

// const PORT = 5000;

// app.listen(PORT, () => {
//   console.log(`server running on port ${PORT}`)
// });
