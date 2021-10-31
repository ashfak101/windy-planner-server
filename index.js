const express = require('express');
const { MongoClient } = require('mongodb');
const cors =require('cors')
require('dotenv').config()
const ObjectId=require('mongodb').ObjectId;
const app =express();
const port=process.env.PORT ||5000

//middleware
app.use(cors());
app.use(express.json());

//connecting database
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.d7g1b.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run(){
    try{
      await client.connect();
      // console.log('connected to the database');
      const database =client.db('holidayPlanners');
      const servicesCollection=database.collection('services');
      // Order
      const userOrderCollection=database.collection('userOrders')
      // Get Api
      app.get('/services',async(req,res)=>{
        const cursor =servicesCollection.find({});
        const services = await cursor.toArray();
        res.send(services);
      })
      //Get single Service
      app.get('/services:id',async(req,res)=>{
        const id =req.params.id;
        const query ={_id:ObjectId(id)}

        const service= await servicesCollection.findOne(query)
        res.json(service)
      })
      app.get('/userorders', async(req,res)=>{
        const cursor = userOrderCollection.find({})
        const order=await cursor.toArray();
        res.send(order)
      })
      app.get('/userorders/:id',async(req,res)=>{
        const id=req.params.id;
        const query ={_id:ObjectId(id)}
        const result =await userOrderCollection.findOne(query)
        res.json(result)
      })
      // User Booking Details
      app.get('/userorders/:email',async(req,res)=>{
        console.log(req.params.email);
        const result =await userOrderCollection.find({email:req.params.email}).toArray();
        res.send(result);
      })
      

      // Creating post api
      app.post('/services', async(req,res)=>{
        const service =req.body;
     
      
        const result = await servicesCollection.insertOne(service)
        //   console.log();
        res.json(result);
      })
      //create userorder api
      
      app.post('/userorders', async(req,res)=>{
        // console.log('hittt', req.body);
        const userorder=req.body;
        const result =await userOrderCollection.insertOne(userorder)
        res.json(result)
      })
      // update APi
      app.put('/userorders/:id',async(req,res)=>{
        const id=req.params.id;
        const updatedBooking=req.body;
        const filter={_id:ObjectId(id)};
        const option={upsert:true};
        const UpdateDoc={
          $set:{
            name:updatedBooking.name,
            email:updatedBooking.email,
            PackageName:updatedBooking.PackageName,
            Date:updatedBooking.Date,
            Address:updatedBooking.Address,
            Phone:updatedBooking.Phone
          }
        };
        const result = await userOrderCollection.updateOne(filter,UpdateDoc,option)
        console.log('uuuuuuuu',req);
        res.json(result)
      })


    // Delete Api
    app.delete('/userorders/:id',async(req,res)=>{
      const id =req.params.id;
      const  query ={_id:ObjectId(id)}
      const result =await userOrderCollection.deleteOne(query)
      res.json(result)
    })
    //Delete Booking
    app.get('/userorders/:id', async(req,res)=>{
    const id=req.params.id;
    const query={_id: ObjectId(id)}
    const result=await userOrderCollection.deleteOne(query)
    res.json(result)
    })
  }
    finally{
        // await client.close();
    }
}
// Calling the run function
run().catch(console.dir);


//Setting up server
app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })



  //windydb
  //