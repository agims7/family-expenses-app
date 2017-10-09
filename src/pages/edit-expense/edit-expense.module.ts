import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditExpensePage } from './edit-expense';

@NgModule({
  declarations: [
    EditExpensePage,
  ],
  imports: [
    IonicPageModule.forChild(EditExpensePage),
  ],
})
export class EditExpensePageModule {}
