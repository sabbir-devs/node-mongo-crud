const express = require('express');
const app = express()
var cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;
const ObjectId = require('mongodb').ObjectId

// use For meddleware
app.use(cors())
app.use(express.json())

// mongodb user
// user name: dbuser1     password: 2acoC9yC404t17fi



const uri = "mongodb+srv://dbuser1:2acoC9yC404t17fi@cluster0.ovlog.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try{
        await client.connect();
        const usersCollection = client.db("foodExpress").collection("users");
        // get user
        app.get('/user', async(req, res) => {
            const quary = {};
            const cursor = usersCollection.find(quary)
            const users = await cursor.toArray();
            res.send(users)
        });

        app.get('/user/:id', async(req, res) => {
            const id = req.params.id;
            const quary = {_id: ObjectId(id)};
            const result = await usersCollection.findOne(quary);
            res.send(result)
        })

        // post user
        app.post('/user', async(req, res) => {
            const newUser = req.body;
            const result = await usersCollection.insertOne(newUser);
            res.send(result)
        })

        // update user
        app.put('/user/:id', async(req, res) => {
            const id = req.params.id;
            const updatedUser = req.body;
            const filter = {_id: ObjectId(id)};
            const options = { upsert: true };
            const updatedDoc = {
                $set:{
                    name: updatedUser.name,
                    email: updatedUser.email
                }
            };
            const result = await usersCollection.updateOne(filter, updatedDoc, options)
            res.send(result)
        })

        // delete user
        app.delete('/user/:id', async(req, res) => {
            const id = req.params.id;
            const quary = {_id: ObjectId(id)}
            const result = await usersCollection.deleteOne(quary);
            res.send(result)
        })
    }
    finally{
        // await client.close();    
    }
}
run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('Running My Node Crud server')
})

app.listen(port, () => {
    console.log('Crud server running on', port)
})