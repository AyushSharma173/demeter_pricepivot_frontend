/**
 * This is the email template file which contains content for emails 
 * sent through the system.
 * The format is simple can be updated on any text editor
 */
const EmailTemplates={
version:3,

MASTER_LAYOUT:
`<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>$title</title>
    <style>
    body{
        width: 100%;
        height: 100%;
        background-color:white;
        font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-style: normal;
        
    }
    .layout{
        width:100%; max-width:600px; margin:0 auto;
    }
    .header{
        background-color: #b1d5bc; text-align:center; padding:10px 0; width: 100%;
    }
    .message{
        padding:20px;
    }
    .hr{
        width:100%; max-width:600px; margin:0 auto;

    }
    .button {
        border-radius: 2px;
        padding: 8px 12px;
        border: 1px solid #ED2939;
        border-radius: 2px;
        font-family: Helvetica, Arial, sans-serif;
        font-size: 14px;
        color: black; 
        text-decoration: none;
        display: inline-block;  
        background-color: #b1d5bc;
    }
    </style>
</head>
<body>
    <table class="layout">
    <tr >
        <td class="header"><h2>$title</h2></td>
    </tr>
    <tr>
        <td class="message">
        <p>$message</p>
        </td>
    </tr>
    </table>
    <hr class="hr">
    <p class="layout" style="margin-top: 7px;">This is an auto-generated notification. Please do not reply to this email. For further details please visit https://thegameonapp.com</p>
    <footer class="layout" style="margin-top: 25px;">
    <p>&#169 $year Game On! | All rights reserved</p>
    </footer>
</body>
</html>
`
,

NEW_BOOKING:
`New Booking
A new client has booked you:<br>
Client: $name<br><br>

To interact with the client, goto portal and see clients section.<br>
https://web.thegameonapp.com
`
,

BOOKING_CANCELED:
`Booking Canceled
A client has canceled booking with you:<br>
Client: $name<br><br>

To see more details visit:<br>
https://web.thegameonapp.com
`
,

MEETING_SCHEDULED:
`Meeting: $pTime $timezone
A new meeting has been scheduled. Here are the details:<br>
$title: $name<br>
Time: $pTime $timezone<br><br>

To manage this appointment, $details
`
,

MEETING_CANCELED:
`Meeting Canceled: $pTime
This is to inform you that the meeting has been cancelled. Here are the details:
<br>
$title: $name<br>
Time: $pTime<br>
`
,

RESET_PASSWORD:
`Reset Password
Please use the link below to reset your password:
<br>
<a href='$link'>Reset Password</a>
<br>
This link will expire soon.
`
,

EMAIL_VERIFICATION:
`Email Verification
Please use the link below to confirm your email:
<br>
$link
<br>
This link will expire soon.
`

,
EMAIL_VERIFICATION_USER:
`Welcome to TheGameOnApp!
We’re delighted to have you join us. TheGameOnApp connects you with mental performance coaches and counselors with the right professional and personal experiences to provide the best help possible.<br/> <br/>
Please confirm your email by clicking the “Confirm Email” button or the link below:
<br/>
<div style="width:100%;display:flex;flex-direction:column;align-items:center">
<a href="$link" 
class="button"
>Confirm Email 
</a>
or
<a href="$link">Click here to verify</a>
</div>
<br/>
Best wishes,<br/>
TheGameOnApp Team
`
,
ON_BUY:
`Thank you for trusting us!
We have received your payment and we’re excited to have you on this journey.<br/>
TheGameOnApp is dedicated to availing you of the highest-quality service provided by the finest
mental wellness expert in the United States.<br/><br/>
You may now book a session with any of the seasoned counselors and wellness coaches on our
platform. They’re here to help you become the best version of your personal and professional self.<br/><br/>
Remember, even when it seems like the chips are down, it’s never game over, but Game On!<br/><br/>
Best,<br/><br/>
Lories Khoury<br/><br/>
Founder/CEO
`,

UPCOMING_MEETING:
`Meeting: $pTime $timezone
You have an upcoming meeting. Here are the details:<br>
$title: $name<br>
Time: $pTime $timezone<br><br>

To manage this appointment, $details
`
,

TRIAL_COMPLETED:
`We’ve missed you!
Hi $customerName,<br/>
<br/>
We noticed you haven’t bought a subscription plan yet. What seems to be the problem? 
<br/> <br/>
Remember that we’re here to help you, no matter what. Our counselors and wellness coaches are some of the best in the country and they’d be delighted to help you become the best version of yourself.
<br/> <br/>
If you’ve been trying but are unable to pay for a subscription, feel free to contact our support team for assistance. We look forward to hearing from you!
<br/> <br/>
Best wishes,
<br/> <br/>
TheGameOnApp Team.

`
,

}
export default EmailTemplates