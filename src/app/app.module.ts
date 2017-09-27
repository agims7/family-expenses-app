import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';

import { config } from './firebase.credentials';

import { MyApp } from './app.component';
import { TabsPage } from '../pages/tabs/tabs';
import { StatisticsPage } from "../pages/statistics/statistics";
import { ExpensesPage } from "../pages/expenses/expenses";
import { DaysPage } from "../pages/days/days";
import { DayPage } from "../pages/day/day";
import { NewExpensesPage } from "../pages/new-expenses/new-expenses";
import { MonthStatisticPage } from "../pages/month-statistic/month-statistic";
import { CategoriesPage } from "../pages/categories/categories";
import { EditCategoryPage } from "../pages/edit-category/edit-category";
import { ShoppingListPage } from "../pages/shopping-list/shopping-list";

import { ExpensesService } from "../services/expenses";

import { ColorPickerModule } from 'ngx-color-picker';

@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    StatisticsPage,
    ExpensesPage,
    DaysPage,
    DayPage,
    NewExpensesPage,
    MonthStatisticPage,
    CategoriesPage,
    EditCategoryPage,
    ShoppingListPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(config),
    AngularFireDatabaseModule,
    ColorPickerModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    StatisticsPage,
    ExpensesPage,
    DaysPage,
    DayPage,
    NewExpensesPage,
    MonthStatisticPage,
    CategoriesPage,
    EditCategoryPage,
    ShoppingListPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ExpensesService,
  ]
})
export class AppModule {}
