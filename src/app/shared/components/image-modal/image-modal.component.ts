import { Component, OnInit, Input, HostListener } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-image-modal',
  templateUrl: './image-modal.component.html'
})

export class ImageModalComponent implements OnInit {

  @Input() images_url: string[];
  @Input() current_image: string;

  constructor(
    protected activeModal: NgbActiveModal) 
   {
  }

  ngOnInit() {
    if(this.images_url && !this.current_image)
    {
      this.current_image = this.images_url[0];
    }
  }

  onSetImage(img: string)
  {
    this.current_image = img;
  }
  
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvents(event: KeyboardEvent) {
    let current_index = this.images_url.indexOf(this.current_image);
    switch(event.key)
    {
      case "Left": // IE/Edge specific value
      case "ArrowLeft":
        if(current_index>=1)
        {
          this.current_image = this.images_url[current_index-1];
        }
        break;
      case "Right": // IE/Edge specific value
      case "ArrowRight":
        if(current_index!=this.images_url.length-1)
        {
          this.current_image = this.images_url[current_index+1];
        }
        break;
        default:
      return; // Quit when this doesn't handle the key event.
    }
    event.preventDefault();
  }

  onCloseModal(result?: string)
  {
    this.activeModal.close(result);
  }

 
}
