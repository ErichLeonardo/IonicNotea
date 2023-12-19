import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonButton, IonHeader, IonImg, IonLabel, IonItem, IonContent, IonButtons, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { NavParams } from '@ionic/angular';
import { ModalController } from '@ionic/angular/standalone';
import { NoteService } from '../services/note.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonButton, IonHeader, IonImg, IonLabel, IonItem, IonContent, IonButtons, IonTitle, IonToolbar]
})
export class ModalPage implements OnInit {

  note: any;
  self: any;

  constructor(private modalController : ModalController, private navParams: NavParams,  private noteService: NoteService) {
    this.note = this.navParams.get('note');
    this.self = this.navParams.get('self');
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  componentProps: any;

  async dismissModal() {
    await this.modalController.dismiss();
  }

  async saveNote() {
    await this.noteService.updateNote(this.note);
    await this.modalController.dismiss(this.note);
  }

  deleteImage() {
    this.note.img = null;
    this.noteService.updateNote(this.note); 
  }

  deletePosition() { 
    this.note.position = null;
    this.noteService.updateNote(this.note);
  }


}
