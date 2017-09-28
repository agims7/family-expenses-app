import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Camera, CameraOptions } from '@ionic-native/camera';


@Component({
  selector: 'page-edit-receipt',
  templateUrl: 'edit-receipt.html',
})
export class EditReceiptPage implements OnInit {
  public dbList: any;
  public receiptsList: FirebaseListObservable<any[]>
  private receiptKey: any;
  private receipt: any;
  public receiptImage: string;
  public imageTaken: boolean = false;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public database: AngularFireDatabase,
    public camera: Camera
    
  ) {
  }

  ngOnInit() {
    this.receiptKey = this.navParams.data;
    this.dbList = 'dydo/receiptsItems/';
    this.receiptsList = this.database.list(this.dbList);
    this.receiptsList.subscribe(data => {
      console.log(data);
      for (let receipt of data) {
        if (receipt.$key === this.receiptKey) {
          this.receipt = receipt;
          console.log('rec ', this.receipt)
        }
      }
    });
  }

  ionViewDidEnter() {
    this.imageTaken = false;
  }

  takePicture(){
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      this.receiptImage = 'data:image/jpeg;base64,' + imageData;
      this.imageTaken = true;
     }, (err) => {
      console.log('error')
     });
  }

  editReceipt() {
    console.log(this.receipt.$key)
    // this.receiptsList.update(key, {
    //   bought: !status
    // });

  }

}
