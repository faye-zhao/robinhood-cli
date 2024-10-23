var Robinhood = require('robinhood')({
    //username: 'amulet',
    password: 'qwert12345',
    username: 'fzhire@gmail.com',
}, (err, data) => {
    if(err) {
        console.log('AAA', err);
    } else {
        console.log('BBB', data.mfa_required, data)
        if (data && data.mfa_required) {
            const mfa_code = '304304'; // set mfa_code here

            Robinhood.set_mfa_code(mfa_code, () => {
                console.log(Robinhood.auth_token());
            });
        } else {
            console.log(Robinhood.auth_token());
        }
    }
});