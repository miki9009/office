import { Injectable, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class LoaderService {
    isLoading = new Subject<boolean>();
    show() {
        this.isLoading.next(true);
        //console.log('show loading');
        this.showOverlay();
    }
    hide() {
        this.isLoading.next(false);
        //console.log('hide loading');
        this.hideOverlay();
    }

    showOverlay() {
      const element = document.getElementById('app-overlay');
      if (element != null) {
        element.style.visibility = 'visible';
      }
    }

    hideOverlay() {
      const element = document.getElementById('app-overlay');
      if (element != null) {
        element.style.visibility = 'hidden';
      }
    }

  }


// export class OverlayService {

// constructor() { }




