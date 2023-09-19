import { configureCore } from "core/core";
import { APP_SCREEN_NAME } from "core/navhelper";
import { Navigation } from "react-native-navigation";
import { SENSITIVE } from "res/constants";
import env from "res/env";
import DefaultOptions from 'res/themes/DefaultOptions';
import BottomBar from "src/components/BottomBar";
import ReduxStore from "src/models/ReduxStore";
import { registerScreens } from 'src/ScreenRegistry';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Text, TextInput } from "react-native";
// Override Text scaling
if (Text.defaultProps) {
  Text.defaultProps.allowFontScaling = false;
} else {
  Text.defaultProps = {};
  Text.defaultProps.allowFontScaling = false;
}

// Override Text scaling in input fields
if (TextInput.defaultProps) {
  TextInput.defaultProps.allowFontScaling = false;
} else {
  TextInput.defaultProps = {};
  TextInput.defaultProps.allowFontScaling = false;
}
GoogleSignin.configure();
const orginalLogFunction= console.log
// console.log=(...args)=>{
//   if (env.logLevel=="protected"  && args[0]==SENSITIVE){
//     return
//   }
  
//   if (env.logLevel!="none")
//   {
//     orginalLogFunction(...args)
//   }


// }

configureCore({
  BottomBarComponent:BottomBar,
  initializerScreenName:"portal",
  defaultReduxValue: new ReduxStore(),
  resumableScreens:['AdminWelcomeScreen']
})
registerScreens();

Navigation.setDefaultOptions(DefaultOptions)

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              name: APP_SCREEN_NAME,
              id:   APP_SCREEN_NAME,
            }
          }
        ]
      }
    }
  });
});
function App(){
  return null;
}
export default App;
