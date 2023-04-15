import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  public auth: any;
  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.auth = this.authenticationService.userValue;
  }
  Logout() {
    this.authenticationService.logout();
  }
}
