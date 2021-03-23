/**
 * Created by gmena on 08-17-17.
 */

const FORMS = {
    login_user: {
        inputs: [{
            type: 'text',
            placeholder: "Public Key",
            autoComplete: 'nope',
            name: "public",
            size: 'm12 l12',
            required: true
        }],
        buttons: [{
            type: 'submit',
            text: 'login',
            size: 'm6 l6'
        }]
    }
};

//Export forms
export default FORMS;