const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "UserData.db");

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

app.post("/results", async (request, response) => {
  const {
    name,
    first,
    second,
    third,
    fourth,
    fifth,
    sixth,
    seventh,
    eight,
    ninth,
    tenth,
    result,
    score,
  } = request.body;

  const createUserQuery = `
     INSERT INTO
      User (name,first,second,third,fourth,fifth,sixth,seventh,eight,ninth,tenth,result,score)
     VALUES
      (
       '${name}',
       '${first}',
       '${second}',
       '${third}',
       '${fourth}',  
       '${fifth}',
       '${sixth}',
       '${seventh}',
       '${eight}',
       '${ninth}',  
       '${tenth}',
       '${result}',
       '${score}'
      );`;

  await db.run(createUserQuery);
  response.send("User created successfully");
});

app.get("/history", async (request, response) => {
  const getUserQuery = `
  SELECT 
  * 
  FROM 
  User;`;

  const getData = await db.all(getUserQuery);
  response.send(getData.map((each) => each));
});
