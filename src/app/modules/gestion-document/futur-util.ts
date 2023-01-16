export class util {
  updateMultiple(newItems: any)
  {
      let observables = [];
      Object.values(newItems).forEach(item => {
          observables.push(this.factory.update(item).pipe(
              tap(
                  (data: any) => {
                  let mapped = this._collection$.value.map((item, index) => {
                      if(item.id == data.id){
                          item = data;
                      }
                      return item
                  } );
                  this._collection$.next(mapped);
              })
          ));
      });
      return forkJoin(observables).pipe(tap(()=>{
          this._loading$.next(false);
          this._search$.next();
          this.notificationService.onSuccess('Toutes les modifications ont été enregistré');
      }));
  }


  delete(): void {
      this.notificationService.title = 'Suppréssion';

      this.notificationService.body = 'Êtes-vous sûr(e) de vouloir supprimer?';

      this._selectedItemId.forEach((item)=>{
          let libelle =this.selecteSingleItem(item).libelle;
          this.notificationService.body = this.notificationService.body+' '+libelle+',';
      });

      this.notificationService.body = this.notificationService.body.substring(0, this.notificationService.body.length - 1)

      const confirm = () => {
          this._loading$.next(true);
          let observables = [];
          this._selectedItemId.forEach((item)=>{
              observables.push(this.factory.delete(item));
          });
         forkJoin(observables).subscribe(()=>{
             this._loading$.next(false);
             this._search$.next();
             this.notificationService.onSuccess('suppression éffectuer');
         });
         this.notificationService.onSuccess('suppression éffectuer');
      }

      const plsno = () => {

      }

      this.notificationService.bodyMaxLength = 300;
      this.notificationService.backdrop =  0;
      this.notificationService.onConfirmation(confirm);

      this.notificationService.bodyMaxLength = 80;
      this.notificationService.backdrop =  -1;
  }
}

