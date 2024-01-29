// app.js

const express = require("express");
const db = require("./db.js");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
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

app.post("/subscription", (req, res) => {
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

app.delete("/subscription", (req, res) => {
  let id = req.body.Id;
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

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
