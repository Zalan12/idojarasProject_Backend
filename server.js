const express=require('express');
const cors =require('cors');
const fs =require('fs');
const path=require('path');

const app=express()
//------------------Midleware-------------------------
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

let users=[];
let weathers=[];

const USERSFILE=path.join(__dirname,'users.json')
const WEATHERSFILE=path.join(__dirname,'weather.json')

//---------------------USERS-------------------------

//USER felvétele, regisztrálása
app.post('/users',(req,res)=>{
    let data=req.body;
    data.id=getNextID();
    users.push(data);
    saveUsers();
    res.send({msg:'Sikeres regisztráció'})
})

//post logged USER

app.post('/users/login',(req,res)=>{
    let {email,password}=req.body;
    let loggedUser={};
    users.forEach(user=>{
        if (user.email==email && user.password==password) {
            loggedUser=user;
            return
        }
    })
    res.send(loggedUser)
})

//Összes felhasználó kiíratása (dev)
app.get('/users',(req,res)=>{
    res.send(users);
})

//GET felhasznalo id altal
app.get('/users/:id',(req,res)=>{
    let id=req.params.id;
    let idx=users.findIndex(user=>user.id==id)

    if(idx>-1)
        {
            return res.send(users[idx])
        }
    return res.status(400).send({msg:"Nincs ilyen id-s felhasználó"})
})

//DELETE felhasznalo id altal
app.delete('/users/:id',(req,res)=>{
    let id=req.params.id;
    let idx=users.findIndex(user=>user.id==id)

    if(idx>-1)
        {
            users.splice(idx,1)
            saveUsers();
            return res.send("A felhasználó sikeresen törölve lett")
        }
    return res.status(400).send({msg:"Nincs ilyen id-s felhasználó"})
})

//PATCH felhasznalo id altal
app.patch('/users/:id',(req,res)=>{
    let id=req.params.id;
    let data=req.body;
    let idx=users.findIndex(user=>user.id==id)

    if(idx>-1)
        {
            if(data.name)users[idx].name=data.name;
            saveUsers();
            return res.send({msg:"A felhasználó módosítva lett!"})
        }
    return res.status(400).send({msg:"Nincs ilyen id-s felhasználó"})
})
//PATCH felhasznalo jelszo id altal
app.patch('/users/jelszovalt/:id',(req,res)=>{
    let id=req.params.id;
    let data=req.body;
    let idx=users.findIndex(user=>user.id==id)

    if(idx>-1)
    {
        if(data.password && data.newPassword){
            users[idx].password=data.newPassword;
            saveUsers();
            return res.send({msg:"A felhasznaló jelszava modositva lett"})
        }
    }
})
loadUsers()

//-------------------IDOADATOK--------------------

//POST new data
app.post('/weather',(req,res)=>{
    let data=req.body;
    data.wid=getNextWID();
    weathers.push(data);
    saveWeather();
    res.send({msg:'Sikeres regisztráció'})
})

//Összes adat kiíratása
app.get('/weather',(req,res)=>{
    res.send(weathers);
})

//GET osszes adat by felhasználó
app.get('/weather/user/:uid',(req,res)=>{
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

app.get('/weather/:id',(req,res)=>{
    let id=req.params.id;
    let idx=weathers.findIndex(weather=>weather.wid==id);

    if(idx>-1)
    {
        return res.send(weathers[idx])
    }
    return res.status(400).send({msg: 'Nincs ilyen adat'})
})


//DELETE 1 adat by wID

app.delete('/weather/:id',(req,res)=>{
    let id=req.params.id;
    let idx=weathers.findIndex(weather=>weather.wid==id);
    weathers.splice(idx,1);
    saveWeather();
    return res.send({msg: 'Az adat sikeresen törölve lett!'})
})

//DELETE összes adat by uID
app.delete('/weather/user/:uid', (req,res)=>{
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
app.patch('/weather/:id',(req,res)=>{
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


loadWeather()
app.listen(3000);

//-------------------FÜGGVÉNYEK-------------------

function loadUsers()
{
    if(fs.existsSync(USERSFILE))
        {
            const raw=fs.readFileSync(USERSFILE);
            try
            {
                users=JSON.parse(raw);
            }

            catch(err){
                console.log("hiba! ",err)
                users=[];
            }
        }
    else{
        saveUsers()
    }
}

function saveUsers()
{
    fs.writeFileSync(USERSFILE,JSON.stringify(users))
}

function getNextID()
{
    let NextID=1;
    if(users.length==0)
    {
        return NextID
    }
    let maxIndex=0;
    for(let i=0;i<users.length;i++)
    {
        if(users[i].id>users[maxIndex].id)
        {
            maxIndex=i;
        }
    }

    return users[maxIndex].id+1;
}

function getNextWID()
{
    let NextWID=1;
    if(weathers.length==0)
    {
        return NextWID
    }
    let maxIndex=0;
    for(let i=0;i<weathers.length;i++)
    {
        if(weathers[i].wid>weathers[maxIndex].wid)
        {
            maxIndex=i;
        }
    }

    return weathers[maxIndex].wid+1;
}

function saveWeather()
{
    fs.writeFileSync(WEATHERSFILE,JSON.stringify(weathers))
}

function loadWeather()
{
    if(fs.existsSync(WEATHERSFILE))
        {
            const raw=fs.readFileSync(WEATHERSFILE);
            try
            {
                weathers=JSON.parse(raw);
            }

            catch(err){
                console.log("hiba! ",err)
                weathers=[];
            }
        }
    else{
        saveWeather()
    }
}