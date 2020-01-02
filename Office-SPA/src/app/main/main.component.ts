import { Component, OnInit} from '@angular/core';
import { UserService } from '../_services/user.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  userRoleValue: any;

  get Router(): Router {
    return this.router;
  }

  constructor(private userService: UserService, private route: ActivatedRoute, private router: Router,) {

              }

  ngOnInit() {
    this.userRoleValue = this.userService.userRole();
    if (this.userRoleValue !== 0 && this.route.url['_value'][0]['path'] === 'main') {
          this.router.navigate(['/workers-list']);
          return;
    }
  }




}
