import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewReceiptPage } from './new-receipt';

@NgModule({
  declarations: [
    NewReceiptPage,
  ],
  imports: [
    IonicPageModule.forChild(NewReceiptPage),
  ],
})
export class NewReceiptPageModule {}
