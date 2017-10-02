import { DatabaseQuery } from 'angularfire2/database/interfaces';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import * as moment from 'moment';
import { ReceiptsPage } from "../receipts/receipts";
import { Camera, CameraOptions } from '@ionic-native/camera';

@Component({
  selector: 'page-new-receipt',
  templateUrl: 'new-receipt.html',
})
export class NewReceiptPage implements OnInit {
  public dbList: any;
  public receiptsList: FirebaseListObservable<any[]>
  public receiptName: string;
  public receiptDescription: string;
  public receiptValue: number;
  public receiptImage: string;
  public receiptShowImage: boolean;
  public receiptDate: number;

  public imageTaken: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public database: AngularFireDatabase,
    public camera: Camera
  ) {
  }


  ngOnInit() {
    this.dbList = 'dydo/receiptsItems/';
    this.receiptsList = this.database.list(this.dbList);
  }

  ionViewDidEnter() {
    this.imageTaken = false;
  }

  takePicture(){
    const options: CameraOptions = {
      quality: 30,
      correctOrientation: true,
      saveToPhotoAlbum: true,
      targetWidth: 600,
      targetHeight: 600,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.CAMERA,
    }

    this.camera.getPicture(options).then((imageData) => {
      this.receiptImage = 'data:image/jpeg;base64,' + imageData;
      this.imageTaken = true;
     }, (err) => {
      console.log('error')
     });
  }

  getPicture(){
    const options: CameraOptions = {
      quality: 30,
      correctOrientation: true,
      saveToPhotoAlbum: true,
      targetWidth: 600,
      targetHeight: 600,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }

    this.camera.getPicture(options).then((imageData) => {
      this.receiptImage = 'data:image/jpeg;base64,' + imageData;
      this.imageTaken = true;
     }, (err) => {
      console.log('error')
     });
  }

  downloadPicture(){
    const options: CameraOptions = {
      correctOrientation: true,
      saveToPhotoAlbum: true,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }

    this.camera.getPicture(options).then((imageData) => {
      this.receiptImage = 'data:image/jpeg;base64,' + imageData;
      this.imageTaken = true;
     }, (err) => {
      console.log('error')
     });
  }

  addReceipt() {
    this.receiptsList.push({
      date: moment().unix(),
      description: this.receiptDescription,
      image: this.receiptImage,
      name: this.receiptName,
      showImage: false,
      value: Number(this.receiptValue)
    });
    this.navCtrl.push(ReceiptsPage);
  }

}
