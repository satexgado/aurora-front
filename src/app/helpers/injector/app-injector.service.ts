import { Injectable, Injector } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class AppInjector {
  private static _injector: Injector;

  static set injector(injector: Injector) {
    this._injector = injector;
  }

  static get injector() {
    return this._injector;
  }
}
