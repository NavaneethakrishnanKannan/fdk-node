
const connectTwillio = () => {
    try {
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        exports.client = require('twilio')(accountSid, authToken);
        console.log("Twillio Connection Completed")
    } catch (error) {
        console.log(error, "Twillio Connection Failed");
    }
}
connectTwillio();