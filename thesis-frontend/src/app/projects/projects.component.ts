import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {

  // Project | 
  projects: any[] = [];

  constructor() {

  }

  ngOnInit(): void {
    
  }

  isProjectsEmpty(): boolean {
    return this.projects.length === 0;
  }
}
