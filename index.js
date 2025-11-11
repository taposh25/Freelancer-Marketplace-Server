// const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const express = require("express");
// const cors = require('cors');
// const app = express();
// const port =process.env.PORT || 3000;


// // middleware 
// app.use(cors());
// app.use(express.json());


// // username & password
// // pass: vqmd2jD2as96piWU, username: jobsDB

// const uri = "mongodb+srv://jobsDB:vqmd2jD2as96piWU@cluster0.aa4hy5v.mongodb.net/?appName=Cluster0";

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version

// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });



// app.get("/", (req, res)=>{
//     res.send('Freelancer server site is running');
// })

// async function run(){
//   try{
//         await client.connect();

//         const db = client.db('jobs_db');
//         const jobCollection = db.collection('jobs');


//         // get jobs

//         app.get("/jobs", async(req, res)=>{
//             const cursor = jobCollection.find().sort({price: 1}).limit(6);
//             const result = await cursor.toArray();
//             res.send(result);

//         })

//         // single jobs find

//          app.get('/jobs/:id', async(req, res) =>{
//           const id = req.params.id;
//            const query = { _id: new ObjectId(id)}
//            const result = await jobCollection.findOne(query)
//            res.send(result);
//          })



//         // Post Jobs 
//         app.post('/jobs', async(req, res) =>{
//           const newjobs  = req.body;
//           const result = await jobCollection.insertOne(newjobs);
//           res.send(result);
//         })

//         // update post

//        app.patch('/jobs/:id', async(req, res) =>{
//       const id = req.params.id;
//       const updatedJobs = req.body;
//       const query = {_id: new ObjectId(id)}
//       const update ={
//         $set: {
//           title: updatedJobs.title,
//           postedBy: updatedJobs.postedBy
//         }
//       }
//       const result = await productCollection.updateOne(query, update)
//       res.send(result)

//      })


//         // Delete jobs

//       app.delete('/jobs/:id', async (req, res) =>{
//       const id = req.params.id;
//       const query = {_id: new ObjectId(id)}
//       const result = await jobCollection.deleteOne(query)
//       res.send(result)

//      })


//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");

//   }
//   finally{

//   }

// }
// run().catch(console.dir)

// app.listen(port, () => {
//   console.log(`Freelancer server running on port ${port}`)
// })



const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
 const uri = "mongodb+srv://jobsDB:vqmd2jD2as96piWU@cluster0.aa4hy5v.mongodb.net/?appName=Cluster0";



const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.get('/', (req, res) => {
  res.send("Freelance Marketplace Server is Running ✅");
});

async function run() {
  try {
    await client.connect();
    const db = client.db("freelance_marketplace_db");
    const jobsCollection = db.collection("jobs");
    const usersCollection = db.collection("users");

    // Add Job
    app.post('/addJob', async (req, res) => {
      const newJob = req.body;
      const result = await jobsCollection.insertOne(newJob);
      res.send(result);
    });

  // Get all job
    app.get('/allJobs', async (req, res) => {
      const jobs = await jobsCollection.find().toArray();
      res.send(jobs);
    });

    // Get single job

    app.get('/allJobs/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const job = await jobsCollection.findOne(query);
      res.send(job);
    });

   // Updated job by ID

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

    // Delete Job by ID

    app.delete('/deleteJob/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await jobsCollection.deleteOne(query);
      res.send(result);
    });


    //  Get jobs by user email

    app.get('/myAddedJobs', async (req, res) => {
      const email = req.query.email;
      const query = email ? { userEmail: email } : {};
      const result = await jobsCollection.find(query).toArray();
      res.send(result);
    });


    //  Get accepted-tasks
    
    app.get('/my-accepted-tasks', async (req, res) => {
      const email = req.query.email;
      const query = email ? { acceptedBy: email } : {};
      const result = await jobsCollection.find(query).toArray();
      res.send(result);
    });


    //  User post

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

    
    await client.db("admin").command({ ping: 1 });
    console.log("✅ MongoDB connected successfully!");
  } finally {
    
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log(` Server is running on port: ${port}`);
});
