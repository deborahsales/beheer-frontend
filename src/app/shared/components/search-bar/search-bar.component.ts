import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  imports: [],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
})
export class SearchBarComponent {
  @Input() placeholder: string = 'Buscar...';
  @Input() value: string = '';
  @Output() valueChange = new EventEmitter<string>();
  @Output() search = new EventEmitter<void>();

  onInputChange(newValue: string) {
    this.value = newValue;
    this.valueChange.emit(this.value);
  }

  onSearch() {
    this.search.emit();
  }
}
