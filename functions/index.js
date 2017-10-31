var functions = require('firebase-functions');
var admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);
var wrotedata;

exports.triggerPush = functions.database.ref('/michal1dydo/{messageId}').onWrite((event) => {
    wrotedata = event.data.val();

    admin.database().ref('/michal1dydo/users').then((alltokens) => {
        var rawtokens = alltokens.val();
        var tokens = [];
        processtokens(rawtokens).then((processedtokens) => {

            for (var token of processedtokens) {
                tokens.push(token.token);
            }

            var payload = {

                "notification": {
                    "title": "From System",
                    "body": "Msg test",
                    "sound": "default",
                },
                "data": {
                    "sendername": 'JA',
                    "message": 'test message'
                }
            }
            return admin.messaging().sendToDevice(tokens, payload).then((response) => {
                console.log('Pushed notifications');
            }).catch((err) => {
                console.log(err);
            })
        })
    })
})

function processtokens(rawtokens) {
    var promise = new Promise((resolve, reject) => {
        var processedtokens = []
        for (var token in rawtokens) {
            processedtokens.push(rawtokens[token]);
        }
        resolve(processedtokens);
    })
    return promise;

}