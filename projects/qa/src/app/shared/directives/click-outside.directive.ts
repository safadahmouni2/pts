import { Directive, ElementRef, HostListener, Output, EventEmitter } from '@angular/core';

@Directive({
    selector: '[appClickOutSide]'
})
export class ClickOutSideDirective {

    constructor(private _elementRef: ElementRef) { }

    @Output() clickOutside: EventEmitter<any> = new EventEmitter();

    @HostListener('document:click', ['$event.target'])
    onMouseEnter(targetElement: ElementRef) {
        const clickedInside = this._elementRef.nativeElement.contains(targetElement);
        if (!clickedInside) {
            this.clickOutside.emit(null);
        }
    }

}
