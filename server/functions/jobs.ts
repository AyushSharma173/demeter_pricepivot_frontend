import * as functions from "firebase-functions";
import moment = require("moment");
import { Endpoint, TestEmails, getRef, getVal } from "./src/commons";
import { sendTemplateEmail } from "./src/commons/mailer";
import types from "./src/commons/refGlobalTypes"
import EmailTemplates from "./src/runtime_constants/EmailTemplates";
import StateTimeZone from "./src/runtime_constants/StateTimeZone";


const upcomingMeetingNotifications = functions.pubsub
  .schedule("every 5 minutes")
  .onRun((context) => {
    functions.logger.debug(
      "-------------------------> pubsub is running",
      moment().format("hh:mm a")
    );
    sendUpcomingMeetingNotifications();
  });

const freeTrailFollowUp = functions.pubsub
  .schedule("every 10 minutes")
  .onRun((context) => {
    functions.logger.debug(
      "------------------------->sendNotificationToTrialUsers pubsub is running",
      moment().format("hh:mm a")
    );
    sendNotificationToTrialUsers();
  });

export const _sendNotificationToTrialUsers = Endpoint<void,void>(() => {
  sendNotificationToTrialUsers();
});

export const _sendUpcomingMeetingNotifications = Endpoint<void,void>(() => {
  sendUpcomingMeetingNotifications();
});

async function sendUpcomingMeetingNotifications() {
  functions.logger.info(
    ">>>>>>>>>>>>>>>>>> job running",
    "time",
    moment().format("hh:mm a")
  );
  let startDateTimeSeconds =
    moment.utc(moment().add(1, "hour").subtract(1, "minute")).valueOf() / 1000;
  let endDateTimeSeconds =
    moment.utc(moment().add(2, "hour").subtract(1, "minute")).valueOf() / 1000;

  var upcomingMeetings: {
    providerEmail: string;
    userEmail: string;
    time_secs: number;
  }[] = await getUpcomingMeetings(startDateTimeSeconds, endDateTimeSeconds);
  functions.logger.info(">>>resp", upcomingMeetings);
  for (let meeting of upcomingMeetings) {
    let user: types.IUser = await getVal("users", meeting.userEmail);
    let provider: types.IProvider = await getVal(
      "providers",
      meeting.providerEmail
    );
    functions.logger.info(
      ">>>pro",
      meeting.providerEmail,
      user.full_name,
      moment(meeting.time_secs * 1000).format("hh:mm a")
    );
    sendMeetingReminder(
      meeting.providerEmail,
      user.full_name!,
      meeting.time_secs * 1000,
      provider.timezone!,
      true
    );
    sendMeetingReminder(
      meeting.userEmail,
      provider.name,
      meeting.time_secs * 1000,
      user.timezone! || StateTimeZone[user.state! as any] || "US/Central",
      false
    );
  }
}

async function getUpcomingMeetings(
  startDateTimeSeconds: number,
  endDateTimeSeconds: number
) {
  let snapshots = await getRef("bookings")
    .orderByChild("canceled_on")
    .equalTo(null)
    .once("value");

  let upcomingMeeting: {
    providerEmail: string;
    userEmail: string;
    time_secs: number;
  }[] = [];

  snapshots.forEach((childSnapshot) => {
    let booking = childSnapshot.val();
    if (booking.meetings) {
      Object.keys(booking.meetings || {}).forEach((key: any) => {
        functions.logger.debug(
          "=============== meeting",
          booking.meetings[key].is_completed,
          moment(booking.meetings[key].time_secs * 1000).format("hh:mm a")
        );
        if (
          !booking.meetings[key].is_completed &&
          booking.meetings[key].time_secs >= startDateTimeSeconds &&
          booking.meetings[key].time_secs <= endDateTimeSeconds
        ) {
          upcomingMeeting.push({
            providerEmail: booking.provider_email,
            userEmail: booking.user_email,
            time_secs: booking.meetings[key].time_secs,
          });
        }
      });
    }
  });

  return upcomingMeeting;
}

function sendMeetingReminder(
  email: string,
  name: string,
  dateTimeUTC: number,
  timezone: string,
  is_provider: boolean
) {
  const localTime = moment.utc(dateTimeUTC).tz(timezone!);

  const pTime = localTime.format("dddd, MMMM D,* hh:mm a").replace("*", "by");

  const title = is_provider ? "Client" : "Professional";
  const details = is_provider
    ? `visit portal and see appointments section.<br>
    https://thegameonapp.com/portal`
    : `visit GameOn! mobile application.`;

  if(TestEmails.USERS.includes(email) || TestEmails.PROVIDERS.includes(email)){
    sendTemplateEmail(
      [email],
      EmailTemplates.UPCOMING_MEETING,
      { pTime, timezone, title, name, details },
      undefined,
      true
    );
  }  
}

async function sendNotificationToTrialUsers() {
  let lastNdays = moment.utc(moment().subtract(3, "days")).valueOf() / 1000;
  functions.logger.debug("------------- sendNotificationToTrialUsers", lastNdays, moment(lastNdays * 1000).format("YYYY-MM-DD hh:mm a"))
    
  let users: { [userId:string]:  types.IUser} = (
    await getRef("users")
      .orderByChild("sub_status")
      .equalTo("trial_completed")
      .once("value")
  ).val();

  for (var userId of Object.keys(users)) {
    //@ts-ignore
    if (users[userId].bookingId) {
      //@ts-ignore
      let meeting:any[] = Object.values((await getRef("bookings", users[userId].bookingId, "meetings")
          .orderByKey()
          .limitToLast(1)
          .once("value")
      ).val());

      if(meeting && meeting[0] && meeting[0].time_secs && meeting[0].time_secs > lastNdays){
        
        functions.logger.debug(">>>>>>>>>>>> sending free trial followup email", users[userId].full_name, users[userId].full_name, moment(meeting[0].time_secs * 1000).format("hh:mm a"), meeting[0]);
        
        if(TestEmails.USERS.includes(users[userId].email)){
        
          sendTemplateEmail([users[userId].email],
            EmailTemplates.TRIAL_COMPLETED,
            { customerName:  users[userId].full_name},
            undefined,
            true
          );
        }        
      }else{
        functions.logger.debug("------------- not in lmit to free trial followup email", meeting[0], moment(meeting[0].time_secs * 1000).format("YYYY-MM-DD hh:mm a"))
      }
    }
    else{
      functions.logger.debug("------------- no booking")
    }
  }
}
