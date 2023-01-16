export function hasOneMap(sourceProperty: {field: string, class: AdapterConstructor}): PropertyDecorator {
    return (target: any, propertyKey: string) => {
      if (!target.constructor._hasOneMap) {
        target.constructor._hasOneMap = {};
      }
      target.constructor._hasOneMap[propertyKey] = sourceProperty;
    };
}

export function hasManyMap(sourceProperty: {field: string, class: AdapterConstructor}): PropertyDecorator {
  return (target: any, propertyKey: string) => {
    if (!target.constructor._hasManyMap) {
      target.constructor._hasManyMap = {};
    }
    target.constructor._hasManyMap[propertyKey] = sourceProperty;
  };
}

export interface AdapterConstructor {
    new (): any;
}
