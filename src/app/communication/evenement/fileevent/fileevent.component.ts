import { Component, Input, OnInit } from '@angular/core';
import { CrudService } from 'src/app/shareddash/services/crud.service';
import { InformeService } from 'src/app/shareddash/services/informe.service';

@Component({
  selector: 'app-fileevent',
  templateUrl: './fileevent.component.html',
  styleUrls: ['./fileevent.component.scss']
})
export class FileeventComponent implements OnInit {
  @Input() id:any;
  @Input('id') set myid($id:any){
    this.id=$id;
    this.getFile(this.id);
  }

  selectedFilepostuler: File[] = [];
  statutpostuler:boolean=false;
  fileurl='fichierevent';
  listfile:any;
  loardfile:boolean=false;
  iddelete:any;
  indexdelete:any;
  loardindex:boolean=false;

  constructor(public crud:CrudService,public informe:InformeService) { }

  ngOnInit(): void {
  }
  getFile($id:any){
    this.listfile=undefined;
    this.loardfile=false;
    this.crud.get('filebyevent/'+$id).subscribe((data)=>{
      this.listfile=data;
      if(this.listfile[0]){
        this.loardfile=true;
      }
    })
  }

  onFileSelected(event:any) {
    this.selectedFilepostuler = <Array<File>>event.target.files;
  }

  savepostulerBasereal() {
    if(this.selectedFilepostuler){
      this.statutpostuler = true;
      const fd = new FormData();
      fd.append('evenement',this.id );
      for(let i=0;  i < this.selectedFilepostuler.length; i++){
          fd.append('fichier'+i, this.selectedFilepostuler[i]);
      }
      fd.append('nbfichier', ''+this.selectedFilepostuler.length);
      this.crud.post(this.fileurl+'/',fd).subscribe(
        (data) => {
            this.informe.shownotifier('SUCCESS');
            this.loardfile=true;
            this.listfile=data;
            this.resetfile();
        },
        (error) =>{
          this.informe.shownotifier('ERROR');
          this.statutpostuler=false;
        }

      );

    }
   }
   resetfile(){
    this.statutpostuler=false;
    this.informe.closeModal('#fileModal');
    this.selectedFilepostuler=[];
   }
   action($val:any,$index:any){
     this.iddelete=$val;
     this.indexdelete=$index;
     this.informe.openModal('#deleteFileModal');
   }
   deletefile(){
     this.loardindex=true;
     this.crud.delete(this.fileurl+'/',this.iddelete).subscribe((data)=>{
       this.informe.shownotifier('SUCCESS');
       this.informe.closeModal('#deleteFileModal');
       this.loardindex=false;
       this.listfile.splice(this.indexdelete, 1)
     },
     (error)=>{
       this.informe.shownotifier('ERROR');
       this.loardindex=false;
     });
   }

}
