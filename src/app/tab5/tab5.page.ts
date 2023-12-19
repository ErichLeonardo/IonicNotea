import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonAvatar, IonContent, IonLabel, IonItem, IonCardContent, IonCard, IonCardTitle, IonCardSubtitle, IonCardHeader, IonTitle } from '@ionic/angular/standalone';

@Component({
  selector: 'app-tab5',
  templateUrl: './tab5.page.html',
  styleUrls: ['./tab5.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonHeader, IonToolbar, IonAvatar, IonContent, IonLabel, IonItem, IonCardContent, IonCard, IonCardTitle, IonCardSubtitle, IonCardHeader, IonTitle]
})
export class Tab5Page implements OnInit {

  constructor() { }

  redirectToGithub() {
    window.open('https://github.com/ErichLeonardo', '_blank');
  }
  
  ngOnInit() {
  }

}
