const fs =require('fs');
const path=require('path');

let users=[];
let weathers=[];

const USERSFILE = path.join(__dirname,'..' , 'database', 'users.json');
const WEATHERSFILE = path.join(__dirname,'..' , 'database', 'weather.json');
loadWeather()
loadUsers()

function initStore() {
    loadUsers();
    loadWeather();
}

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

function saveUsers(user)
{
    fs.writeFileSync(USERSFILE,JSON.stringify(user))
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

function saveWeather(weather)
{
    fs.writeFileSync(WEATHERSFILE,JSON.stringify(weather))
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

module.exports = {
    initStore,
    saveUsers,
    saveWeather,
    getNextID,
    getNextWID,
    users,
    weathers
}