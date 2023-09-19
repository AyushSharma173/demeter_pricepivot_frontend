import { AppRegistry ,Alert} from "react-native";
import Links from "Links"
import './index.css';
//@ts-ignore
global.__DEV__=!process.env.NODE_ENV || process.env.NODE_ENV === 'development'
AppRegistry.registerComponent("App", () =>Links);
AppRegistry.runApplication("App", {
  rootTag: document.getElementById("root")
 });
Alert.alert=(title,message,buttons)=>{
  if (!buttons ){
  alert(title+"\n"+message)
  }
  else {
    
   let val=window.confirm(message)
   if ( val)
   buttons.find(x=>["Yes","Ok"].includes(x.text!))?.onPress?.apply(this)
   else 
   buttons.find(x=>x.text=="No")?.onPress?.apply(this)
   
  }
}
Alert.prompt=(title,message,buttons)=>{

  let r=prompt(title+"\n"+message)
  if (!r){
    (buttons as Array<any>).find(x=>x.text=="No")?.onPress?.apply(this)
  }
  else {
   let o= (buttons as Array<any>).find(x=>["Yes","Ok"].includes(x.text!))?.onPress
   if (o)
   o(r)
  }
}
