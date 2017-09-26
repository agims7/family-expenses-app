import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditCategoriesPage } from './edit-categories';

@NgModule({
  declarations: [
    EditCategoriesPage,
  ],
  imports: [
    IonicPageModule.forChild(EditCategoriesPage),
  ],
})
export class EditCategoriesPageModule {}