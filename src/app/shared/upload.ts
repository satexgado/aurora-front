import { Observable } from "rxjs";
import { distinctUntilChanged, scan } from "rxjs/operators";
import {
  HttpEvent,
  HttpEventType,
  HttpResponse,
  HttpProgressEvent,
} from '@angular/common/http'

function isHttpResponse<T>(event: HttpEvent<T>): event is HttpResponse<T> {
  return event.type === HttpEventType.Response
}

function isHttpProgressEvent(
  event: HttpEvent<unknown>
): event is HttpProgressEvent {
  return (
    event.type === HttpEventType.DownloadProgress ||
    event.type === HttpEventType.UploadProgress
  )
}
export interface Upload {
  progress: number;
  state: "PENDING" | "IN_PROGRESS" | "DONE" | false;
  body?:any;
}

export function upload(): (
  source: Observable<HttpEvent<unknown>>
) => Observable<Upload> {
  const initialState: Upload = { state: "PENDING", progress: 0 };
  const reduceState = (state: Upload, event: HttpEvent<unknown>): Upload => {
    if (isHttpProgressEvent(event)) {
      return {
        progress: event.total
          ? Math.round((100 * event.loaded) / event.total)
          : state.progress,
        state: "IN_PROGRESS",
      };
    }
    if (isHttpResponse(event)) {
      return {
        progress: 100,
        state: "DONE",
        body: event.body
      };
    }
    return state;
  };
  return (source) =>
    source.pipe(
      scan(reduceState, initialState),
      distinctUntilChanged(
        (a, b) => a.state === b.state && a.progress === b.progress
      )
    );
}
