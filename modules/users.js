const express = require('express')
const router = express.Router();

const {users, getNextID, saveUsers} = require('../utils/store');


router.post('/',(req,res)=>{
    let data=req.body;
    data.id=getNextID();
    users.push(data);
    saveUsers(users);
    res.send({msg:'Sikeres regisztráció'})
})

//post logged USER

router.post('/login',(req,res)=>{
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
router.get('/',(req,res)=>{
    res.send(users);
})

//GET felhasznalo id altal
router.get('/:id',(req,res)=>{
    let id=req.params.id;
    let idx=users.findIndex(user=>user.id==id)

    if(idx>-1)
        {
            return res.send(users[idx])
        }
    return res.status(400).send({msg:"Nincs ilyen id-s felhasználó"})
})

//DELETE felhasznalo id altal
router.delete('/:id',(req,res)=>{
    let id=req.params.id;
    let idx=users.findIndex(user=>user.id==id)

    if(idx>-1)
        {
            users.splice(idx,1)
            saveUsers(users);
            return res.send("A felhasználó sikeresen törölve lett")
        }
    return res.status(400).send({msg:"Nincs ilyen id-s felhasználó"})
})

//PATCH felhasznalo id altal
router.patch('/:id',(req,res)=>{
    let id=req.params.id;
    let data=req.body;
    let idx=users.findIndex(user=>user.id==id)

    if(idx>-1)
        {
            if(data.name)users[idx].name=data.name;
            if(data.email)users[idx].email=data.email;
            saveUsers(users);
            return res.send({msg:"A felhasználó módosítva lett!"})
        }
    return res.status(400).send({msg:"Nincs ilyen id-s felhasználó"})
})
//PATCH felhasznalo jelszo id altal
router.patch('/jelszovalt/:id',(req,res)=>{
    let id=req.params.id;
    let data=req.body;
    let idx=users.findIndex(user=>user.id==id)

    if(idx>-1)
    {
        if(data.password && data.newPassword){
            users[idx].password=data.newPassword;
            saveUsers(users);
            return res.send({msg:"A felhasznaló jelszava modositva lett"})
        }
    }
})

module.exports=router;