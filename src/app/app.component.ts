import { Component, ViewChild } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
// import { OneSignal } from '@ionic-native/onesignal';

import { NavController } from "ionic-angular";
import { MenuController } from "ionic-angular";

import { TabsPage } from '../pages/tabs/tabs';
import { ExpensesPage } from '../pages/expenses/expenses';

import { ExpensesService } from "../services/expenses";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = ExpensesPage;
  tabsPage = TabsPage;
  // private appID: string = '26597b63-2542-4823-9ad8-690df1468ee6';
  // private googleProjectNumber: string = '650821978280'; //also known as Sender ID
  @ViewChild('nav') nav: NavController;

  constructor(
    public platform: Platform,
    public menuCtrl: MenuController,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public expensesService: ExpensesService,
    // public notification: OneSignal
  ) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
      // OneSignal Code start:
      // Enable to debug issues:
      // window["plugins"].OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});

      // var notificationOpenedCallback = function (jsonData) {
      //   console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
      // };

      // window["plugins"].OneSignal
      //   .startInit(this.appID, this.googleProjectNumber)
      //   .handleNotificationOpened(notificationOpenedCallback)
      //   .endInit();
    });
  }

  onLoad(page: any) {
    this.nav.setRoot(page);
    this.menuCtrl.close();
  }

}

