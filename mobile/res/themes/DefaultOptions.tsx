import { Options } from "react-native-navigation"
import launch_Background_jpg from "res/img/launch_Background.jpg"
const DefaultOptions: Options = {
    topBar: {
        visible: false
    },
    animations:{
        setRoot:{
            waitForRender:true,
            alpha: {
                from: 0,
                to: 1,
                duration: 400,
      
              }
            
        },
        push:{
            waitForRender:true
        }
    },
    backgroundImage:launch_Background_jpg,
    bottomTabs:{
        visible:false
    },
    statusBar:{
        style: "dark",
        backgroundColor:'rgba(0,0,0,0)',
        drawBehind:true
    },
    layout:{
        orientation:['portrait']
    }
}

export default DefaultOptions