import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public")); // styling
app.use(bodyParser.urlencoded({ extended: true })); // parsing data from html


app.get("/", async (req, res) => {
  try {
    const response = await axios.get("https://bored-api.appbrewery.com/random");
    const result = response.data;
    console.log(result);
    res.render("index.ejs", { data: result });
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("index.ejs", {
      error: error.message,
    });
  }
});


app.post("/", async (req, res) => {
  let typeSelected = req.body.type;
  let partSelected = req.body.participants;

  try {
    const response = await axios.get(`https://bored-api.appbrewery.com/filter?type=${typeSelected}&participants=${partSelected}`); 
    const results = response.data; // many objects, choose one of them randomly
    var randomIndex = Math.floor(Math.random() * results.length);
    var result = results[randomIndex];
    console.log(result);

    res.render("index.ejs", {
      userSelection: result,
      error: null, // Clear any previous error 
    });

  } catch (error) {

    var errorMessage = "";

    switch(error.response.status) {
      case 400:
        errorMessage = "400 Error";
        break;
      case 404:
        errorMessage = "No activities that match your criteria.";
        break;
      default:
        errorMessage = error.message;

    }
      console.log(errorMessage); 

    
    res.render("index.ejs", {
      error: errorMessage,
    })
  }

  
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
