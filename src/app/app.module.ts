import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Camera } from '@ionic-native/camera';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Push } from '@ionic-native/push';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { DatePickerModule } from 'ionic3-datepicker';
import { ColorPickerModule } from 'ngx-color-picker';

import { LoaderComponent } from '../components/loader/loader';
import { BudgetPage } from '../pages/budget/budget';
import { CategoriesPage } from '../pages/categories/categories';
import { DayPage } from '../pages/day/day';
import { DaysPage } from '../pages/days/days';
import { EditCategoryPage } from '../pages/edit-category/edit-category';
import { EditExpensePage } from '../pages/edit-expense/edit-expense';
import { ExpensesPage } from '../pages/expenses/expenses';
import { MonthStatisticPage } from '../pages/month-statistic/month-statistic';
import { MonthsPage } from '../pages/months/months';
import { NewExpensesPage } from '../pages/new-expenses/new-expenses';
import { NewReceiptPage } from '../pages/new-receipt/new-receipt';
import { RangeStatisticByCategoryPage } from '../pages/range-statistic-by-category/range-statistic-by-category';
import { RangeStatisticPage } from '../pages/range-statistic/range-statistic';
import { ReceiptsPage } from '../pages/receipts/receipts';
import { ShoppingListPage } from '../pages/shopping-list/shopping-list';
import { StatisticByCategoryPage } from '../pages/statistic-by-category/statistic-by-category';
import { StatisticsPage } from '../pages/statistics/statistics';
import { TabsPage } from '../pages/tabs/tabs';
import { RegisterPage } from '../pages/register/register';
import { LoginPage } from '../pages/login/login';
import { LogoutPage } from '../pages/logout/logout';
import { ExpensesService } from '../services/expenses';
import { AuthService } from '../services/auth';
import { MyApp } from './app.component';
import { config } from './firebase.credentials';


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
    EditExpensePage,
    ShoppingListPage,
    ReceiptsPage,
    NewReceiptPage,
    StatisticByCategoryPage,
    RangeStatisticByCategoryPage,
    RegisterPage,
    LoginPage,
    LogoutPage,
    //Components:
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      backButtonText: 'Powrót'
    }),
    AngularFireModule.initializeApp(config),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
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
    EditExpensePage,
    ShoppingListPage,
    ReceiptsPage,
    NewReceiptPage,
    StatisticByCategoryPage,
    RangeStatisticByCategoryPage,
    RegisterPage,
    LoginPage,
    LogoutPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Push,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ExpensesService,
    AuthService,
    Camera,
    PhotoViewer
  ]
})
export class AppModule {}
