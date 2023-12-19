
import { Component} from '@angular/core';
import { IonInfiniteScroll, IonInfiniteScrollContent, IonToolbar, IonTitle, IonContent, IonLabel, IonList, IonItem, IonIcon, IonItemSliding, IonItemOption, IonHeader, IonItemOptions, IonRefresher, IonRefresherContent, IonImg } from '@ionic/angular/standalone';
import { Platform } from '@ionic/angular';
import { NoteService } from '../services/note.service';
import { Note } from '../model/note';
import { CommonModule } from '@angular/common';
import { ModalPage } from '../modal/modal.page';
import { ModalController } from '@ionic/angular/standalone';
import { AlertController } from '@ionic/angular';
import { BehaviorSubject, Observable, from, map, mergeMap, tap, toArray } from 'rxjs';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [CommonModule, IonInfiniteScroll, IonToolbar, IonTitle, 
    IonContent, IonLabel, IonList, IonItem, IonInfiniteScrollContent, IonIcon, IonItemSliding, 
    IonItemOption, IonHeader, IonItemOptions, IonRefresher, IonRefresherContent, IonImg]
})
export class Tab2Page {
  public _notes$:BehaviorSubject<Note[]> = new BehaviorSubject<Note[]>([]);
  private lastNote:Note|undefined=undefined;
  private notesPerPage:number = 15;
  public isInfiniteScrollAvailable:boolean = true;


  constructor(
    public platform:Platform,
    private alertController: AlertController,
    private modalController : ModalController,
    private noteService: NoteService
    ) {}

  
  deleteNoteSliding(note: Note) {
    this.deleteNote(note);
  }

  editNoteSliding(note: Note) {
    this.editNote(note);
  }

  ionViewDidEnter(){
    this.platform.ready().then(() => {
      console.log(this.platform.height());
      this.notesPerPage=Math.round(this.platform.height()/50);
      this.loadNotes(true);
    });
   
  }

  loadNotes(fromFirst:boolean, event?:any){
    if(fromFirst==false && this.lastNote==undefined){
      this.isInfiniteScrollAvailable=false;
      event.target.complete();
      return;
    } 
    this.convertPromiseToObservableFromFirebase(this.noteService.readNext(this.lastNote,this.notesPerPage)).subscribe(
      d => {
        event?.target.complete();
        if(fromFirst){
          this._notes$.next(d);
        }else{
          this._notes$.next([...this._notes$.getValue(),...d]);
        }
        // Re-enable infinite scroll when new data is loaded
        if (d.length > 0) {
          this.isInfiniteScrollAvailable = true;
        }
      },
      error => {
        console.error('Error loading notes:', error);
        event?.target.complete();
      }
    )
  }

 private convertPromiseToObservableFromFirebase(promise: Promise<any>): Observable<Note[]> {
    return from(promise).pipe(
      tap(d=>{
        if(d.docs && d.docs.length>=this.notesPerPage){
          this.lastNote=d.docs[d.docs.length-1];
        }else{
          this.lastNote=undefined;
        }
      }),
      mergeMap(d =>  d.docs),
      map(d => {
        return {key:(d as any).id,...(d as any).data()};
      }),
      toArray()
    );
  }

  doRefresh(event: any) {
    this.isInfiniteScrollAvailable=true;
    this.loadNotes(true,event);
  }

  loadMore(event: any) {
    this.loadNotes(false,event);
  }

  async editNote(note: Note) {
    const modal = await this.modalController.create({
      component: ModalPage,
      componentProps: {
        'note': note,
        'self': this 
      }
    });
    return await modal.present();
  }

  async deleteNote(note: Note) {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Estás seguro de que quieres borrar esta nota?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Borrar',
          handler: () => {
            if (this.noteService && typeof this.noteService.deleteNote === 'function') {
              this.noteService.deleteNote(note).then(() => {
                console.log('Nota eliminada exitosamente');
                // Actualiza la lista de notas después de que una nota se borra
                this.loadNotes(true);
                 // Re-enable infinite scroll after a note is deleted
                this.isInfiniteScrollAvailable = true;
              }).catch((error) => {
                console.error('Error al eliminar la nota:', error);
              });
            } else {
              console.error('noteService.deleteNote no es una función');
            }
          }
        }
      ]
    });
    await alert.present();
  }

}
