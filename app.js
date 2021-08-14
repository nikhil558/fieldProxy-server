const express = require("express");
const path = require("path");
const cors = require("cors");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
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

app.get("/login", async (request, response) => {
  const getUserQuery = `
  SELECT 
  * 
  FROM 
  Users;`;

  const getData = await db.all(getUserQuery);
  response.send(getData.map((each) => each));
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
