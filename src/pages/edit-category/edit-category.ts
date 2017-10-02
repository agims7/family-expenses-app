import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { CategoriesPage } from '../categories/categories';


@Component({
  selector: 'page-edit-category',
  templateUrl: 'edit-category.html',
})
export class EditCategoryPage implements OnInit {
  public categoryName: string;
  public categoryColor: string;
  public categoryKey: string;
  public selectedCategory;
  public dbList;
  public categoriesList: FirebaseListObservable<any[]>  

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public database: AngularFireDatabase,
  ) {
  }

  ngOnInit() {
    this.setDbList();
    this.selectedCategory = this.navParams.data;
    this.categoryName = this.selectedCategory.name;
    this.categoryColor = this.selectedCategory.color;
    this.categoryKey = this.selectedCategory.$key;
  }

  changeName() {
    this.categoryName = this.categoryName.toLowerCase();
  }

  setDbList() {
    this.dbList = 'dydo/categoriesItems/';
    this.categoriesList = this.database.list(this.dbList);
  }

  editCategory() {
    this.categoriesList.update(this.categoryKey, {
      name: this.categoryName,
      color: this.categoryColor
    });
    this.navCtrl.push(CategoriesPage);
  }

}
