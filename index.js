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
    await client.connect();

    const coffeeCollection = client.db('freelancer').collection('task')
    const userCollection = client.db('freelancer').collection('users')

    app.get("/task", async (req, res) => {
      const result = await coffeeCollection.find().toArray();
      res.send(result);
    })

    app.get("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.findOne(query)
      res.send(result);
    })
    app.post("/coffees", async (req, res) => {
      const newCoffee = req.body;
      console.log(newCoffee);
      const result = await coffeeCollection.insertOne(newCoffee)
      res.send(result)
    })

    app.put("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const updatedCoffee = req.body;
      const updatedDoc = {
        $set: updatedCoffee
      }
      const result = await coffeeCollection.updateOne(query, updatedDoc)
      res.send(result)
    })


    app.delete('/coffees/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.deleteOne(query);
      res.send(result)

    })
    // save user data 
    app.post("/users", async (req, res) => {
      const newUser = req.body;
      console.log(newUser);
      const result = await userCollection.insertOne(newUser)
      res.send(result)
    })
    // Get user Data
    app.get("/users", async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    })

    // Delete User Data 
    app.delete('/users/:id', async(req, res)=> {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await userCollection.deleteOne(query);
        res.send(result)
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Coffe shope backend')
})

app.listen(port, () => {
  console.log("Freelancer server is running on port", port);

})