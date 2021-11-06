const express = require('express');
const app = express();
var cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectID = require('mongodb').ObjectId;
require('dotenv').config();
const port = process.env.PORT || 5000;

// midelware 
app.use(cors());
app.use(express.json());

// connect to db 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jjz52.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {

    try {
        await client.connect();
        const database = client.db("PathFriend");
        const packageCollection = database.collection("Package");
        const getOfferCollection = database.collection("getoffer");
        // get all package api 
        app.get("/package", async (req, res) => {
            const result = await packageCollection.find({}).toArray();
            res.send(result);

        });
        // get single pack api 
        app.get("/package/:id", async (req, res) => {
            const id = req.params.id;
            const result = await packageCollection.findOne({ _id: ObjectID(id) })
            res.send(result)
        })

        // insert new packackage
        app.post('/package', async (req, res) => {
            const result = await packageCollection.insertOne(req.body);

            res.json(result);
        })

        // book tour
        app.post('/jointour', async (req, res) => {
            const result = await getOfferCollection.insertOne(req.body)
            res.json(result);
        })
        // all booking
        app.get('/getoffer', async (req, res) => {
            const result = await getOfferCollection.find({}).toArray();
            res.send(result)
        })
        // my booking
        app.get('/getoffer/:email', async (req, res) => {
            const email = req.params.email
            const result = await getOfferCollection.find({ email: email }).toArray();
            res.send(result)
        })
        // delete booking 
        app.delete('/deletebooking/:id', async (req, res) => {
            const id = req.params.id
            const result = await getOfferCollection.deleteOne({ _id: ObjectID(id) })
            res.json(result);
        })

        // update pending 
        app.put('/update/:id', async (req, res) => {
            const id = req.params.id;

            const result = await getOfferCollection.updateOne({ _id: ObjectID(id) }, {
                $set: {
                    status: 'Approved'
                }
            })

            res.json(result)
        })
    }
    finally {
        // await client.close();
    }

}
run().catch(console.dir)



app.get('/', (req, res) => {
    res.send("Hello pathfriend")
})
app.listen(port, () => {
    console.log("listen", port)
})