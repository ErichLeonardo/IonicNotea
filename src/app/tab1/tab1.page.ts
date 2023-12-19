import { Component,inject } from '@angular/core';
import { LoadingController} from '@ionic/angular'
import {FormBuilder,FormGroup,FormsModule,ReactiveFormsModule,Validators} from '@angular/forms';
import { IonCol, IonInput,IonIcon, IonModal, IonItem, IonToolbar, IonButton, IonImg, IonGrid, IonRow, IonTextarea, IonDatetime, IonLabel, IonDatetimeButton, IonContent, IonHeader, IonTitle } from '@ionic/angular/standalone';
import { Note } from '../model/note';
import { NoteService } from '../services/note.service';
import { UIService } from '../services/ui.service';
import { Camera, CameraResultType } from '@capacitor/camera';
import * as L from 'leaflet';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonInput, FormsModule,ReactiveFormsModule, IonCol, IonIcon,IonModal,IonItem,IonToolbar, IonButton, IonImg, IonGrid, IonRow, IonDatetime, IonLabel, IonDatetimeButton, IonContent, IonHeader, IonTitle, IonTextarea],
})
export class Tab1Page {
  public form!:FormGroup;
  public img: string = ''; 
  public isMapVisible = false;
  public position: string = '';
 

  private formB = inject(FormBuilder);
  private noteS = inject(NoteService);
  private UIS = inject(UIService);
  public loadingS = inject(LoadingController);
  private myLoading!:HTMLIonLoadingElement;
  constructor() {
    this.form = this.formB.group({
      title:['',[Validators.required,Validators.minLength(4)]],
      description:[''],
      datetime: [''],
      location: [''],
      img: [''],
      position: [''],
    });

  }

  public async takePic(){
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl 
    });
  
    // Save the base64 image
    this.img = image.dataUrl!;
  }

  public showMap(): void {
    this.isMapVisible = true;
    setTimeout(() => {
      this.initMap();
    }, 0);
  }
  
  private initMap(): void {
    navigator.geolocation.getCurrentPosition((position) => {
      const map = L.map('map').setView([position.coords.latitude, position.coords.longitude], 13);
  
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map);
  
      L.marker([position.coords.latitude, position.coords.longitude]).addTo(map);
  
      this.position = `${position.coords.latitude}, ${position.coords.longitude}`;
    });
  }


  
  
  public async saveNote():Promise<void>{
    if(!this.form.valid) return;
    let note:Note={
      title:this.form.get("title")?.value,
      description:this.form.get("description")?.value,
      date:Date.now().toLocaleString(),
      img: this.img,
      position: this.position, 
    }
    await this.UIS.showLoading();
    try{
      await this.noteS.addNote(note);
      this.form.reset();
      await this.UIS.showToast("Nota introducida correctamente","success");
    }catch(error){
      await this.UIS.showToast("Error al insertar la nota","danger");
    }finally{
      await this.UIS.hideLoading();
    }
  }
  
}
