import React, { useEffect } from "react";
import ReactDOM from "react-dom";

// To get going add this to ./web/src/public/index.html
// {/* <script
// id="appleScript"
// type="text/javascript"
// src="https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js"
// ></script> */}
import GoogleLogin from 'react-google-login';
const responseGoogle = (response) => {
    console.log("res",response);
  }
  
async function sleep(millis:number){
    return new Promise<void>(r=>{
        setTimeout(r,millis)
    })
}

async function waitForAppleCDN(){
    while(true){
        if (window.AppleID)
        return 
        console.log("AppleID not found, so waiting for 1000ms")
        await sleep(1000);
    }
}
export default function Continue() {


    async function onFocus(){
        await waitForAppleCDN()

        console.log("AppleID",window.AppleID)
        window.AppleID.auth.init({
            clientId:document.getElementById("clientId").value, // This is the service ID we created.
            scope: "name email", // To tell apple we want the user name and emails fields in the response it sends us.
            redirectURI:document.getElementById("redirectURI").value, // As registered along with our service ID
            state: "origin:web", // Any string of your choice that you may use for some logic. It's optional and you may omit it.
            usePopup: true, // Important if we want to capture the data apple sends on the client side.
          });

          console.log(new URLSearchParams(window.location.search).get("medium"))

          if (new URLSearchParams(window.location.search).get("medium")=='apple'){
            try {
            const response = await window.AppleID.auth.signIn();
            console.log(response)
            }
            catch(e){
                console.log(e)
            }
            
          }


    }

    useEffect(()=>{
        document.getElementById("go").onclick=onFocus
        // ReactDOM.render(   <GoogleLogin
        //     clientId="355125281566-91dbt5bmmcf1bmaiikrddqlg7ocfv9p0.apps.googleusercontent.com"
        //     buttonText="Login"
        //     onSuccess={responseGoogle}
        //     onFailure={responseGoogle}
        //     cookiePolicy={'single_host_origin'}
        
        //   />,document.getElementById('googleButton'))
    },[])
    return (<div style={{ height: '100vh',flexDirection:"column" ,display:"flex"}}>
   
        <h1>Continue</h1>
        <input id="clientId" defaultValue="com.gameonappllc.signin"></input>
        <input id="redirectURI" defaultValue=""></input>
        <input id="go" type={"button"} title="Go"/>

     <div id="googleButton" />
    </div >)
}