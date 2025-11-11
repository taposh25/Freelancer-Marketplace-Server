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
        const jobCollection = db.collection('jobs');


        // get jobs

        app.get("/jobs", async(req, res)=>{
            const cursor = jobCollection.find();
            const result = await cursor.toArray();
            res.send(result);

        })

        // single jobs find

         app.get('/jobs/:id', async(req, res) =>{
          const id = req.params.id;
           const query = { _id: new ObjectId(id)}
           const result = await jobCollection.findOne(query)
           res.send(result);
         })



        // Post Jobs 
        app.post('/jobs', async(req, res) =>{
          const newjobs  = req.body;
          const result = await jobCollection.insertOne(newjobs);
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
      const result = await productCollection.updateOne(query, update)
      res.send(result)

     })


        // Delete jobs

      app.delete('/jobs/:id', async (req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await jobCollection.deleteOne(query)
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

