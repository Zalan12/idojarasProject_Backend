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

const USERSFILE=path.join(__dirname,'users.json')

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