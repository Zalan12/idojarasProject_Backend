const express = require('express');
const router = express.Router();

const{weathers, users, getNextWID,saveWeather}= require('../utils/store');

//-------------------IDOADATOK--------------------

//POST new data
router.post('/',(req,res)=>{
    let data=req.body;
    data.wid=getNextWID();
    weathers.push(data);
    console.log(data.datum)
    saveWeather();
    res.send({msg:'Sikeres regisztráció'})
})

//Összes adat kiíratása
router.get('/',(req,res)=>{
    res.send(weathers);
})

//GET osszes adat by felhasználó
router.get('/user/:uid',(req,res)=>{
    let userWeather=[];
    let uid=req.params.uid;
    for(let i=0; i<weathers.length;i++)
    {
        if(weathers[i].uid==uid)
        {
            userWeather.push(weathers[i])
        }
    }
    res.send(userWeather)

})

//get 1 adat by wID

router.get('/:id',(req,res)=>{
    let id=req.params.id;
    let idx=weathers.findIndex(weather=>weather.wid==id);

    if(idx>-1)
    {
        return res.send(weathers[idx])
    }
    return res.status(400).send({msg: 'Nincs ilyen adat'})
})


//DELETE 1 adat by wID

router.delete('/:id',(req,res)=>{
    let id=req.params.id;
    let idx=weathers.findIndex(weather=>weather.wid==id);
    weathers.splice(idx,1);
    saveWeather();
    return res.send({msg: 'Az adat sikeresen törölve lett!'})
})

//DELETE összes adat by uID
router.delete('/user/:uid', (req,res)=>{
    let uid=req.params.uid;
    for(let i=0; i<weathers.length;i++)
    {
        if(weathers[i].uid==uid)
        {
            weathers.splice(i,1)
            i--
        }
    }
    saveWeather();
    res.send("Sikeresen törölve")
})

//PATCH adat by wID
router.patch('/:id',(req,res)=>{
    let id=req.params.id;
    let data=req.body;
    let idx=weathers.findIndex(weather=>weather.wid==id)

    if(idx>-1)
    {
        if(data.datum)weathers[idx].datum=data.datum;
        if(data.maxTemp)weathers[idx].maxTemp=data.maxTemp;
        if(data.minTemp)weathers[idx].minTemp=data.minTemp;
        if(data.weatherType)weathers[idx].weatherType=data.weatherType;
        saveWeather();
        return res.send({msg: "Sikeres módosítás!"})
    }
    return res.status(400).send({msg:"Nincs ilyen azonosítóval ellátott adat!"})
})


module.exports=router;