const express = require("express");
const path = require("path");
const cors = require("cors");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = express();
app.use(express.json());
app.use(cors());

const dbPath = path.join(__dirname, "UsersData.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(process.env.PORT || 3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

app.post("/add", async (request, response) => {
  const { title, id, date, time, isStarred, acceptance } = request.body;

  const createUserQuery = `
     INSERT INTO
      Appointments (name,number,date,time,stared,acceptance)
     VALUES
      (
       '${title}',
       '${id}',
       '${date}',
       '${time}',
       '${isStarred}',
       '${acceptance}'
      );`;

  await db.run(createUserQuery);
  response.send("User created successfully");
});

app.post("/login", async (request, response) => {
  const { username, password } = request.body;
  const selectUserQuery = `SELECT * FROM Users WHERE name = '${username}';`;
  const databaseUser = await db.get(selectUserQuery);

  if (databaseUser === undefined) {
    response.status(400);
    response.send("Invalid user");
  } else {
    if (databaseUser.password === password) {
      const payload = { name: username, password: password };

      const jwtToken = jwt.sign(payload, "nikhil");

      response.send({ jwtToken });
    } else {
      response.status(400);
      response.send("Invalid password");
    }
  }
});

app.get("/appointments", async (request, response) => {
  const getUserQuery = `
  SELECT 
  * 
  FROM 
  Appointments;`;

  const getData = await db.all(getUserQuery);
  response.send(getData.map((each) => each));
});

app.delete("/delete/:id", async (request, response) => {
  const { id } = request.params;
  const deleteQuery = `
    DELETE 
    FROM 
    Appointments
    WHERE
    id=${id}`;
  await db.run(deleteQuery);
  response.send("Delete row successfully");
});
