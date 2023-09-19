
const chokidar = require('chokidar');  

// chokidar.watch('/Volumes/Storage/Users/Shahid/Desktop/GameOn/').on('all',(path,flags,id)=>{

//     console.log(path,flags,id)
// })
chokidar.watch('/Volumes/GameOn/mobile/').on('all',(event,path,id)=>{
   if (!path.includes("node_modules"))
    console.log(path)
})