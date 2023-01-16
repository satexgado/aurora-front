import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { NgxPicaImageService, NgxPicaService } from '@digitalascetic/ngx-pica';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { UsersService } from '../users.service';
import { BaseCreateComponent } from './../../../shared/base-component/base-create.component';
import { User } from './../user.model';

@Component({
  selector: 'app-users-create',
  templateUrl: './users-create.component.html',
  styleUrls: ['./users-create.component.scss'],
})
export class UsersCreateComponent
  extends BaseCreateComponent<User>
  implements OnInit
{
  @Input() submitDisabled = false;
  @Input() loading = false;
  @Input() reset!: Observable<boolean>;

  created = new EventEmitter<FormData>();
  imageUrl: any;
  constructor(
    public usersService: UsersService,
    public ngxPicaService: NgxPicaService,
    public ngxPicaImageService: NgxPicaImageService
  ) {
    super(usersService);
  }

  ngOnInit(): void {
    this.initForm();

    if (this.reset) {
      this.subscriptions['reset'] = this.reset.subscribe(() => {
        this.resetForm();
      });
    }
  }

  // TODO inverser les operation ternaires
  initForm(user?: any): void {
    this.form = this.fb.group({
      prenom: [!user ? null : user.prenom, Validators.required],
      nom: [!user ? null : user.nom, Validators.required],
      date_naissance: [
        !user ? null : this.getDateNaissance(user.date_naissance),
        Validators.required,
      ],
      lieu_naissance: [!user ? null : user.lieu_naissance, Validators.required],
      telephone: [!user ? null : user.telephone, Validators.required],
      identifiant: [!user ? null : user.identifiant, Validators.required],
      sexe: [!user ? 'HOMME' : user.sexe, Validators.required],
      email: [!user ? null : user.email, Validators.required],
    });

    this.form.controls.sexe.valueChanges.subscribe((sexe) => {
      if (sexe !== 'HOMME' && sexe !== 'FEMME') {
        this.formValuePatcher('sexe', 'HOMME');
        this.helper.notification.alertDanger();
      }
    });
  }

  // Chercher le type de change
  onFileChanged(event: any) {
    const files: File[] = event.target.files;

    if (files?.length && this.ngxPicaImageService.isImage(files[0])) {
      const image = files[0];
      this.formData.append('photo', image);
      this.ngxPicaService
        .resizeImage(image, 150, 150)
        .subscribe((imageRetailler) => {
          // this.formData.append(
          //   'photo_min',
          //   new File([imageRetailler], imageRetailler.name, {
          //     type: imageRetailler.type,
          //   })
          // );

          this.displayImage(imageRetailler);
        });
    }
  }

  displayImage(image: File): void {
    let reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = () => {
      this.imageUrl = reader.result;
    };
  }

  getDateNaissance(dateNaissance: string): NgbDateStruct {
    const table = dateNaissance.split('-');
    return {
      year: parseInt(table[0]),
      month: parseInt(table[1]),
      day: parseInt(table[2]),
    };
  }

  resetForm(): void {
    this.initForm();
    this.formData = new FormData();
  }

  create(): void {
    if (this.form.valid) {
      // this.loading = true;
      const data = {
        ...this.form.value,
        date_naissance: `${this.formValue('date_naissance').year}/${
          this.formValue('date_naissance').month
        }/${this.formValue('date_naissance').day}`,
      };
      this.fillFormData(data);
      this.created.emit(this.formData);

      // this.usersService.store(this.formData).subscribe(() => {
      //   this.loading = false;
      //   ;

      //   this.helper.notification.toastSuccess(
      //     "Un mail de confirmation a été envoyé à l'utilisateur"
      //   );
      // });
    } else {
      this.helper.notification.alertDanger('Formulaire invalide');
    }
  }
}
