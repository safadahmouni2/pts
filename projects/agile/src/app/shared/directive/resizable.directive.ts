import { DOCUMENT } from '@angular/common';
import { Directive, ElementRef, HostBinding, HostListener, Inject, OnInit, Renderer2 } from '@angular/core';

@Directive({
    selector: '[resizable]'
})
export class ResizableDirective implements OnInit {

    private panelMinWidth = 200;
    private panelMaxWidth = 1000;
    private initialMousePosition: number;
    private isResizing = false;
    private initialWidth = 250;
    private resizeHandler: HTMLElement;
    
    private elementWidth = this.initialWidth;
    @HostBinding('style.width') hostWidth!: string;

    constructor(
        private host: ElementRef,
        private renderer: Renderer2,
        @Inject(DOCUMENT) private document: Document
    ) {}

    ngOnInit() {
        // Set host style
        this.host.nativeElement.style.position = 'relative';
        this.host.nativeElement.style.overflowX = 'visible';

        // Init resize handler 
        this.resizeHandler = this.document.createElement('div');
        this.resizeHandler.classList.add('resize-handler');
        this.host.nativeElement.appendChild(this.resizeHandler);
        this.resizeHandler.addEventListener('mousedown', (e) => {
            this.onResizeStart(e);
        });
    }

    /**
     * When the mouse key down store the position of mouse and the initial width of the panel
     * @event the mouse move event used to get the current mouse position
     */
    public onResizeStart(event) {

        // Enable the resize mode
        this.isResizing = true;

        // Initialize the values
        this.initialMousePosition = event.screenX;
        this.initialWidth = this.elementWidth;

        // Disable text selection on body
        this.renderer.addClass(this.document.body, 'resize-enabled');
    }

    /**
     * When the mouse key is moving while the key is down resize the panel based on the mouse position
     * @event the mouse move event used to calculate the new size
     */
    @HostListener('window:mousemove', ['$event'])
    private onResize(event) {
        // Stop the execution if the resize mode is not enable
        if (!this.isResizing) {
            return;
        }

        // Calculate the new width
        this.elementWidth = this.initialWidth + (event.screenX - this.initialMousePosition);

        // Limit the minimum and the maximum widths
        if (this.elementWidth < this.panelMinWidth) {
            this.elementWidth = this.panelMinWidth;
        }

        if (this.elementWidth > this.panelMaxWidth) {
            this.elementWidth = this.panelMaxWidth;
        }

        // Apply the new width
        this.hostWidth = `${this.elementWidth}px`;
    }

    /**
     * When the mouse key is up stop the resizing
     */
    @HostListener('window:mouseup')
    private onResizeEnd() {
        // Disable the resize mode
        this.isResizing = false;

        // Re-enable text selection on body
        this.renderer.removeClass(this.document.body, 'resize-enabled');
    }
}