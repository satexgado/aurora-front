export class AdaptableMapper<T> {
    adaptableMapping: any;
    dateAdaptableMapping: any;
    hasOneMapping: any;
    hasManyMapping: any;

       constructor(protected type: { new(): T ; }) {
          const instance: any = new type();
          this.adaptableMapping = instance.constructor._adaptableMap ? instance.constructor._adaptableMap : [];
          this.dateAdaptableMapping = instance.constructor._dateAdaptableMap ? instance.constructor._dateAdaptableMap : [];
          this.hasOneMapping = instance.constructor._hasOneMap ? instance.constructor._hasOneMap : [];
          this.hasManyMapping = instance.constructor._hasManyMap ? instance.constructor._hasManyMap : [];
       }

       fromSource(source) {

            let result = new this.type();
            // transformation des valeurs de la source vers l'objet

         Object.keys(result).forEach((key) => {
            const mappedKey = this.adaptableMapping[key];
            if (mappedKey) {
                   return result[key] = source[mappedKey];
            }

            const dateMappedKey = this.dateAdaptableMapping[key];
            if (dateMappedKey && source[dateMappedKey]) {
               return  result[key] = new Date(source[dateMappedKey]);
            }

            const mappedHasOneKey = this.hasOneMapping[key];
            if (mappedHasOneKey && source[mappedHasOneKey.field]) {
              return  result[key] = new AdaptableMapper(mappedHasOneKey.class).fromSource(source[mappedHasOneKey.field]);
            }

            const mappedHasManyKey = this.hasManyMapping[key];
            if (mappedHasManyKey && source[mappedHasManyKey.field]) {
                return result[key] = source[mappedHasManyKey.field].map(item => new AdaptableMapper(mappedHasManyKey.class).fromSource(item));
            }

            result[key] = source[key];
         });

        //  // ajout de valeurs supplémentaire venant de la source et qui n'éxiste pas dans l'objet
        //  Object.keys(source).forEach((key) => {
        //    const targetKeys = Object.keys(result);
        //    if (targetKeys.indexOf(key) === -1) {
        //      result[key] = source[key];
        //    }
        //  });
         return result;
       }

        toSource(data) {
            const newsource = {};
            Object.keys(data).forEach((key) => {
                if ((!data[key]) && data[key] !== false && data[key] !==0 && data[key] !== '') {
                    return;
                }

                const mappedKey = this.adaptableMapping[key];
                if (mappedKey) {
                  return newsource[mappedKey] = data[key];
                }

                const dateMappedKey = this.dateAdaptableMapping[key];

                if (dateMappedKey && (data[key] instanceof Date)) {
                  return  newsource[dateMappedKey] = this.format_date( data[key] );
                 // return newsource[dateMappedKey] = data[key].toISOString().slice(0, 19).replace('T', ' ');
                }
                newsource[key] = data[key];
            });
            return newsource;
        }

        toFormData(data) {
            const newsource = this.toSource(data);
            const formData = new FormData();
            Object.keys(newsource).forEach(key => {
              if((newsource[key] instanceof Array || newsource[key] instanceof Object) && !(newsource[key] instanceof File)) {
                formData.append(key,  JSON.stringify(newsource[key]));
                return;
              }

              if(newsource[key] === true) {
                newsource[key] = 1 ;
              }

              if(newsource[key] === false) {
                newsource[key] = 0;
              }
              formData.append(key, newsource[key]);
            });
            return formData;
        }

        /**
 * Formats a dateObject or date string to Y-m-d date
 * Example: Converts  dateObject or date string  Sat Aug 19 2017 00:00:00 GMT+0530 (India Standard Time)   TO  2017-08-19
 */
format_date( date )
{
    if (typeof date == "string")
    {
        date = new Date(date);
    }

    var year = date.getFullYear();
    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;

    return year+'-'+month+'-'+day+' '+date.getHours().toString().padStart(2, '0')+':'+date.getMinutes().toString().padStart(2, '0')+':'+date.getSeconds().toString().padStart(2, '0');
}

  }

