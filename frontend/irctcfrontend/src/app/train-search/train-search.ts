import { Component } from '@angular/core';

import { Profile } from '../profile/profile';

@Component({
  selector: 'app-train-search',
  standalone: true,
  imports: [Profile],
  templateUrl: './train-search.html',
})
export class TrainSearch {
}
