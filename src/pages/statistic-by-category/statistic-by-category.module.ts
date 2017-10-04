import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StatisticByCategoryPage } from './statistic-by-category';

@NgModule({
  declarations: [
    StatisticByCategoryPage,
  ],
  imports: [
    IonicPageModule.forChild(StatisticByCategoryPage),
  ],
})
export class StatisticByCategoryPageModule {}
