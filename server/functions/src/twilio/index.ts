import * as functions from "firebase-functions";
import env from "../../env";
import { Endpoint, IHttpError, IsBadRequest } from "../commons";
const twilio = require('twilio');
const AccessToken = twilio.jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;

export const getToken =Endpoint<{to:string},{room_type:string,token:string}>(async (params)=>{


    let {to}=params
    let from =params.token?.email

   //  if (IsBadRequest({from,to},res))
  //  return;
    const token = new AccessToken(
        env.TWILIO_ACCOUNT_SID,
        env.TWILIO_API_KEY,
        env.TWILIO_API_SECRET
      );
    let room=[from,to].sort().join()
      // Assign identity to the token
      token.identity = from 

      // Grant the access token Twilio Video capabilities
      const grant = new VideoGrant();
      grant.room = room;
      token.addGrant(grant);
    
      const accountSid = env.TWILIO_ACCOUNT_SID;
      const authToken =env.TWILIO_AUTH_TOKEN;
      const client = twilio(accountSid, authToken);
      let rooms=await client.video.v1.rooms
      .list({
         uniqueName: room,
        // status: 'completed',
       //  limit: 20
       })
       let response={room_type:'go',token:token.toJwt()}
        if (rooms.length){
            functions.logger.info("Already exists!",rooms)
            return response
        }
        else 
        {
          try {
               await  client.video.v1.rooms.create({uniqueName:room})
               return response
          }
          catch(e){
              let error:IHttpError={status_code:500,message:e as any}
               return error
            }

          
        }
   
                    

      // Serialize the token to a JWT string
      

      return null as any


})