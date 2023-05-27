import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  currentUser = JSON.parse(sessionStorage.currentUser);
  today = new Date();

  get greetingTime(): string {
    let result = null;
    const curHr = this.today.getHours()
    if (curHr < 12) {
      result = 'Morning';
    } else if (curHr < 18) {
      result = 'Afternoon';
    } else {
      result = 'Evening';
    }

    return result;
  }
}
