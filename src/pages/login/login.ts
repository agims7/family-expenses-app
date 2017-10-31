import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AlertController, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { RegisterPage } from '../register/register';
import { NewExpensesPage } from '../new-expenses/new-expenses';
import { AuthService } from '../../services/auth';
import { ExpensesService } from '../../services/expenses';
import firebase from 'firebase';
import { FCM } from '@ionic-native/fcm';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  registerPage = RegisterPage;
  public error: boolean = false;
  public errorNumber: number;
  public errors: any = ["Nie ma takiego użytkownika w bazie.", "Podane hasło jest błędne.", "Adres email jest błędnie zformatowany", "Coś poszło nie tak, spróbuj ponownie"];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private authService: AuthService,
    public expensesService: ExpensesService,
    private alertCtrl: AlertController,
    public database: AngularFireDatabase
  ) {
  }

  onSignin(form: NgForm) {
    this.authService.signin(form.value.email, form.value.password)
    // this.expensesService.loaderOn();
    // this.authService.signin(form.value.email, form.value.password)
    //   .then(data => {
    //     this.error = false;
    //     this.expensesService.loaderOff();
    //     this.navCtrl.push(NewExpensesPage);
    //   })
    //   .catch(error => {
    //     this.error = true;
    //     this.expensesService.loaderOff();
    //     this.errorNumber = this.errorMessage(error.message);
    //   });
  }

  errorMessage(message) {
    switch (message) {
      case ('There is no user record corresponding to this identifier. The user may have been deleted.'): {
        return 0;
      }
      case ("The password is invalid or the user does not have a password."): {
        return 1;
      }
      case ("The email address is badly formatted."): {
        return 2;
      }
      default: {
        return 3;
      }
    }
  }

}
