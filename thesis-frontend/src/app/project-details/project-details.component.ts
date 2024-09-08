import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Project } from 'src/models/project';
import { getProjectRequest } from 'src/store/actions/project.actions';
import { ProjectState } from 'src/store/app.states';
import { getProject } from 'src/store/selectors/project.selector';

@UntilDestroy()
@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css']
})
export class ProjectDetailsComponent implements OnInit {

  project$: Observable<Project | any>;
  project: Project | undefined;

  projectId: string | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private projectStore: Store<ProjectState>,
  ) { 
    this.project$ = this.projectStore.select(getProject);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.projectId = params.get('id') ?? '';

      if (!this.projectId) {
        this.snackBar.open('No project ID provided', 'Close', {
          duration: 3000
        });

        this.router.navigate(["/home"]);
      }

      this.projectStore.dispatch(getProjectRequest({ id: this.projectId }));
    });

    this.project$.pipe(untilDestroyed(this)).subscribe((project) => {
      this.project = project;

      // Get tickets and users!
    });
  }

  doesUrlContain(route: string): boolean {
    if (route === 'tickets') {
      return !(this.router.url.includes('discussions') || this.router.url.includes('documentations') 
        || this.router.url.includes('users') || this.router.url.includes('settings'));
    }

    return this.router.url.includes(route);
  }

  navigateTo(route: string): void {
    if (route === '') {
      this.router.navigate([`/projects/${this.projectId}`]);
      return;
    }

    this.router.navigate([route], { relativeTo: this.route });
  }
}
