import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const API_URL = "https://www.reed.co.uk/api/1.0/search?";
const API_URL_JOB = "https://www.reed.co.uk/api/1.0/jobs/";
const API_KEY = "f3195f91-c610-4ba3-8dfb-7dfb9f8962ad";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


app.get("/", async (req, res) => {
    res.render("index.ejs");
  
    });

app.get("/job/:id", async (req, res) => {
    let job = req.params.id;
    try {
      const response = await axios.get(API_URL_JOB + job, {
        auth: {
          username: API_KEY,
          password: "",
        },
      });
      res.render("job-page.ejs", { content: response.data});
    } catch (error) {
      console.error("Failed to make request:", error.message);
      res.render("results.ejs", {
        error: error.message,
      });
    }
    
    });

app.post("/submit", async (req, res) => {
    let title = req.body["job_title"];
    if (title == "") {
      res.render("index.ejs", { error: true });
    }
    else {
      try {
        const response = await axios.get(API_URL + "keywords=" + title, {
          auth: {
            username: API_KEY,
            password: "",
          },
        });
        let result = response.data;
        res.render("results.ejs", { content: result.results, searchwords: title});
      } catch (error) {
        console.error("Failed to make request:", error.message);
        res.render("results.ejs", {
          error: error.message,
        });
      }
    }
    
    });

app.post("/filter", async (req, res) => {
    let location = req.body["location"];
    let title = req.body["searchwords"];
    let distance = req.body["distance"];
    let minSal = req.body["minSal"];

    let search = API_URL + "keywords=" + title;

    if (location != "") {
      search = search + "&" + "location=" + location;
    }
    if (distance != "") {
      search = search + "&" + "distancefromlocation=" + distance;
    }
    if (minSal != "") {
      search = search + "&" + "minimumsalary=" + minSal;
    }
    

    console.log(search);
      try {
        const response = await axios.get(search, {
          auth: {
            username: API_KEY,
            password: "",
          },
        });
        let result = response.data;
        res.render("results.ejs", { content: result.results, searchwords: title});
      } catch (error) {
        console.error("Failed to make request:", error.message);
        res.render("results.ejs", {
          error: error.message,
        });
      }
})
      

app.listen(port, () => {
    console.log("Server is running on port " + port);
});