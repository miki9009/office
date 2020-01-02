import { HttpInterceptor, HttpHandler, HttpEvent, HttpRequest } from '@angular/common/http';
import { LoaderService } from './_services/overlay.service';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

export class LoaderInterceptor implements HttpInterceptor {
  constructor(public loaderService: LoaderService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      this.loaderService.show();
      return next.handle(req).pipe(
          finalize(() => this.loaderService.hide())
      );
  }
}
