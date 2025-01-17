const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(
    cors({
        origin: ['http://localhost:5173', 'https://art-craft-c5db0.web.app'],
        credentials: true,
    }),
)
app.use(express.json());


// const uri = "mongodb://localhost:27017";
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tqkankt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        // await client.connect();

        const artCollection = client.db('artDB').collection('art')


        app.get('/art',async(req,res)=>{
            const cursor = artCollection.find();
            const result =await cursor.toArray();
            res.send(result);
        })


        app.get('/art/:id',async(req,res)=>{
            const id =req.params.id;
            const query = {_id: new ObjectId(id)};
            const result = await artCollection.findOne(query);
            res.send(result);
        })

        app.post('/art',async(req,res)=>{
            const newArt = req.body;
            console.log(newArt);
            const result =await artCollection.insertOne(newArt);
            res.send(result)
        })



        app.put('/art/:id',async(req,res)=>{
            const id =req.params.id;
            const filter = {_id: new ObjectId(id)};
            const options = {upsert : true};
            const updatedArt = req.body;
            const art = {
                $set:{
                    image:updatedArt.image,
                    item:updatedArt.item,
                    subCategory:updatedArt.subCategory,
                    description:updatedArt.description,
                    price:updatedArt.price,
                    rating:updatedArt.rating,
                    customization:updatedArt.customization,
                    process:updatedArt.process,
                    stock:updatedArt.stock

                }

                
            }

            const result = await artCollection.updateOne(filter,art,options);
            res.send(result);
        })



        app.delete('/art/:id',async(req,res)=>{
            const id =req.params.id;
            const query = {_id: new ObjectId(id)};
            const result = await artCollection.deleteOne(query);
            res.send(result);
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
    res.send("Server is running")
})


app.listen(port, () => {
    console.log(`Coffee server is running on ${port}`)
})