import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { ThemeToggle } from '../theme-toggle/theme-toggle';
import { HeaderService } from '../../services/header.service';
import { ThemeService } from '../../../theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, ThemeToggle],
  templateUrl: './app-header.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppHeader {
  private readonly headerService = inject(HeaderService);
  private readonly theme = inject(ThemeService);
  protected readonly links = this.headerService.links;
  protected readonly isDarkMode = this.theme.isDarkMode;
}
