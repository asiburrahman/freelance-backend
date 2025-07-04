const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json())

// username = coffee-shop
// password= GN68LMBxFsuYP5p



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ajsrfci.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    

    const taskCollection = client.db('freelancer').collection('task')
    const userCollection = client.db('freelancer').collection('user')

    app.get("/task", async (req, res) => {
      const result = await taskCollection.find().toArray();
      res.send(result);
     // console.log(result);
      
    })


    app.get("/recentTasks", async (req, res) => {
      const result = await taskCollection.find().sort({ date: 1 }).limit(8).toArray();
      res.send(result);
    })

    app.get("/task/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email : email };
      const result = await taskCollection.find(query).toArray();
      // console.log(result);
      
      res.send(result);
    })

// get task details for every user 
     app.get("/taskDetail/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await taskCollection.findOne(query);
      console.log(result);
      
      res.send(result);
    })


    // added a task 
    app.post("/task", async (req, res) => {
      const newTask = req.body;
      // console.log(newTask);
      const result = await taskCollection.insertOne(newTask)
      res.send(result)
    })


     // add a User 
    app.post("/user", async (req, res) => {
      const user = req.body;
      // console.log(newTask);
      const result = await userCollection.insertOne(user)
      res.send(result)
    })

// Update BID count data 
    app.patch("/post/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const bids = req.body;
      const options = { upsert: true };
      const bidsUser = {
        $set: bids
      }
      const result = await taskCollection.updateOne(query, bidsUser, options)
      // console.log(result);
      
      res.send(result)
    })


        // update mytask 

        app.put("/updateTask/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const userData = req.body;
      const bidsUser = {
        $set: req.body
      }
      const result = await taskCollection.updateOne(query, bidsUser)
      // console.log(result);
      
      res.send(result)
      result
    })


    // delete mytask 

    app.delete('/myTask/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await taskCollection.deleteOne(query);
      console.log(result);
      
      res.send(result)

    })
    
app.get("/", (req, res) => res.send("Express on Vercel"));


    // Send a ping to confirm a successful connection
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.listen(port, () => {
  console.log("Freelancer server is running on port", port);

})