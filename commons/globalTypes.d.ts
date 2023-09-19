import Stripe from "stripe"


declare namespace types {
    export enum IErr_Code {
        USR_OR_PWD_INCORRECT = 1,
        TOKEN_MISSING=2
    }

    export type IError = { message: string, err_code?: IErr_Code }

    export interface IEndPoint<P, R> {
         (params: P) : Promise<R> 
         /** object identifier */
         __isEndpoint:boolean
         /**  */
         __path:string
         /** */
         __isAuthorized:boolean

    }

    export type ITokenConent = {
        email: string
        isProvider?:boolean
        isAdmin?:boolean
    }
    export type IAuthHeader = {
        authorization: `Bearer ${string}`
    }

    export interface ICloud {
        [key: string]: types.IEndPoint<any,any> | ICloud
    }
    export type IMyThreads={[toEmail:string]:{threadId:string,updatedAt_secs:number,last_msg:any}}
    export type ISub_Status='trial' | 'trial_completed' | 'app_canceled' | 'no_sub' | SubscriptionEnum
    export type IUser={
        email:string
        enc_password?: string
        full_name?:string
        details?:{[questionCode:string]:IAnswer},
        bookingId?:string
        threads?:IMyThreads,
        img?:any
        source?:"apple" | "google" | "facebook"
        contact?:string,
        verified?:boolean
        dob?:string,
        state?:string,
        canceledSubscription?:Stripe.Subscription
        created_on?:string,
        deleted?:boolean
        timezone?:string
        signed_on?:string
        sub_status?: ISub_Status
        sub_status_uat?:string
    }

    export type IUserAudit={
        full_name?:string
        img?: string
        verified_on?:number
        is_on_trial?: boolean
        deleted_on?:number
        created_on?:number,
        signed_on?:number,
        payment_on?: number,
        booked_on?: number,
        scheduled_on?: number,
        provider_email?: string,
    }

    export type IClientUser={
        email:string
        full_name?:string
        last_message?:string
        updatedAt_secs: number
        img?:any
        meetings?:Array<{dateTimeUTC:string}>
        threadId:string
    }

    export type IBamboo={
        email:string,
        status:"forwarded" | "approved" | "inactive"
        name:string,
        state:string
    }
    export type IProvider={
        email:string,
        title:string
        first_name:string
        last_name:string
        name:string
        rating?:number,
        start_time?:string,
        end_time?:string,
        weekends_disabled?:boolean
        img:any,
        primarySpecialty:string,
        otherSpecialties:Array<string>,
        total_sessions:number,
        location:string,
        desc:string
        feedbacks:Array<{text:string,by:string}>,
        threads?:IMyThreads
        deleted?:boolean
        verified?:boolean
        enc_password:string
        details?:{[questionCode:string]:IAnswer},
        state?:string,
        status?:'forwarded'|'approved' | "profile_completed" | "active" |"inactive"
        timezone?:string
        availability?:{ [key:string]: Array<string>}
        current_sessions: number
        current_msgs: number
    }
    export type IBooking={
        id?:string
        user_email:string,
        provider_email:string, 
        dateTime:string // UTC YYYY-MM-DD:HH:MM
        canceled_on?:string
        cancel_reason?:string
        meetings?:{[dateTimeUTC:string]:{} }
        meetingInvites?:{[dateTimeUTC:string]:{} }
        feedbackReceived?: boolean
    }
    export type IOTPs={
        [encodedContactEmail:string]:IOTP
    }
    export type IOTP={
       OTP:string, iat_secs:number 
    }
    export type IQuestions=Array<IQuestion>
    export type IQuestion={
         code:string
         text:string
         pastText?:string
         options:Array<IOptions>
         usePastFor?:IAnswer
         skipFor?:IAnswer
         maxSelections?:number
    }
    export type IAnswer={
        code : string // refers to question
        answer:Array<string> // can be code or custom text
    }
    export type IOptions={
        code:string,
        text:string,
        otherText?:string
        type?:"text"
    }

    export type SubscriptionEnum="incomplete" | "incomplete_expired" | "trialing" | "active"| "past_due" | "canceled" | "unpaid"
    export type IUserSchedule = {
        dateTimeUTC: string
    }
    /**
     * notes/provider_email/user_email/INote
     */
    export type INote={
        msg:string,
        time_secs: number
    }
    export type IAdmin={
        email:string,
        enc_password:string
    }
    /**
     * userCoupons/user_email/ICoupon
     */
    export type ICoupon={
        coupon:string,
        time_secs: number,
        verified: boolean
    }
    export type IAppMode='trial' | 'trial_completed' | 'active' | 'fault' | 'no_sub'
    export type ISubscription= {
        [email_encoded:string]:{ email:string,active:boolean}
    }
}

export default types;