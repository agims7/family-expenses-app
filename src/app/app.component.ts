import { Component, ViewChild } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { NavController } from "ionic-angular";
import { MenuController } from "ionic-angular";

import { TabsPage } from '../pages/tabs/tabs';
import { ExpensesPage } from '../pages/expenses/expenses';

import { ExpensesService } from "../services/expenses";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = ExpensesPage;
  tabsPage = TabsPage;
  @ViewChild('nav') nav: NavController;

  constructor(
    platform: Platform, 
    private menuCtrl: MenuController, 
    statusBar: StatusBar, 
    splashScreen: SplashScreen,
    public expensesService: ExpensesService,
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  onLoad(page: any) {
    this.nav.setRoot(page);
    this.menuCtrl.close();
  }

}

