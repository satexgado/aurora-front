import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
name: "dateagofr"
})
export class DateagoPipeFr implements PipeTransform {
  transform(value: string): string {
    if (value) {
      const seconds = Math.floor(
      (+new Date() - +new Date(Number(value))) / 1000
      );
      if (seconds < 60) {
        return "Maintenant";
      }
      const intervals = {
        an: 365 * 24 * 60 * 60,
        mois: (52 * 7 * 24 * 60 * 60) / 12,
        semaine: 7 * 24 * 60 * 60,
        jour: 24 * 60 * 60,
        heure: 60 * 60,
        minute: 60,
        seconde: 1
      };
      let counter;
      for (const i of Object.keys(intervals)) {
        counter = Math.floor(seconds / intervals[i]);
        if (counter > 0) {
          if (counter === 1 || i === 'mois') {
            return "Il y'a " + counter + " " + i; // singular
          } else {
            return "Il y'a " + counter + " " + i + "s"; // plural
          }
        }
      }
    }
    return value;
  }
}
