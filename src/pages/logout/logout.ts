import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { AuthService } from "../../services/auth";

@Component({
  selector: 'page-logout',
  templateUrl: 'logout.html',
})
export class LogoutPage {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public authService: AuthService
    ) {
  }

  onLogout() {
    this.viewCtrl.dismiss();
    this.authService.logout();
    this.navCtrl.setRoot(LoginPage);
}

}
