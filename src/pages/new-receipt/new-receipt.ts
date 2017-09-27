import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';

@Component({
  selector: 'page-new-receipt',
  templateUrl: 'new-receipt.html',
})
export class NewReceiptPage implements OnInit {
  public receiptName: string;
  public receiptDescription: string;
  public receiptValue: number;
  public receiptImage: string;
  public receiptShowImage: boolean;
  public receiptDate: number;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public camera: Camera
  ) {
  }

  ngOnInit() {
    
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
     }, (err) => {
      console.log('error')
     });
  }

}
