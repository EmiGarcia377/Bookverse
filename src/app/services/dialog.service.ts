import { Injectable, TemplateRef, ViewContainerRef } from '@angular/core';
import { GlobalPositionStrategy, Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { filter, merge } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(public overlay: Overlay) { }

  openDialog<T = unknown>(template: TemplateRef<T>, viewContainerRef: ViewContainerRef){
    const config = this.getOverlayConfig();
    const overlayRef = this.overlay.create(config);
    const portal = new TemplatePortal(template, viewContainerRef)
    overlayRef.attach(portal)
    this.overlayDetachment(overlayRef);
  }

  getOverlayConfig(){
    const state = new OverlayConfig({
      positionStrategy: new GlobalPositionStrategy().centerHorizontally().centerVertically(),
      panelClass: 'dialog-panel',
      hasBackdrop: true
    });
    return state;
  }

  overlayDetachment(overlayRef: OverlayRef){
    const escapeKey$ = overlayRef.keydownEvents().pipe(
      filter((e:KeyboardEvent) => e.key === 'Escape')
    );

    merge(escapeKey$).subscribe(() => {
      overlayRef.dispose();
    });
  }
}
