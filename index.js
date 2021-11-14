const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();


const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3fgg4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

console.log(uri);

async function run() {
    try {
        await client.connect();
        console.log('database connect succesfully');
        const database = client.db('online_Shop');
        const productCollection = database.collection('products');

        // get products api
        app.get('/products', async (req, res) => {
            // console.log(req.query);
            const cursor = productCollection.find({});
            const page = req.query.page;
            const size = parseInt(req.query.size);
            let products;
            const count = await cursor.count();
            if (page) {
                products = await cursor.skip(page * size).limit(size).toArray();
            }
            else {
                products = await cursor.toArray();
            }


            res.send({
                count,
                products
            });
        });
    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Ema-john server is running');
});

app.listen(port, () => {
    console.log('server running at port', port);
})