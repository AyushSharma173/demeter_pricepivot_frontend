import React from 'react';
import logo from './logo.svg';
import './App.css';

import { IsValidPassword } from 'core/validators';
import { current } from '@reduxjs/toolkit';
import { parseTwoDigitYear } from 'moment';


const sections=[]
function ResetPassword() {

  let arr=[...Array(3)].map((_,i)=>i)
  return (
    <div className="App">
<div>
        <TopBar />
        <div style={{height:"64px"}} />
       <MainCard />
        
        <EmailUs/>
        <Footer />
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        {/* <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a> */}
</div>
    </div>
  );
}
function TopBar (){

  let sections=[]
  let bookmarks:any=["What_is_Game_On"]

  return (<div style={{position:"fixed",backdropFilter:"blur(8px)",zIndex:100,width:"100vw",height:"64px",backgroundColor:"rgb(244,254,233,0.85)",boxShadow:"0px 0px 10px 1px rgba(0,0,0,0.5)"}} >

<div style={{height:"100%",marginLeft:"64px",marginRight:"64px",flexDirection:"row",display:"flex",alignItems:"center",justifyContent:"space-between"}} >

<div style={{width:"100px"}}>
<img src={process.env.PUBLIC_URL+"favicon.ico"} style={{height:"44px",width:"44px",alignSelf:"center",display:"flex"}} className="App-logo" alt="logo" /> 
</div>
<div style={{width:"30vw",justifyContent:"space-between",display:"flex" }} >
{sections.map((s,i)=>{
  return (<span  key={s} style={{fontSize:"0.6em"}}><a style={{color:"rgb(39,66,77)",textDecoration:"none"}} href={"#"+(bookmarks[i] || (s.replace(/ /g,"_").replace("!","")))}> {s}</a></span>)
})}
</div>

<div style={{width:"100px",display:"flex"}}>
<span style={{color:"black",fontSize:"0.6em"}}><a href="#contact" style={{color:"rgb(39,66,77)",textDecoration:"none"}}>Game On!</a></span>
</div>

</div>
</div>



  )
}
const serialize = function(obj:any) {
    var str = [];
    for (var p in obj)
      if (obj.hasOwnProperty(p) && !!obj[p]) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    return str.join("&");
  }
function MainCard(){
  const params:any = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop as string),
  });
  // Get the value of "some_key" in eg "https://example.com/?some_key=some_value"
  let {email,otp,isProvider} = params

  async function handle(){
    //@ts-ignore
    let val1=document.getElementById("pass").value
    //@ts-ignore
    let val2=document.getElementById("cnfrm").value

    //@ts-ignore
    document.getElementById("error").innerText= '';

        if (!email || !otp)
        {
                  //@ts-ignore
        document.getElementById("error").innerText="This link is invalid"
        }
        else if (!val1 || !val2)
        {
        //@ts-ignore
        document.getElementById("error").innerText="No field should be empty"
        }
        else if (val1!=val2)
        {
                //@ts-ignore
       document.getElementById("error").innerText="Passwords must match!"
        }
        else if(IsValidPassword(val1))
        {
              //@ts-ignore
                document.getElementById("error").innerText=`Please enter a valid password. It must
                  ● be longer than 8 characters
                  ● contain at least 1 upper-case letter
                  ● contain at least 1 lower-case letter
                  ● contain at least one number.`
        }      
        else 
        {
            let x=env.serverURL+`changePassword/${email}/${otp}/${val1}`;
            console.log(x)
          let r:any=     await fetch(env.serverURL+`changePassword/${email}/${otp}?`+serialize(isProvider ? {password:val1,isProvider}:{password:val1}))
          //@ts-ignore
        document.getElementById("error").innerText="Password reset successfully!" 
       
          window.location.href="/response?"+serialize(await r.json())
        }

        

  }
  return (
    <div  style={{width:"100%",display:"flex",justifyContent:"center"}}>
  <div style={{width:"80vmin",height:"80vmin", backgroundColor:"green",backgroundSize:"cover",backgroundPosition:"center",marginTop:"64px",marginBottom:"64px", boxShadow:"0px 0px 10px 1px rgba(0,0,0,0.5)"}} >
    <div style={{position:"relative", height:"100%",width:"100%",backgroundColor:"rgba(255,255,255,0.9)",display:"flex",justifyContent:"center",alignItems:"center",flexDirection:"column"}}>
      <img src ={process.env.PUBLIC_URL+"AppFinal.png"}  style={{height:"100%",width:"100%"}}/>
      <div style={{position:"absolute",height:"100%",width:"100%",backgroundColor:'rgba(255,255,255,0.95)',alignItems:"center",justifyContent:'center',display:'flex',flexDirection:'column'}} >
     <img src={logo} style={{height:`${1.08*3}vmin`,position:'absolute',width:`${5.68*3}vmin`,alignSelf:"center",top:'2vh',display:"flex",marginBottom:"2vmin"}} className="App-logo" alt="logo" /> 
     <span style={{width:"100%",textAlign:"center",fontSize:"1em",fontFamily:"appFontBold",marginBottom:'1vh', color: undefined}}>Reset Password</span>
     <label id="error" style={{width:"41%",fontSize:"0.5em",fontFamily:"appFontBold",marginBottom:'2vh',color:"red"}}></label>  
    <label htmlFor="pass" style={{width:"41%",fontSize:"0.8em",fontFamily:"appFontBold"}}>New Password</label> 
    <input type={"password"} id="pass" style={{width:"40%",fontSize:"0.8em",fontFamily:"appFontBold",color:"black",marginBottom:"2vh",borderRadius:8}}></input>
   
    <label htmlFor="success" style={{width:"41%",fontSize:"0.8em",fontFamily:"appFontBold"}}></label> 
    <input type={"password"} id="cnfrm" style={{width:"40%",fontSize:"0.8em",fontFamily:"appFontBold",color:"black",borderRadius:8,marginBottom:"2vh"}}></input>
    <button type={"button"} id="go" onClick={handle} style={{width:"40%",fontSize:"0.8em",fontFamily:"appFontBold",color:"black",borderRadius:8}} >Set Password</button>
      </div>
    {/* <img src={logo} style={{height:208/2,width:1068/2,alignSelf:"center",display:"flex",marginBottom:"60px"}} className="App-logo" alt="logo" /> 
    <span style={{width:"40%",textAlign:"center"}}>Connecting Athletes to Mental Health Professionals at you fingertips.</span> */}
    </div>


  </div>
  </div>

  )
}

function Section({index,s}:any){
  return(<div  id={s.title.replace(/ /g,"_").replace("!","")}>
 
  <div  id={s.title.replace(/ /g,"_").replace("!","")} style={{width:"100vw",height:"60vh",backgroundColor:index%2==0 ?"#c5c6d055":"rgba(255,255,255,0.7)",display:"flex",justifyContent:"center",alignItems:"center"}}>

    <div style={{width:"90%",height:"80%",display:"flex",alignItems:"center",flexDirection: index%2==0 ? "row":"row-reverse" }}>
      <div style={{height:"100%",flex:0.75}} >
        <h2>{s.title}</h2>
        <span style={{fontSize:"0.8em"}}>{s.description}</span>

      </div>
      <div style={{height: "90%",flex:0.3,justifyContent:"center",alignItems:"center",display:"flex"}} >
          <img src={s.img}  style={{height:"300px",width:"300px",objectFit:"cover",marginRight:index%2==0 ? 0:"80px",borderRadius:24,
          boxShadow:"2px 2px 10px 1px black",
          border:"4px solid rgb(244,254,233)"
          }} />
      </div>

    </div>
  </div>
  </div>)
}

function Sponsers({index}:any){
  return(
  <div  style={{width:"100vw",height:"60vh",marginTop:"32px",flexDirection:"column",backgroundColor:"rgb(39,66,77,0.15)",display:"flex",alignItems:"center"}}>
 <span style={{color:"white",marginTop:"6vh",fontSize:"1.4em",fontFamily:"appFontBold"}}>Prospects</span>
 <span style={{color:"white",marginTop:"3vh",fontSize:"0.8em"}}>Our application will help following clients</span>
 <div style={{width:"60%", justifyContent:"space-between",display:"flex",marginTop:"10vh"}}>
  <img style={{height:"10vh"}} src={"https://asmi.org/wp-content/themes/kronos/assets/img/logo.svg"} />
  <img style={{height:"12vh"}} src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/IOC_Logo.svg/2341px-IOC_Logo.svg.png"/>
  <img style={{height:"10vh"}} src="https://www.nata.org/sites/default/files/nata_logo_final_blue.png"/>
 </div>
  </div>)
}


function SocialMedia({index}:any){
  return(
  <div id="contact" style={{width:"100vw",height:"40vh",marginTop:"32px",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
    <span style={{flex:0, whiteSpace:"nowrap",fontSize:"1.5em"}}>Connect with Us</span>
    <div style={{width:"25vw",marginTop:"5vh",height:"12vh",backgroundColor:"rgba(255,255,255,0.75)",borderRadius:25,display:"flex",alignItems:"center",justifyContent:"space-evenly",padding:"1vmin"}} >
    <img style={{backgroundColor:"rgb(39,66,77)", height:"5vmin",padding:"2vmin",width:"5vmin",borderRadius:25}} src={process.env.PUBLIC_URL+"svgs/icon-facebook.svg"} />
    <img style={{backgroundColor:"rgb(39,66,77)", height:"5vmin",padding:"2vmin",width:"5vmin",borderRadius:25}} src={process.env.PUBLIC_URL+"svgs/icon-instagram.svg"} />
    <img style={{backgroundColor:"rgb(39,66,77)", height:"5vmin",padding:"2vmin",width:"5vmin",borderRadius:25}} src={process.env.PUBLIC_URL+"svgs/icon-twitter.svg"} />
    <img style={{backgroundColor:"rgb(39,66,77)", height:"5vmin",padding:"2vmin",width:"5vmin",borderRadius:25}} src={process.env.PUBLIC_URL+"svgs/icon-linkedin.svg"} />
    </div>
 
  </div>)
}
function EmailUs({index}:any){
  return(
  <div  style={{width:"100vw",marginTop:"32px",marginBottom:"80px",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
    <span style={{flex:0, whiteSpace:"nowrap",fontSize:"1.5em"}}>Write to Us</span>
    <div style={{minWidth:"20vw",paddingLeft:"4vmax",paddingRight:"4vmax",marginTop:"2vh",height:"4vh",backgroundColor:"rgba(255,255,255,0.75)",borderRadius:25,display:"flex",alignItems:"center",justifyContent:"space-evenly",padding:"1vmax"}} >
      <p style={{fontSize:"3vmin"}}>info@gameonappllc.com</p>
    </div>
 
  </div>)
}

function Footer (){

       var currentDate = new Date();
       var currentYear = currentDate.getFullYear();
       
    
  return (<div style={{width:"100vw",height:"44px",backgroundColor:"white",display:"flex",justifyContent:"center",alignItems:"center",marginTop:"20px"}} >
<span style={{ fontSize:"0.5em"}} >Copyright (c) {currentYear} Game On! LLC</span>

  </div>

  )
}

export default ResetPassword
