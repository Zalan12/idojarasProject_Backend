const express=require('express');
const cors =require('cors');

const { initStore }=require('./utils/store')

const userRoutes=require('./modules/users');
const weatherRoutes=require('./modules/weathers');

const app=express()
//------------------Middleware-------------------------
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

initStore()

app.get('/', (req, res) => {
    res.send({ msg: 'Backend API by Bajai SZC Türr István Technikum - 13.A Szoftverfejlesztő ' })
})

app.use('/users', userRoutes);
app.use('/weather', weatherRoutes);

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000')
})


