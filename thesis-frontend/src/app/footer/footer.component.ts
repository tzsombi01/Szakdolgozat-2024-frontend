import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  lines: (string | null)[];

  constructor() {
    this.lines = [
      "Final thesis work, project management software",
      "Made by: Zsombor Toreky",
      new DOMParser().parseFromString("All rights reserved &copy", "text/html").body.textContent
    ];
  }
}
