import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MonthStatisticPage } from './month-statistic';

@NgModule({
  declarations: [
    MonthStatisticPage,
  ],
  imports: [
    IonicPageModule.forChild(MonthStatisticPage),
  ],
})
export class MonthStatisticPageModule {}
