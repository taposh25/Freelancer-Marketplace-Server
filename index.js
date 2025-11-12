const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require("express");
const cors = require('cors');
const app = express();
const port =process.env.PORT || 3000;


// middleware 
app.use(cors());
app.use(express.json());


// username & password
// pass: vqmd2jD2as96piWU, username: jobsDB

const uri = "mongodb+srv://jobsDB:vqmd2jD2as96piWU@cluster0.aa4hy5v.mongodb.net/?appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});



app.get("/", (req, res)=>{
    res.send('Freelancer server site is running');
})

async function run(){
  try{
        await client.connect();

        const db = client.db('jobs_db');
        const jobsCollection = db.collection('jobs');
        const usersCollection = db.collection("users");
        const acceptedTasksCollection = db.collection("acceptedTasks"); 




        // ➕ Add Job
    app.post('/addJob', async (req, res) => {
      const newJob = req.body;
      const result = await jobsCollection.insertOne(newJob);
      res.send(result);
    });

    // 📋 Get all jobs
    app.get('/allJobs', async (req, res) => {
      const jobs = await jobsCollection.find().toArray();
      res.send(jobs);
    });

    // 🔍 Get single job by ID
    app.get('/allJobs/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const job = await jobsCollection.findOne(query);
      res.send(job);
    });

    // ✏️ Update job by ID
    app.patch('/updateJob/:id', async (req, res) => {
      const id = req.params.id;
      const updatedJob = req.body;
      const query = { _id: new ObjectId(id) };
      const update = {
        $set: {
          title: updatedJob.title,
          category: updatedJob.category,
          summary: updatedJob.summary,
          coverImage: updatedJob.coverImage,
          servicesFrom: updatedJob.servicesFrom,
          rating: updatedJob.rating,
          level: updatedJob.level
        }
      };
      const result = await jobsCollection.updateOne(query, update);
      res.send(result);
    });

    // ❌ Delete job
    app.delete('/deleteJob/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await jobsCollection.deleteOne(query);
      res.send(result);
    });

    // 👤 Get jobs by user email
    app.get('/myAddedJobs', async (req, res) => {
      const email = req.query.email;
      const query = email ? { userEmail: email } : {};
      const result = await jobsCollection.find(query).toArray();
      res.send(result);
    });

    /* ---------------------- ACCEPTED TASKS ---------------------- */

    // ✅ Accept a job
    app.post('/acceptedTasks', async (req, res) => {
      const acceptedTask = req.body;

      // Prevent duplicate acceptance of the same job by same user
      const existing = await acceptedTasksCollection.findOne({
        jobId: acceptedTask.jobId,
        acceptedBy: acceptedTask.acceptedBy
      });

      if (existing) {
        return res.send({ message: "You have already accepted this job." });
      }

      const result = await acceptedTasksCollection.insertOne(acceptedTask);
      res.send(result);
    });

    // 📋 Get all accepted tasks for logged-in user
    app.get('/my-accepted-tasks', async (req, res) => {
      const email = req.query.email;
      const query = email ? { acceptedBy: email } : {};
      const result = await acceptedTasksCollection.find(query).toArray();
      res.send(result);
    });

    // ✅ Update task status (Done / Cancel)
    app.patch('/acceptedTasks/:id', async (req, res) => {
      const id = req.params.id;
      const { status } = req.body; // expected: { status: "done" } or { status: "cancelled" }
      const query = { _id: new ObjectId(id) };
      const update = { $set: { status } };
      const result = await acceptedTasksCollection.updateOne(query, update);
      res.send(result);
    });

    // ❌ Delete accepted task (for cancelled / completed)
    app.delete('/acceptedTasks/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await acceptedTasksCollection.deleteOne(query);
      res.send(result);
    });

    /* ---------------------- USERS ---------------------- */

    // 👥 Register user
    app.post('/users', async (req, res) => {
      const newUser = req.body;
      const query = { email: newUser.email };
      const existingUser = await usersCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: "User already exists" });
      }
      const result = await usersCollection.insertOne(newUser);
      res.send(result);
    });



        // get jobs

        // app.get("/jobs", async(req, res)=>{
        //     const cursor = jobsCollection.find().sort({price: 1}).limit(6);
        //     const result = await cursor.toArray();
        //     res.send(result);

        // })

        // single jobs find

         app.get('/jobs/:id', async(req, res) =>{
          const id = req.params.id;
           const query = { _id: new ObjectId(id)}
           const result = await jobsCollection.findOne(query)
           res.send(result);
         })



        // Post Jobs 
        app.post('/jobs', async(req, res) =>{
          const newjobs  = req.body;
          const result = await jobsCollection.insertOne(newjobs);
          res.send(result);
        })

        // update post

       app.patch('/jobs/:id', async(req, res) =>{
      const id = req.params.id;
      const updatedJobs = req.body;
      const query = {_id: new ObjectId(id)}
      const update ={
        $set: {
          title: updatedJobs.title,
          postedBy: updatedJobs.postedBy
        }
      }
      const result = await jobsCollection.updateOne(query, update)
      res.send(result)

     })


        // Delete jobs

      app.delete('/jobs/:id', async (req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await jobsCollection.deleteOne(query)
      res.send(result)

     })


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

  }
  finally{

  }

}
run().catch(console.dir)

app.listen(port, () => {
  console.log(`Freelancer server running on port ${port}`)
})


