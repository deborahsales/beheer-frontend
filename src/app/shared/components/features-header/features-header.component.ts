import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SearchBarComponent } from '../search-bar/search-bar.component';

@Component({
  selector: 'app-features-header',
  imports: [SearchBarComponent],
  templateUrl: './features-header.component.html',
  styleUrl: './features-header.component.scss',
})
export class FeaturesHeaderComponent {
  @Input() title!: string;
  @Input() buttonName: string = 'Novo';
  @Input() inputPlaceholder: string = 'Buscar...';
  @Input() searchInput: string = '';
  @Output() searchInputChange = new EventEmitter<string>();

  @Output() filter = new EventEmitter<void>();

  applyFilter() {
    this.filter.emit();
  }

  onSearchInputChange(value: string) {
    this.searchInputChange.emit(value);
  }
}
