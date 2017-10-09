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
import { BudgetPage } from "../pages/budget/budget";
import { ExpensesPage } from "../pages/expenses/expenses";
import { MonthsPage } from "../pages/months/months";
import { DaysPage } from "../pages/days/days";
import { DayPage } from "../pages/day/day";
import { NewExpensesPage } from "../pages/new-expenses/new-expenses";
import { MonthStatisticPage } from "../pages/month-statistic/month-statistic";
import { RangeStatisticPage } from "../pages/range-statistic/range-statistic";
import { CategoriesPage } from "../pages/categories/categories";
import { EditCategoryPage } from "../pages/edit-category/edit-category";
import { ShoppingListPage } from "../pages/shopping-list/shopping-list";
import { ReceiptsPage } from "../pages/receipts/receipts";
import { NewReceiptPage } from "../pages/new-receipt/new-receipt";
import { StatisticByCategoryPage } from "../pages/statistic-by-category/statistic-by-category";
import { RangeStatisticByCategoryPage } from "../pages/range-statistic-by-category/range-statistic-by-category";

import { ExpensesService } from "../services/expenses";
import { LoaderComponent } from "../components/loader/loader";

import { ColorPickerModule } from 'ngx-color-picker';
import { DatePickerModule } from 'ionic3-datepicker';
import { Camera } from '@ionic-native/camera';
import { PhotoViewer } from '@ionic-native/photo-viewer';
// import { OneSignal } from '@ionic-native/onesignal';

@NgModule({
  declarations: [
    //Pages:
    MyApp,
    TabsPage,
    StatisticsPage,
    BudgetPage,
    ExpensesPage,
    MonthsPage,
    DaysPage,
    DayPage,
    NewExpensesPage,
    MonthStatisticPage,
    RangeStatisticPage,
    CategoriesPage,
    EditCategoryPage,
    ShoppingListPage,
    ReceiptsPage,
    NewReceiptPage,
    StatisticByCategoryPage,
    RangeStatisticByCategoryPage,
    //Components:
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(config),
    AngularFireDatabaseModule,
    ColorPickerModule,
    DatePickerModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    StatisticsPage,
    BudgetPage,
    ExpensesPage,
    MonthsPage,
    DaysPage,
    DayPage,
    NewExpensesPage,
    MonthStatisticPage,
    RangeStatisticPage,
    CategoriesPage,
    EditCategoryPage,
    ShoppingListPage,
    ReceiptsPage,
    NewReceiptPage,
    StatisticByCategoryPage,
    RangeStatisticByCategoryPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ExpensesService,
    Camera,
    PhotoViewer,
    // OneSignal
  ]
})
export class AppModule {}
