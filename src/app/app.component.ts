import { Component, ViewChild } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NavController, MenuController, AlertController } from "ionic-angular";
import { TabsPage } from "../pages/tabs/tabs";
import { LoginPage } from "../pages/login/login";
import { RegisterPage } from "../pages/register/register";
import { StatisticsPage } from '../pages/statistics/statistics';
import { AuthService } from "../services/auth";
import { ExpensesService } from "../services/expenses";
import { Push, PushObject, PushOptions } from '@ionic-native/push';

// import firebase from 'firebase';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = TabsPage;
  tabsPage = TabsPage;
  // loginPage = LoginPage;
  // registerPage = RegisterPage;
  @ViewChild('nav') nav: NavController;
  public message;

  constructor(
    public platform: Platform,
    public menuCtrl: MenuController,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public expensesService: ExpensesService,
    public alertCtrl: AlertController,
    public push: Push,
    // public authService: AuthService,
  ) {
    // firebase.auth().onAuthStateChanged(user => {
    //   console.log(user, 'user')
    //   if (user) {
    //     // this.getUserName(user);
    //     this.authService.isAuthenticated = true;
    //     this.rootPage = TabsPage
    //   } else {
    //     this.authService.isAuthenticated = false;
    //     this.expensesService.userName = null;
    //     this.rootPage = LoginPage;
    //   }
    // });
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
      this.pushsetup();
      // this.push.hasPermission()
      // .then((res: any) => {
    
      //   if (res.isEnabled) {
      //     console.log('We have permission to send push notifications');
      //     alert('We have permission to send push notifications');
      //   } else {
      //     console.log('We do not have permission to send push notifications');
      //     alert('We do not have permission to send push notifications');
      //   }
    
      // });
    });
  }
  
  pushsetup() {
    const options: PushOptions = {
      android: {
        vibrate: 'true',
        sound: 'true',
        forceShow: 'true'
      },
      ios: {
        alert: 'true',
        badge: true,
        sound: 'false'
      },
      windows: {}
    };

    const pushObject: PushObject = this.push.init(options);

    pushObject.on('notification').subscribe((notification: any) => {
      console.log('Received a notification', notification)
      if (notification.additionalData.foreground) {
        let youralert = this.alertCtrl.create({
          title: 'New Push notification',
          message: notification.message,
          buttons: [{
            text: 'Ignore',
            role: 'cancel'
          }, {
            text: 'View',
            handler: () => {
              //TODO: Your logic here
              this.nav.push(StatisticsPage);
            }
          }]
        });
        youralert.present();
      }
    });

    pushObject.on('registration').subscribe((registration: any) => {
      console.log('Device registered', registration);
    });

    pushObject.on('error').subscribe(error => {
      console.log('Error with Push plugin', error);
    });
  }

  getUserName(user) {
    let atPosition = user.email.search('@');
    this.expensesService.userName =  user.email.slice(0, atPosition);
    let specialChars = "!@#$^&%*()+=-[]\/{}|:<>?,.";
    for (let i = 0; i < specialChars.length; i++) {
      this.expensesService.userName = this.expensesService.userName .replace(new RegExp("\\" + specialChars[i], 'gi'), '');
    }
    console.log(this.expensesService.userName)
  }

}

