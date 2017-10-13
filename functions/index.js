// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database. 
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// exports.datebaseEdit = functions.database.ref('/michal1dydo/shoppingItems/{pushId}')
// .onWrite(event => {
//   const items = event.data.val();

//   const payload = {
//     notification: {
//         title: "Hey",
//         body: "Your Order is on the Way!"
//     }};

//     const instanceId = 650821978280;

//     admin.messaging().sendToDevice(instanceId.FCM, payload)
//     .then(function (response) {
//         console.log("Successfully sent message:", response);
//     })
//     .catch(function (error) {
//         console.log("Error sending message:", error);
//     });

// });


// exports.shopperAlert = functions.database.ref('/S01/Orders/{pushId}')
// .onWrite(event => {

//     var eventSnapshot = event.data;
//     var customerEmail = eventSnapshot.child("orderedBy").val();
//     console.log(customerEmail);

//     const getInstanceIdPromise = admin.database().ref('S01/Customers/' + customerEmail + '/Token/').once('value');

//     return Promise.all([getInstanceIdPromise]).then(results => {
//         const instanceId = results[0].val();

//         const payload = {
//             notification: {
//                 title: "Hey",
//                 body: "Your Order is on the Way!"
//             }
//         };

//         admin.messaging().sendToDevice(instanceId.FCM, payload)
//             .then(function (response) {
//                 console.log("Successfully sent message:", response);
//             })
//             .catch(function (error) {
//                 console.log("Error sending message:", error);
//             });

//     });
// });

// exports.createClientAccount = functions.database
//     .ref('/michal1dydo').onWrite(event => {

//         return admin.auth().createUser({
//             uid: event.params.clientId,
//             email: event.data.val().email,
//             password: "123456789",
//             displayName: event.data.val().fullName
//         })
//             .catch(error => { console.log("Error creating new user:", error); });
//     });

// exports.sendPush = functions.database.ref('/michal1dydo').onWrite(event => {
//     let projectStateChanged = false;
//     let projectCreated = false;
//     let projectData = event.data.val();
//     if (!event.data.previous.exists()) {
//         projectCreated = true;
//     }
//     if (!projectCreated && event.data.changed()) {
//         projectStateChanged = true;
//     }
//     let msg = 'A project state was changed';
// 		if (projectCreated) {
// 			msg = `The following new project was added to the project: ${projectData.title}`;
// 		}
//     return loadUsers().then(users => {
//         let tokens = [];
//         for (let user of users) {
//             tokens.push(user.pushToken);
//         }
//         let payload = {
//             notification: {
//                 title: 'Firebase Notification',
//                 body: msg,
//                 sound: 'default',
//                 badge: '1'
//             }
//         };
//         return admin.messaging().sendToDevice(tokens, payload);
//     });
// });
// function loadUsers() {
//     let dbRef = admin.database().ref('/users');
//     let defer = new Promise((resolve, reject) => {
//         dbRef.once('value', (snap) => {
//             let data = snap.val();
//             let users = [];
//             for (var property in data) {
//                 users.push(data[property]);
//             }
//             resolve(users);
//         }, (err) => {
//             reject(err);
//         });
//     });
//     return defer;
// }

exports.fcmSend = functions.database.ref('/michal1dydo/{messageId}').onCreate(event => {
    const message = event.data.val()
    const userId = event.params.userId
    const payload = {
        notification: {
            title: message.title,
            body: message.body,
            icon: "https://placeimg.com/250/250/people"
        }
    };
    admin.database()
        .ref(`/fcmTokens/${userId}`)
        .once('value')
        .then(token => token.val())
        .then(userFcmToken => {
            return admin.messaging().sendToDevice(userFcmToken, payload)
        })
        .then(res => {
            console.log("Sent Successfully", res);
        })
        .catch(err => {
            console.log(err);
        });
});