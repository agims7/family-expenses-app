import { Component } from '@angular/core';
import { NgForm } from "@angular/forms";
import { NavController, NavParams, AlertController, PopoverController  } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { LoginPage } from '../login/login';
import { ExpensesService } from "../../services/expenses";
import { AuthService } from "../../services/auth";
import { LogoutPage } from '../logout/logout';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  public dbList = 'michal1dydo/users/';
  public userList: FirebaseListObservable<any[]>

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private authService: AuthService,
    private alertCtrl: AlertController,
    public expensesService: ExpensesService,
  ) {
  }

  onSignup(form: NgForm) {
    this.authService.signup(form.value.email, form.value.password)
      .then(data => {
        console.log('data po rejestracji', data)
        this.userList = this.expensesService.getItemsList(this.dbList);
        this.userList.push({
          username: form.value.username,
          email: form.value.email,
          uid: data.uid,
          token: data.Yd
        });
        form.reset();
        this.navCtrl.push(LoginPage);
      })
      .catch(error => {
        console.log(error)
        form.reset();
        const alert = this.alertCtrl.create({
          title: 'Signup failed!',
          message: error.message,
          buttons: ['Ok']
        });
        alert.present();
      });
  }

}
