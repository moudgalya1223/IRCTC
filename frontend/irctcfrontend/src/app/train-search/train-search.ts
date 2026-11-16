import { Component } from '@angular/core';

import { Profile } from '../profile/profile';
import { ThemeToggle } from '../shared/components/theme-toggle/theme-toggle';

@Component({
  selector: 'app-train-search',
  standalone: true,
  imports: [Profile, ThemeToggle],
  templateUrl: './train-search.html',
})
export class TrainSearch {
}
