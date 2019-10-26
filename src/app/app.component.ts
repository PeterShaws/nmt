import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'No Man’s Tools';
  currentPath: string;
  footerLink = 'https://www.reddit.com/message/compose/?to=agnoristos';
  footerMessage = 'Created by u/agnoristos';

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.currentPath = (this.route.snapshot.firstChild.component as Function).name.replace('Component', '');
    });
  }

}
