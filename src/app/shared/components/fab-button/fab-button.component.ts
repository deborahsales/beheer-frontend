import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-fab-button',
  imports: [],
  templateUrl: './fab-button.component.html',
  styleUrl: './fab-button.component.scss',
})
export class FabButtonComponent {
  @Output() click = new EventEmitter<void>();

  onClick() {
    this.click.emit();
  }
}
