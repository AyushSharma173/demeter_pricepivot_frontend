import appleAuth, { AppleRequestResponse } from "@invertase/react-native-apple-authentication"
import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin"
// import { LoginManager,GraphRequest, GraphRequestManager } from "react-native-fbsdk";
import clientStorage from "./clientStorage"


interface IUniversalResponse {
    externalId: string
    source: "apple" | "facebook" | "google"
    email: string,
    fullName?: string
}
export interface ISocialLogin {
    (): Promise<IUniversalResponse | undefined>
}

export const AppleLogin: ISocialLogin = () => {
    return new Promise(async (r, rj) => {
        {
            var appleAuthRequestResponse: AppleRequestResponse | undefined = undefined
            try {
                // performs login request
                appleAuthRequestResponse = await appleAuth.performRequest({
                    requestedOperation: appleAuth.Operation.LOGIN,
                    // Note: it appears putting FULL_NAME first is important, see issue #293
                    requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
                });

                const { email, user, fullName } = appleAuthRequestResponse!

                var universalResponse: IUniversalResponse = { email: email || "", externalId: user, fullName: ((fullName?.givenName || "") + " " + (fullName?.familyName || "")).trim(), source: "apple" }
                if (!email) {
                    universalResponse = clientStorage.getItem(user) || universalResponse
                }
                else {
                    clientStorage.saveItem(user, universalResponse)
                }
                r(universalResponse)
            }
            catch (e: any) {
                if (e?.code == 1001) {
                    console.log("Cancelled")
                    r(undefined)
                    return;
                }
                console.log("appleAuth.performRequestError", typeof e, Object.keys(e), e)
                rj(e)
            }
        }
    })
}


export const GoogleLogin:ISocialLogin=()=>{
    return new Promise(async (r, rj) => {

    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      let res:IUniversalResponse={
        externalId:userInfo.user.id, 
        email:userInfo.user.email,
        fullName:userInfo.user.name  || ((userInfo.user.givenName || "") + " " + (userInfo.user.familyName || "")).trim()  ,
        source:"google",
        }
        r(res)
    } catch (error:any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
          console.log("Sign in cancel")
          r(undefined)
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
          console.log("Progress")
          r(undefined)
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        console.log("Play",error)
        rj(error)
      } else {
        // some other error happened
        console.log("Other",error)
        rj(error)
      }
    }
  
    })
}

export const FBLogin:ISocialLogin=()=>{
    // return new Promise((r,rj)=>{
    //         LoginManager.logInWithPermissions(["email"]).then(
    //             function(result) {
    //               if (result.isCancelled) {
    //                 console.log("Login cancelled");
    //                 r(undefined);
    //               } if (result.declinedPermissions?.length){
    //                     rj({ message:"Permission denied",...result})
    //               }
    //                else {
    //                 console.log(
    //                   "Login success with permissions: " +
    //                     result.grantedPermissions?.toString()
    //                 );
                    
    //            let req=     new GraphRequest('/me', {
    //                   httpMethod: 'GET',
    //                   version: 'v2.5',
    //                   parameters: {
    //                       'fields': {
    //                           'string' : 'email,name'
    //                       }
    //                   }
    //               }, (err, res) => {
    //                   console.log(err, res);
    //                   const {name,email,id}=res as any
    //                   if (!email)
    //                   err={message:"email not found"};
    //                   err ? rj(err): r({email,fullName:name,externalId:id,source:"facebook"})
    //               });
    //               new GraphRequestManager().addRequest(req).start();
    //             }
        
                  
    //             },
    //             function(error) {
    //               console.log("Login fail with error: " + error);
    //             }
    //           );
    // })
}