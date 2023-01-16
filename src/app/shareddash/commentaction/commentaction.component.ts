import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { CommentService } from '../services/comment.service';

@Component({
  selector: 'app-commentaction',
  templateUrl: './commentaction.component.html',
  styleUrls: ['./commentaction.component.css']
})
export class CommentactionComponent implements OnInit {
  @Input() id:any;
  @Input() url:any;
  @Input() urlpost:any;
  @Input('id') set myid(id:any){
    this.id=id;
    this.getCommentaire(this.url+'/'+this.id);
  }
 
  public addcommentForm:any= FormGroup;
  statut: boolean=false;
  commentaire:any;
  loarding:boolean=false;
  Urlimg = environment.apiUrl;

 
  constructor(private formBuilder: FormBuilder,public service: CommentService) { }

  ngOnInit(): void {
    this.initAddcommentForm();
  }

   //Initial add comments form
   initAddcommentForm() {
    this.addcommentForm = this.formBuilder.group({
      commentaire: ['',Validators.required]
    });
   }
   
    
  

  getCommentaire(url:any){
    this.loarding=false; 
    this.commentaire=undefined;
    this.service.emitSubject(url);
    this.service._Subject$.subscribe((data)=>{
      this.commentaire=data;
      if(this.commentaire[0]){
        this.loarding=true;
      }
    });
  }
  //Function to add data to service form
  add(){
    this.statut=true;
    const commentForm=this.addcommentForm.value;
    commentForm.value=this.id;
    this.service.add(this.urlpost,commentForm);
    this.service._Subject$.subscribe(()=>{
        this.resetValue();
    });
  
 }
 resetValue(){
  this.statut=false;
  this.initAddcommentForm();
 }

}
