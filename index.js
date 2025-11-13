

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB URI
const uri = "mongodb+srv://jobsDB:vqmd2jD2as96piWU@cluster0.aa4hy5v.mongodb.net/?appName=Cluster0";

// MongoDB client
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    console.log("MongoDB connected successfully");

    const db = client.db('jobs_db');
    const jobsCollection = db.collection('jobs');
    const acceptedTasksCollection = db.collection('acceptedTasks');

   

    // Add Job
    app.post('/addJob', async (req, res) => {
      const newJob = req.body;
      const result = await jobsCollection.insertOne(newJob);
      res.send(result);
    });


      app.get("/allJobs", async (req, res) => {
        const limit = parseInt(req.query.limit) || 0; 
        const jobs = await jobsCollection.find().limit(limit).toArray();
        res.send(jobs);
      });


    // Get all jobs
    app.get('/allJobs', async (req, res) => {
      const jobs = await jobsCollection.find().toArray();
      res.send(jobs);
    });

    // Get single job by ID
    app.get('/allJobs/:id', async (req, res) => {
      const id = req.params.id;
      if (!ObjectId.isValid(id)) return res.status(400).send({ error: "Invalid ID" });

      const job = await jobsCollection.findOne({ _id: new ObjectId(id) });
      if (!job) return res.status(404).send({ message: "Job not found" });

      res.send(job);
    });

    // Update job
    app.patch('/updateJob/:id', async (req, res) => {
      const id = req.params.id;
      const updatedJob = req.body;
      if (!ObjectId.isValid(id)) return res.status(400).send({ error: "Invalid ID" });

      const result = await jobsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedJob }
      );
      res.send(result);
    });

    // Delete job
    app.delete('/deleteJob/:id', async (req, res) => {
      const id = req.params.id;
      if (!ObjectId.isValid(id)) return res.status(400).send({ error: "Invalid ID" });

      const result = await jobsCollection.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    // Jobs added by specific user
    app.get('/myAddedJobs', async (req, res) => {
      const email = req.query.email;
      if (!email) return res.status(400).send({ error: "Email is required" });

      const jobs = await jobsCollection.find({ userEmail: email }).toArray();
      res.send(jobs);
    });

 

    // Accept a task
    app.post('/acceptedTasks', async (req, res) => {
      const acceptedTask = req.body;
      const existing = await acceptedTasksCollection.findOne({
        jobId: acceptedTask.jobId,
        acceptedBy: acceptedTask.acceptedBy
      });

      if (existing) return res.send({ message: "Already accepted this job" });

      const result = await acceptedTasksCollection.insertOne(acceptedTask);
      res.send(result);
    });

    // Get accepted tasks for user
    app.get('/my-accepted-tasks', async (req, res) => {
      const email = req.query.email;
      if (!email) return res.status(400).send({ error: "Email is required" });

      const tasks = await acceptedTasksCollection.find({ acceptedBy: email }).toArray();
      res.send(tasks);
    });

    // Update task status
    app.patch('/acceptedTasks/:id', async (req, res) => {
      const id = req.params.id;
      const { status } = req.body;
      if (!ObjectId.isValid(id)) return res.status(400).send({ error: "Invalid ID" });

      const result = await acceptedTasksCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { status } }
      );
      res.send(result);
    });

    // Delete accepted task
    app.delete('/acceptedTasks/:id', async (req, res) => {
      const id = req.params.id;
      if (!ObjectId.isValid(id)) return res.status(400).send({ error: "Invalid ID" });

      const result = await acceptedTasksCollection.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });

  } finally {

  }
}

run().catch(console.dir);

app.listen(port, () => console.log(`Server running on port ${port}`));



