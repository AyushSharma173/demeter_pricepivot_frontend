const PROJECT_ID='project-id'
const DATABASE_URL=`https://${PROJECT_ID}-default-rtdb.firebaseio.com`
import SERVICE_ACCOUNT from  "./credentials/adminSDK"

const env_dev={
    NAME:"DEV",
    SELF_URL:`http://localhost:5001/${PROJECT_ID}/us-central1`,
    
    WEBSITE:"http://localhost:3000",

    DATABASE_URL,
    SERVICE_ACCOUNT,
    
    STRIPE_SECRET_KEY:"sk_test_not_set",
    STRIPE_TEST_KEY:"sk_test_not_set",
    
    TWILIO_ACCOUNT_SID:"not_set",
    TWILIO_API_KEY :"not_set",
    TWILIO_API_SECRET: "not_set",
    TWILIO_AUTH_TOKEN: "not_set",

    JWT_SECRET:"FJDNBDFNBDFKBMFKDMBKDFMB",
    EXPIRATION:"365d",

    SALT:4,

    WAIT_BEFORE_RESEND_SECS:1*60, // 1 MIN
    OTP_EXPIRE_SECS:30*60, //30 MINS

    SEND_EMAILS:true
}
export default env_dev