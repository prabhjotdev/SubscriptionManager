// app.js

const express = require("express");
const db = require("./db.js");

const app = express();
var cors = require("cors");
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(cors());
app.options('*',cors());
var allowCrossDomain = function(req,res,next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();  
}
app.use(allowCrossDomain);

app.get("/subscription", (req, res) => {
  db.query("SELECT * FROM Subscriptions", (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send("Internal Server Error");
      return;
    }
    res.json(results).status(200);
  });
});

app.get("/subscriptionById", (req, res) => {
  let id = req.body.Id;
  if (id === undefined || isNaN(id)) {
    res.status(400).send("Invalid or missing ID parameter");
    return;
  }

  db.query(`SELECT * FROM Subscriptions WHERE Id=${id}`, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send("Internal Server Error");
      return;
    }
    res.json(results).status(200);
  });
});

app.post("/AddSubscription", (req, res) => {
  let { Name, Cost, BillingPeriod, NextBillingDate, Status } = req.body;

  // Basic validation
  if (
    !Name ||
    isNaN(Cost) ||
    Cost <= 0 ||
    !BillingPeriod ||
    !NextBillingDate ||
    !Status
  ) {
    res.status(400).send("Invalid or missing parameters");
    return;
  }

  // Validate NextBillingDate is a valid date
  const date = new Date(NextBillingDate);

  if (isNaN(date.getTime())) {
    res.status(400).send("Invalid NextBillingDate");
    return;
  }

  const formattedDate = date.toISOString().split("T")[0];

  db.query(
    `Insert Into Subscriptions (Name, Cost, BillingPeriod, NextBillingDate, Status) VALUES('${Name}',${Cost},'${BillingPeriod}','${formattedDate}','${Status}')`,
    (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        res.status(500).send("Internal Server Error");
        return;
      }
      res.status(200).send("Inserted New Row");
    }
  );
});

app.delete("/subscription/:id", (req, res) => {
  let id = req.params.id;
  if (id === undefined || isNaN(id)) {
    res.status(400).send("Invalid or missing ID parameter");
    return;
  }

  db.query(`DELETE FROM Subscriptions WHERE Id=${id}`, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send("Internal Server Error");
      return;
    }
    res.status(200).send(`Deleted row with Id=${id}`);
  });
});

app.put("/subscription/:id", (req, res)=>{
    const id = req.params.id;
    const {Name, Cost, BillingPeriod, NextBillingDate, Status} = req.body;
    // Basic validation
  if (
    !Name ||
    isNaN(Cost) ||
    Cost <= 0 ||
    !BillingPeriod ||
    !NextBillingDate ||
    !Status
  ) {
    res.status(400).send("Invalid or missing parameters");
    return;
  }

  // Validate NextBillingDate is a valid date
  const date = new Date(NextBillingDate);

  if (isNaN(date.getTime())) {
    res.status(400).send("Invalid NextBillingDate");
    return;
  }

  const formattedDate = date.toISOString().split("T")[0];

    db.query(`UPDATE Subscriptions SET Name='${Name}', Cost=${Cost}, BillingPeriod='${BillingPeriod}', NextBillingDate='${formattedDate}', Status='${Status}' WHERE ID=${id}`, (err, results)=>{
        if (err) {
            console.error("Error executing query:", err);
            res.status(500).send("Internal Server Error");
            return;
          }
        });
    res.status(200).send(`Updated row with Id=${id}`);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
