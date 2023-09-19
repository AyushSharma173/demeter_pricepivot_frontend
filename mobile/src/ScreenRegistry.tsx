import { configureCore, connectCore } from "core/core";
import navhelper from "core/navhelper";
import EmergencyScreen from "./screens/EmergencyScreen";
import FinishSetupScreen from "./screens/FinishSetupScreen";
import Home from "./screens/consumer/tabs/Home"
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import SplashScreen from "./screens/SplashScreen";
import SubscriptionScreen from "./screens/SubscriptionScreen";
import WelcomeScreen from "./screens/WelcomeScreen";
import BottomBar from "./components/BottomBar";
import Chat from "./screens/consumer/tabs/Chat";
import Menu from "./screens/consumer/tabs/Menu";
import WebViewTest from "./WebViewTest";
import ManageSubscriptionsScreen from "./screens/consumer/tabs/Menu/ManageSubscriptionsScreen";
import StripeScreen from "./screens/consumer/tabs/Menu/ManageSubscriptionsScreen/StripeScreen";
import TwilioVideoCall from "./screens/consumer/tabs/Chat/TwilioVideoCall";
import ProfDetailsScreen from "./screens/consumer/ProfDetailsScreen";
import ProfFeedbacksScreen from "./screens/consumer/ProfFeedbacks";
import ScheduleCallScreen from "./screens/consumer/ScheduleCallScreen";
import ChatScreen from "./screens/ChatScreen";
import VerifyEmailScreen from "./screens/VerifyEmailScreen";
import ProfileScreen from "./screens/consumer/ProfileScreen";
import ResetPasswordScreen from "./screens/ResetPasswordScreen";
import SupportScreen from "./screens/consumer/SupportScreen";

import ProWelcomeScreen from "./screens/provider/ProWelcomeScreen";
import ProSignupScreen from "./screens/provider/ProSignupScreen";
import ProVerifyEmailScreen from "./screens/provider/ProVerifyEmailScreen";
import ProFinishSetupScreen from "./screens/provider/ProFinishSetupScreen";
import AwaitingVerificationScreen from "./screens/provider/AwaitingVerificationScreen";
import ProUpdateScreen from "./screens/provider/ProUpdateScreen";
import ProHome from "./screens/provider/ProTabs/ProHome";
import ProChat from "./screens/provider/ProTabs/ProChat";
import AvailabilityScreen from "./screens/provider/AvailabilityScreen";
import ProMenu from "./screens/provider/ProTabs/ProMenu/ProMenu";
import ProAppointments from "./screens/provider/ProTabs/ProAppointments";
import ProIndividualChat from "./screens/provider/ProTabs/ProChat/ProIndividualChat";
import ProClientInteraction from "./screens/provider/ProTabs/ProChat/ProClientInteraction";
import AdminWelcomeScreen from "./screens/admin/AdminWelcomeScreen";
import AdminHomeScreen from "./screens/admin/AdminHomeScreen";

import SubscriptionInfoScreen from "./screens/consumer/SubscriptionInfoScreen";
import QuestionaireInfoScreen from "./screens/consumer/QuestionaireInfoScreen";
import ProScheduleCallScreen from "./screens/provider/ProScheduleCallScreen";
import AppRatingScreen from "./screens/consumer/Ratings/AppRatingScreen";
import LiveAgentScreen from "./screens/consumer/tabs/Menu/LiveAgent/LiveAgentScreen";

export function registerScreens(){
 
navhelper.registerScreens({
    default:SplashScreen,//WebViewTest,
    portal:SplashScreen,
    WelcomeScreen,
    LoginScreen,
    SignupScreen,
    FinishSetupScreen,
    SubscriptionScreen,
    EmergencyScreen,
    Home,
    Chat,
    Menu,
    ManageSubscriptionsScreen,
    StripeScreen,
    TwilioVideoCall,
    ProfDetailsScreen,
    ProfFeedbacksScreen,
    ScheduleCallScreen,
    ChatScreen,
    VerifyEmailScreen,
    ProfileScreen,
    ResetPasswordScreen,
    SupportScreen,
    SubscriptionInfoScreen,
    QuestionaireInfoScreen,
    AppRatingScreen,
    LiveAgentScreen,

    //provider screens
    ProWelcomeScreen,
    ProSignupScreen,
    ProVerifyEmailScreen,
    ProFinishSetupScreen,
    AwaitingVerificationScreen,
    ProUpdateScreen,
    AvailabilityScreen,
    ProHome,
    ProChat,
    ProMenu,
    ProAppointments,
    ProIndividualChat,
    ProClientInteraction,
    ProScheduleCallScreen,
    
    //admin screens
    AdminWelcomeScreen,
    AdminHomeScreen

  },
  connectCore)
}