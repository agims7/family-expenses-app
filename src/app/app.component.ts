import { Component, ViewChild } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NavController, MenuController, AlertController } from "ionic-angular";
import { AngularFireDatabase } from 'angularfire2/database';
import { TabsPage } from "../pages/tabs/tabs";
import { LoginPage } from "../pages/login/login";
import { RegisterPage } from "../pages/register/register";
import { StatisticsPage } from '../pages/statistics/statistics';
import { AuthService } from "../services/auth";
import { ExpensesService } from "../services/expenses";

import firebase from 'firebase';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = TabsPage;
  tabsPage = TabsPage;
  // loginPage = LoginPage;
  // registerPage = RegisterPage;
  @ViewChild('nav') nav: NavController;
  constructor(
    public platform: Platform,
    public menuCtrl: MenuController,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public expensesService: ExpensesService,
    public alertCtrl: AlertController,
    public authService: AuthService,
    public database: AngularFireDatabase,
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
    });
  }

}

