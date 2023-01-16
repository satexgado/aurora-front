import { IBase } from './../core/models/base.interface';
import { FormGroup, FormArray } from '@angular/forms';

 function enumSelector(definition) {
 return Object.keys(definition)
    .map(key => ({ libelle: definition[key], id: definition[key] }));
}

function resourceToSelect2(resource: IBase | IBase[]) {
  if(!(resource instanceof Array))
  {
    resource = [resource] as IBase[];
  }
  return resource.map((element)=>{
    return {id : element.id ,  text: element.libelle}
  })
}
var print = (data)=>{
    console.log(data);
}

/* Form Helper */
 function shouldShowRequiredError(formGroup: FormGroup, controlName: string ) {
    const control = formGroup.get(controlName);
    if(control){
      return (control.dirty || control.touched) && control.hasError('required');
    }
}

 function isValid(formGroup: FormGroup, controlName: string) {
    const control = formGroup.get(controlName);
    if(control){
        return control.valid;
    }
}

 function getValue(formGroup: FormGroup, controlName: string) {
    const control = formGroup.get(controlName);
    if(control){
        return control.value;
    }
    return false;
}

 function shouldDisableSubmit(formGroup: FormGroup)
{
    return (formGroup.valid && !(formGroup.dirty || formGroup.touched) ) || formGroup.invalid;
}

 function getDirtyState(form: FormGroup, excludeField?: Set<string> ): Object {
    return Object.keys(form.controls).reduce<Object>((dirtyState, controlKey) => {
      const control = form.controls[controlKey];

      if(!(excludeField != null && excludeField.has(controlKey)))
      {
        if (!control.dirty ) {
          return dirtyState;
        }
      }

      if (control instanceof FormGroup) {
        return {
          ...dirtyState,
          [controlKey]: getDirtyState(control),
        };
      }

      return {
        ...dirtyState,
        [controlKey]: control.value,
      };
    }, {});
  }

 function getDirtyStateArray(form: FormArray, excludeField?: Set<string> ): Object {
    return Object.keys(form.controls).reduce<Object>((dirtyState, controlKey) => {
      const control = form.controls[controlKey];

      if(control.value)
      if (!control.dirty) {
        return dirtyState;
      }

      if (control instanceof FormGroup) {
        if(excludeField == null)
        {
          return {
            ...dirtyState,
            [controlKey]: getDirtyState(control),
          };
        }
        return {
          ...dirtyState,
          [controlKey]: getDirtyState(control, excludeField),
        };
      }

      return {
        ...dirtyState,
        [controlKey]: control.value,
      };
    }, {});
  }

 function renameKeys(keysMap, obj) {
    return Object
    .keys(obj)
    .reduce((acc, key) => ({
        ...acc,
        ...{ [keysMap[key] || key]: obj[key] }
    }), {});
 }
/* Form Helper end*/

/* Compar and equal */
 function isEqual (value, other) {

    // Get the value type
    var type = Object.prototype.toString.call(value);

    // If the two objects are not the same type, return false
    if (type !== Object.prototype.toString.call(other)) return false;

    // If items are not an object or array, return false
    if (['[object Array]', '[object Object]'].indexOf(type) < 0) return false;

    // Compare the length of the length of the two items
    var valueLen = type === '[object Array]' ? value.length : Object.keys(value).length;
    var otherLen = type === '[object Array]' ? other.length : Object.keys(other).length;
    if (valueLen !== otherLen) return false;


    // Compare properties
    if (type === '[object Array]') {
        for (var i = 0; i < valueLen; i++) {
            if (compare(value[i], other[i]) === false) return false;
        }
    } else {
        for (var key in value) {
            if (value.hasOwnProperty(key)) {
                if (compare(value[key], other[key]) === false) return false;
            }
        }
    }

    // If nothing failed, return true
    return true;

};
 function compare (item1, item2) {

    // Get the object type
    var itemType = Object.prototype.toString.call(item1);

    // If an object or array, compare recursively
    if (['[object Array]', '[object Object]'].indexOf(itemType) >= 0) {
        if (!isEqual(item1, item2)) return false;
    }

    // Otherwise, do a simple comparison
    else {

        // If the two items are not the same type, return false
        if (itemType !== Object.prototype.toString.call(item2)) return false;

        // Else if it's a function, convert to a string and compare
        // Otherwise, just compare
        if (itemType === '[object Function]') {
            if (item1.toString() !== item2.toString()) return false;
        } else {
            if (item1 !== item2) return false;
        }

    }
};
/* Compar and equal END */

function trackByIndex(index, item) {
  return index;
}

function checkOverflow(event) {
  if (event.nativeElement.offsetHeight < event.nativeElement.scrollHeight ||
      event.nativeElement.offsetWidth < event.nativeElement.scrollWidth) {
      return true;
  }
  return false;
}

export class cloneable {
  public static deepCopy<T>(source: T): T {
    return Array.isArray(source)
    ? source.map(item => this.deepCopy(item))
    : source instanceof Date
    ? new Date(source.getTime())
    : source && typeof source === 'object'
          ? Object.getOwnPropertyNames(source).reduce((o, prop) => {
             Object.defineProperty(o, prop, Object.getOwnPropertyDescriptor(source, prop)!);
             o[prop] = this.deepCopy((source as { [key: string]: any })[prop]);
             return o;
          }, Object.create(Object.getPrototypeOf(source)))
    : source as T;
  }
}

function decycle(object, replacer) {
  "use strict";

// Make a deep copy of an object or array, assuring that there is at most
// one instance of each object or array in the resulting structure. The
// duplicate references (which might be forming cycles) are replaced with
// an object of the form

//      {"$ref": PATH}

// where the PATH is a JSONPath string that locates the first occurance.

// So,

//      var a = [];
//      a[0] = a;
//      return JSON.stringify(JSON.decycle(a));

// produces the string '[{"$ref":"$"}]'.

// If a replacer function is provided, then it will be called for each value.
// A replacer function receives a value and returns a replacement value.

// JSONPath is used to locate the unique object. $ indicates the top level of
// the object or array. [NUMBER] or [STRING] indicates a child element or
// property.

  var objects = new WeakMap();     // object to path mappings

  return (function derez(value, path) {

// The derez function recurses through the object, producing the deep copy.

      var old_path;   // The path of an earlier occurance of value
      var nu;         // The new object or array

// If a replacer function was provided, then call it to get a replacement value.

      if (replacer !== undefined) {
          value = replacer(value);
      }

// typeof null === "object", so go on if this value is really an object but not
// one of the weird builtin objects.

      if (
          typeof value === "object"
          && value !== null
          && !(value instanceof Boolean)
          && !(value instanceof Date)
          && !(value instanceof Number)
          && !(value instanceof RegExp)
          && !(value instanceof String)
      ) {

// If the value is an object or array, look to see if we have already
// encountered it. If so, return a {"$ref":PATH} object. This uses an
// ES6 WeakMap.

          old_path = objects.get(value);
          if (old_path !== undefined) {
              return {$ref: old_path};
          }

// Otherwise, accumulate the unique value and its path.

          objects.set(value, path);

// If it is an array, replicate the array.

          if (Array.isArray(value)) {
              nu = [];
              value.forEach(function (element, i) {
                  nu[i] = derez(element, path + "[" + i + "]");
              });
          } else {

// If it is an object, replicate the object.

              nu = {};
              Object.keys(value).forEach(function (name) {
                  nu[name] = derez(
                      value[name],
                      path + "[" + JSON.stringify(name) + "]"
                  );
              });
          }
          return nu;
      }
      return value;
  }(object, "$"));
};

function retrocycle($) {
  "use strict";

// Restore an object that was reduced by decycle. Members whose values are
// objects of the form
//      {$ref: PATH}
// are replaced with references to the value found by the PATH. This will
// restore cycles. The object will be mutated.

// The eval function is used to locate the values described by a PATH. The
// root object is kept in a $ variable. A regular expression is used to
// assure that the PATH is extremely well formed. The regexp contains nested
// * quantifiers. That has been known to have extremely bad performance
// problems on some browsers for very long strings. A PATH is expected to be
// reasonably short. A PATH is allowed to belong to a very restricted subset of
// Goessner's JSONPath.

// So,
//      var s = '[{"$ref":"$"}]';
//      return JSON.retrocycle(JSON.parse(s));
// produces an array containing a single element which is the array itself.

  var px = /^\$(?:\[(?:\d+|"(?:[^\\"\u0000-\u001f]|\\(?:[\\"\/bfnrt]|u[0-9a-zA-Z]{4}))*")\])*$/;

  (function rez(value) {

// The rez function walks recursively through the object looking for $ref
// properties. When it finds one that has a value that is a path, then it
// replaces the $ref object with a reference to the value that is found by
// the path.

      if (value && typeof value === "object") {
          if (Array.isArray(value)) {
              value.forEach(function (element, i) {
                  if (typeof element === "object" && element !== null) {
                      var path = element.$ref;
                      if (typeof path === "string" && px.test(path)) {
                          value[i] = eval(path);
                      } else {
                          rez(element);
                      }
                  }
              });
          } else {
              Object.keys(value).forEach(function (name) {
                  var item = value[name];
                  if (typeof item === "object" && item !== null) {
                      var path = item.$ref;
                      if (typeof path === "string" && px.test(path)) {
                          value[name] = eval(path);
                      } else {
                          rez(item);
                      }
                  }
              });
          }
      }
  }($));
  return $;
};

export {print, enumSelector, shouldShowRequiredError,
    isEqual, compare, isValid, getDirtyState, getDirtyStateArray,
    getValue, renameKeys, shouldDisableSubmit, trackByIndex, checkOverflow,
    resourceToSelect2, decycle, retrocycle
}
