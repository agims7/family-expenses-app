import { Component, ViewChild } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NavController, MenuController } from "ionic-angular";
import { TabsPage } from "../pages/tabs/tabs";
import { ExpensesPage } from '../pages/expenses/expenses';
import { LoginPage } from "../pages/login/login";
import { RegisterPage } from "../pages/register/register";
import { AuthService } from "../services/auth";
import { ExpensesService } from "../services/expenses";

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

  constructor(
    public platform: Platform,
    public menuCtrl: MenuController,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public expensesService: ExpensesService,
    // public authService: AuthService
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

  // getUserName(user) {
  //   let atPosition = user.email.search('@');
  //   this.expensesService.userName =  user.email.slice(0, atPosition);
  //   let specialChars = "!@#$^&%*()+=-[]\/{}|:<>?,.";
  //   for (let i = 0; i < specialChars.length; i++) {
  //     this.expensesService.userName = this.expensesService.userName .replace(new RegExp("\\" + specialChars[i], 'gi'), '');
  //   }
  //   console.log(this.expensesService.userName)
  // }

}

