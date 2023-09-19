import env from "../../env";
import moment = require("moment");

const nodemailer = require("nodemailer");
import * as functions from "firebase-functions";
import EmailTemplates from "../runtime_constants/EmailTemplates";
const EMAIL_FROM= 'notset' 

let transporter = nodemailer.createTransport({
    host: "smtp.office365.com",  
    port: 587,
    secure: false,
    secureConnection: false, // TLS requires secureConnection to be false
    tls: {
        ciphers:'SSLv3'
    },
    requireTLS:true,
   
    debug: true,
    // host: "smtp-mail.outlook.com",
    // secureConnection: false, 
    // port: 587,
   // secure: false, // true for 465, false for other ports
//    tss:{
//     ciphers:'SSLv3'
//    } ,
   auth: {
      user: EMAIL_FROM, // generated ethereal user
      pass: 'notset', // generated ethereal password
    },
  });

var t2= nodemailer.createTransport({
    host: "smtpout.secureserver.net",  
    secure: true,
    secureConnection: false, // TLS requires secureConnection to be false
    tls: {
        ciphers:'SSLv3'
    },
    requireTLS:true,
    port: 465,
    debug: true,
    // host: "smtp-mail.outlook.com",
    // secureConnection: false, 
    // port: 587,
   // secure: false, // true for 465, false for other ports
//    tss:{
//     ciphers:'SSLv3'
//    } ,
   auth: {
      user: EMAIL_FROM, // generated ethereal user
      pass: 'Thelast1*', // generated ethereal password
    },
  });
/**html needs to be removed */
export async function sendMail(emails:Array<string>,subject:string,text:string,html?:string, attachments?: any){
    html = getEmailTemplate(subject, text);
    //functions.logger.info(html)
    return env.SEND_EMAILS &&  await transporter.sendMail({
        from: EMAIL_FROM, // sender address
        to: emails.join(", "), // list of receivers
        subject, // Subject line
        text,// plain text body
        html,
        attachments,
       // html: "<b>Hello world?</b>", // html body
      });
}

export function getEmailTemplate(title: string, message: string){
    let year = moment().year();
    return injectValues(EmailTemplates.MASTER_LAYOUT,{ title,message,year})
}

function injectValues(template:string,values:any){

   let output=template
   Object.keys(values).forEach(k=>{


    output=output.replace(new RegExp(`\\$${k}`,'g'),values[k])

   })

   return output

}
export async function sendTemplateEmail (emails:Array<string>,template:string,values:any,attachments?: any,sendCopy?:boolean){
 let i= template.indexOf('\n')
 let subject=injectValues (template.slice(0,i),values)
 let body=template.slice(i+1)
 let text=injectValues(body,values)
 sendCopy &&  sendMail(['sheharyar.fast@gmail.com'],subject+"<>"+emails[0],text,undefined,attachments)
 //functions.logger.info(">>",subject,text)
 return await sendMail(emails,subject,text,undefined,attachments)

}
