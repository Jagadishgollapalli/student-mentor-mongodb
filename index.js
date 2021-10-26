const express = require("express");
const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
const app = express();
const port = 5000;
//const dbURL = "mongodb://127.0.0.1:27017";
const dbURL = "mongodb+srv://StudentMentor:StudentMentor@cluster0.mxsef.mongodb.net/StudentMentor?retryWrites=true&w=majority"


app.use(express.json());

//create an individual mentor
app.post("/create_mentor", async (req, res) => {
  try {
    let client = await mongoClient.connect(dbURL, { useUnifiedTopology: true });
    let db = client.db("mentor_assign_db");
    let output = await db.collection("mentors").insertOne(req.body);
    res.status(200).json({ message: "mentor created" ,output});
    client.close();
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// create an individual student
app.post("/create_student", async (req, res) => {
  try {
    let client = await mongoClient.connect(dbURL, { useUnifiedTopology: true });
    let db = client.db("mentor_assign_db");
    let output = await db.collection("students").insertOne(req.body);
    res.status(200).json({ message: "students created",output });
    client.close();
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// assign a student to a mentor

app.put("/assign_student", async (req, res) => {
  try {
      let client = await mongoClient.connect(dbURL, { useUnifiedTopology: true });
      let db = client.db("mentor_assign_db");
      let output = await db
          .collection("students")
          .updateMany(
              {mentor_name: req.body.mentor_name },
              { $set: { student_name:  req.body.student_name } }
          );
      res.status(200).json({
          message: "mentor assigned or changed to a particular student",output
      });
      client.close();
  } catch (error) {
      console.log(error);
      res.sendStatus(500);
  }
});


// assign a mentor to a student

app.put("/assign_mentor", async (req, res) => {
  try {
      let client = await mongoClient.connect(dbURL, { useUnifiedTopology: true });
      console.log(req.body.student_name)
      let db = client.db("mentor_assign_db");
      await db
          .collection("students")
          .updateMany(
              { student_name:  req.body.student_name },
              { $set: { mentor_name: req.body.mentor_name } }
          );    
      let result = await db
          .collection("students")
          .find( )
          .toArray();
      res.status(200).json({ message: "mentor assigned", result });
      client.close();
  } catch (error) {
      console.log(error);
      res.sendStatus(500);
  }
});


// read students list

app.get("/students_list", async (req, res) => {
  try {
    let client = await mongoClient.connect(dbURL, { useUnifiedTopology: true });
    let db = client.db("mentor_assign_db");
    let output = await db.collection("students").find().toArray();
    res.status(200).json({ message: " student list", output });
    client.close();
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// read mentors list

app.get("/mentors_list", async (req, res) => {
    try {
      let client = await mongoClient.connect(dbURL, { useUnifiedTopology: true });
      let db = client.db("mentor_assign_db");
      let output = await db.collection("mentors").find().toArray();
      res.status(200).json({ message: " mentors list", output });
      client.close();
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  });


  // students without mentor
  app.get("/idle_students", async (req, res) => {
    try {
        let client = await mongoClient.connect(dbURL);
        let db = client.db("mentor_assign_db");
        let output = await db
            .collection("students")
            .find({ mentor_name: null })
            .toArray();
        res.status(200).json({
            message: "list of students without a mentor",
            output,
        });
        client.close();
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

// students under mentor
app.get("/students_under_mentor/:mentor_name", async (req, res) => {
  try {
      let client = await mongoClient.connect(dbURL);
      let db = client.db("mentor_assign_db");

      let output = await db
          .collection("students")
          .find({ mentor_name: "mentor-1" })
          .toArray();
      res.status(200).json({
          message: `students under mentor_name: `,
          output,  
      });
      client.close();
  } catch (error) {
      console.log(error);
      res.sendStatus(500);
  }
});

app.listen(port, () => {
      console.log("server listening " + port);
});
