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

import firebase from 'firebase';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = ExpensesPage;
  tabsPage = TabsPage;
  loginPage = LoginPage;
  registerPage = RegisterPage;
  @ViewChild('nav') nav: NavController;

  constructor(
    public platform: Platform,
    public menuCtrl: MenuController,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public expensesService: ExpensesService,
    public authService: AuthService
  ) {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.authService.isAuthenticated = true;
        this.rootPage = TabsPage;
      } else {
        this.authService.isAuthenticated = false;
        this.rootPage = LoginPage;
      }
    });
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  onLoad(page: any) {
    this.nav.setRoot(page);
    this.menuCtrl.close();
  }

  onLogout() {
    this.authService.logout();
    this.menuCtrl.close();
    this.nav.setRoot(LoginPage);
  }

}

