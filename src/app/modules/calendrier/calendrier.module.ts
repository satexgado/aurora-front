import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { CalendarUiComponent } from './calendar-ui.component';
import { CalendrierEventEditModalComponent } from './event-edit-modal/event-edit-modal.component';
import { InlineEditorModule } from 'src/app/inline-editor/inline-editor.module';
import { CalendarViewUiComponent } from './view-ui/calendar-view-ui.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import rrulePlugin from '@fullcalendar/rrule'
import { CustomInputModule } from 'src/app/shared/components/custom-input';

FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
  timeGridPlugin,
  listPlugin,
  interactionPlugin,
  rrulePlugin
]);

@NgModule({
    declarations: [
        CalendarUiComponent,
        CalendarViewUiComponent,
        CalendrierEventEditModalComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        InlineEditorModule,
        FullCalendarModule,
        CustomInputModule,
    ],
    exports: [
      CalendarUiComponent,
      CalendarViewUiComponent,
      CalendrierEventEditModalComponent,
    ],
    entryComponents: [CalendrierEventEditModalComponent],
})
export class CalendrierModule {

}
