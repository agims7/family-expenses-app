import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewExpensesPage } from './new-expenses';

@NgModule({
  declarations: [
    NewExpensesPage,
  ],
  imports: [
    IonicPageModule.forChild(NewExpensesPage),
  ],
})
export class NewExpensesPageModule {}
