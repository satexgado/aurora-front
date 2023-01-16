export function adaptableMap(sourceProperty: string): PropertyDecorator {
    return (target: any, propertyKey: string) => {
      if (!target.constructor._adaptableMap) {
        target.constructor._adaptableMap = {};
      }
      target.constructor._adaptableMap[propertyKey] = sourceProperty;
    };
}

export function dateAdaptableMap(sourceProperty: string): PropertyDecorator {
  return (target: any, propertyKey: string) => {
    if (!target.constructor._dateAdaptableMap) {
      target.constructor._dateAdaptableMap = {};
    }
    target.constructor._dateAdaptableMap[propertyKey] = sourceProperty;
  };
}
