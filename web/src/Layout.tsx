import { useEffect } from "react";
import { ImageBackground } from "react-native";

import { Outlet } from "react-router-dom";
import {useNavigate} from 'react-router-dom'
import launch_Background_jpg from "res/img/launch_Background.jpg"
const Layout = () => {
   const navigate= useNavigate()

   useEffect(()=>{
   },[navigate])
  return (
<Outlet />

  );
};

export default Layout;
{/* <ImageBackground source={launch_Background_jpg} resizeMode="stretch" > 
      
 </ImageBackground> */}