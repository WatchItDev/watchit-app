/**
 * Created by gmena on 04-20-17.
 */
//Crypt helper
//import setting from 'backend/settings'
import oyVey from 'oy-vey';
import nodeMailer from 'nodemailer';

export default ({
    sendEmail: (module, data) => {
        const template = oyVey.renderTemplate(<module/>, data);
    }
})

