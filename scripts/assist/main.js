const child_process=  require("child_process")
const CWD=process. cwd()+"/"

function startServer(){
    return child_process.spawn(`node`,[`${process.cwd()}/index.js`], {
        cwd: process.cwd(),
        
        detached : false,
        stdio: "inherit"
    });
}

var mainchild=startServer()

   

// FS EVENTS 
const fsevents = require('fsevents'); 
const stop = fsevents.watch(CWD, (path, flags, id) => {
  const info = fsevents.getInfo(path, flags, id);
  if (!info?.path?.toLowerCase().includes("temp") ){
    if (info?.path?.toLowerCase().endsWith(".js") || info?.path?.toLowerCase().endsWith(".html")) {
      console.log("Restarting server")
      mainchild.kill();
      mainchild=startServer()  
       
   // mainchild.kill()
      
     
    }
  }   
  
});