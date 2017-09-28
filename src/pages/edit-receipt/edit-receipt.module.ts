import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditReceiptPage } from './edit-receipt';

@NgModule({
  declarations: [
    EditReceiptPage,
  ],
  imports: [
    IonicPageModule.forChild(EditReceiptPage),
  ],
})
export class EditReceiptPageModule {}
