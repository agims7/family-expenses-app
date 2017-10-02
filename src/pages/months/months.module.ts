import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MonthsPage } from './months';

@NgModule({
  declarations: [
    MonthsPage,
  ],
  imports: [
    IonicPageModule.forChild(MonthsPage),
  ],
})
export class MonthsPageModule {}
