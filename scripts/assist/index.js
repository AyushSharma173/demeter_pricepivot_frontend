const { exec ,execSync} = require("child_process");
const express = require('express');
const { cwd } = require("process");
const bodyParser=require("body-parser")
const app = express()
var expressWs = require('express-ws')(app);
const fs=require("fs")
var jsonParser = bodyParser.json()
 
const port = 3006  

const SRC="~/Downloads/"
const DEST="~/Desktop/GameOn/mobile/res/svgs/"
const CWD=cwd()+"/"  

app.use(express.static("temp"))

app.get("/",(_,res)=>{
  let file=cwd()+ "/assist.html"
 // console.log(file)
  res.sendFile(file)
}) 

function toCLI(filename){
  return filename.replace(/ /g,"\\ ").replace(/!/g,"\\!").replace(/\(/g,"\\(").replace(/\)/g,"\\)")
}
var sub =""
// STEP 1
var svgs=[]
app.post('/zip', jsonParser,(req, res) => {
  const tempDir=CWD+'temp/'
  const filename=req.body.src.split("\\").slice(-1)[0]
   const unzipCommand=`unzip -o ${SRC+toCLI( filename)} -d ${tempDir}`
   console.log(unzipCommand)
  execSync(unzipCommand)
  console.log("Unzip success") 
  let subFolderName=fs.readdirSync(tempDir).filter(x=>!x.startsWith(".")) [0]
  sub=tempDir+ subFolderName
 console.log(sub)
 svgs=fs.readdirSync(sub).filter(x=>!x.startsWith("."))
console.log(svgs)

svgs.forEach(svg=>{

  console.log(sub+"/"+svg)
  let file=fs.readFileSync(sub+"/"+svg).toString().replace(/fill="#.*"/g,`fill="blue"`)
  fs.writeFileSync(sub+"/"+svg,file)
})

const fileNames={}
svgs.forEach(x=>fileNames[subFolderName+"/"+x]={})
  res.json(fileNames)
    
})

app.post("/process",jsonParser,(req,res)=>{


  const newSvgs= req.body
  svgs.forEach(svg=>{

    let file=fs.readFileSync(sub+"/"+svg).toString().replace(/fill="blue"/g,``)
    fs.writeFileSync(sub+"/"+svg,file)
  })
  svgs.forEach((svg,i)=>{
    const newSvg=newSvgs[i]
   const srcFile= toCLI(sub+"/"+svg)
   const dstFile=toCLI(DEST+newSvg)
   const cmd=`mv ${srcFile} ${dstFile}`
   execSync(cmd)

  })
  res.json({})

})
async function sleep(millis){    
  return new Promise((r)=>setTimeout(()=>r(),millis))
}
var opened=false
async function OpenIfNotOpened(){
  await sleep(2000)
  if (!opened)
  exec("open http://localhost:3006/")

}
var client=null
app.ws('/ws',async function(ws, req) {
  ws.on('message', function(msg) {
    console.log(msg);
    opened=true;
  });
 
  console.log('socket');
});
OpenIfNotOpened()

app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})
// exec("open assist.html", (error, stdout, stderr) => {
//     if (error) {
//         console.log(`error: ${error.message}`);
//         return;
//     } 
//     if (stderr) {
//         console.log(`stderr: ${stderr}`);
//         return;
//     }
//     console.log(`stdout: ${stdout}`);
// });

// FS EVENTS 
// const fsevents = require('fsevents'); 
// console.log(CWD)
// const stop = fsevents.watch(CWD, (path, flags, id) => {
//   const info = fsevents.getInfo(path, flags, id);
//   if (!info?.path?.toLowerCase().includes("temp") ){
//     if (info?.path?.toLowerCase().endsWith(".js")) {
//       console.log("Restarting server")
     
//       process.on("exit", function () {
//         console.log("Exited") 
     
//       });  
//       process.exit();  
//     }
//   }   
//   console.log(info)
// }); // To start observation
//stop(); 

// const fsevents = require('fsevents'); 
// const stop = fsevents.watch(CWD, (path, flags, id) => {
//   const info = fsevents.getInfo(path, flags, id);
//   if (!info?.path?.toLowerCase().includes("temp") ){
//     if (info?.path?.toLowerCase().endsWith(".html")) {
//       console.log("Reloading")
//       client && client.send("reload")
//    // mainchild.kill()
      
     
//     }
//   }   
  
// });
// console.log(CWD)