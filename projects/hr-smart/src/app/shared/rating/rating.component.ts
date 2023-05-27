import { Component, OnInit, Injectable} from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserLoggedService } from '../../services/user-logged.service';
import { SmartObjectService } from '../../services/SO.service';
import { ScoreService } from '../../services/score.service';
import { UserService } from '../../services/user.service';
import { DefaultService } from '../../webservice/generated/hr-smart-service';
import { DatePipe } from '@angular/common';
import { User } from '../../components/services/user';
@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})
@Injectable()
export class RatingComponent implements OnInit {
  constructor(
    private modalService: NgbModal,
    private SOservice: SmartObjectService,
    private userlog: UserLoggedService,
    private scoreservice: ScoreService,
    private userservice: UserService,
    private defaultService: DefaultService,
    private datePipe: DatePipe) {
  }
  userData: any;
  canvasWidth = 400;
  needleValue;
  nameFont = 30;
  // public bottomLabel = '65'
  bottomLabelFont = 28;
  // centralLabel: string
  name: string;
  options: any;
  smartobject
  userScore = 0;
  //soYears:any;
  listYears;
  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('currentUser'));
    this.getMyPropositions();
    this.getScore();
    this.getTopScore();
    this.name = this.needleLabel(this.getScore());
    this.options = {
      hasNeedle: true,
      needleColor: 'black',

      needleUpdateSpeed: 2000,
      arcColors: ['#F2726F', '#F8925E', '#FFC533', '#ccff66', '#66ff66', '#00cc66', '#62B58F'],
      arcDelimiters: [40, 50, 60, 70, 80, 90],
      rangeLabel: ['0', '+5000'],
      needleStartValue: 0,
      rangeLabelFontSize: 18
    };
    this.colorTopScore(this.getTopScore());

  }
  public getScore() {
    return this.SOservice.getPointsSOFiltred();
  }

  public addScore(sc) {
    let s = this.getScore();
    s = s + sc;
    this.scoreservice.setScore(s);
    return s;
  }
  public getTopScore() {
    let topscore = 0;
    let USERS: User[] = [];
    this.userservice.geTUsers().subscribe(users => USERS = users);

    USERS.forEach(item => {
      if (this.SOservice.getPointsSOByCreator(item) > topscore) {
        topscore = this.SOservice.getPointsSOByCreator(item);
      }
    });
    return topscore;
  }
  changeColor(color) {

    document.getElementById('myscore').style.backgroundColor = color;
  }
  needleLabel(sc: number) {
    let val: string;
    switch (true) {
      case (sc > 0 && sc <= 500):
        {
          val = 'Weak';
          this.changeColor('#F2726F');
          this.needleValue = ((40 * sc / 500));
          break;
        }

      case (sc > 500 && sc <= 1000):
        {
          val = 'Medium';
          this.changeColor('#F8925E');
          this.needleValue = (((10 * sc / 500) + 30));
          break;
        }

      case (sc > 1000 && sc <= 2000):
        {
          val = 'Quite Well';
          this.changeColor('#FFC533');
          this.needleValue = (((10 * sc) / 1000) + 40);
          break;
        }

      case (sc > 2000 && sc <= 3000):
        {
          val = 'Well';
          this.changeColor('#ccff66');
          this.needleValue = (((10 * sc / 1000) + 40));
          break;

        }

      case (sc > 3000 && sc <= 4000):
        {
          val = 'Good';
          this.changeColor('#66ff66');
          this.needleValue = (((10 * sc / 1000) + 40));
          break;
        }

      case (sc > 4000 && sc <= 5000):
        {
          val = 'Very Good';
          this.changeColor('#00cc66');
          this.needleValue = (((10 * sc / 1000) + 40));
          break;
        }

      case (sc > 5000):
        {
          this.changeColor('#62B58F');
          val = 'Excellent';
          this.needleValue = (((10 * sc / 1000) + 40));
        }

    }
    return val;
  }
  changeColor2(color) {
    document.getElementById('topscore').style.backgroundColor = color;
  }
  colorTopScore(ts: number) {

    switch (true) {
      case (ts > 0 && ts <= 500):
        {
          this.changeColor2('#F2726F');
          break;
        }

      case (ts > 500 && ts <= 1000):
        {
          this.changeColor2('#F8925E');
          break;
        }

      case (ts > 1000 && ts <= 2000):
        {
          this.changeColor2('#FFC533');
          break;
        }

      case (ts > 2000 && ts <= 3000):
        {
          this.changeColor2('#ccff66');
          break;

        }

      case (ts > 3000 && ts <= 4000):
        {
          this.changeColor2('#66ff66');
          break;
        }

      case (ts > 4000 && ts <= 5000):
        {
          this.changeColor2('#00cc66');
          break;
        }

      case (ts > 5000):
        {
          this.changeColor2('#62B58F');
        }

    }
  }
  compareId(idFist, idSecond) {
    return idFist && idSecond && idFist.id === idSecond.id;
  }

  //   this.centralLabel= ''+ this.needleValue
  public getMyPropositions() {
    this.defaultService.getUserSmartObjects(this.userData.code).subscribe((data) => {
      this.listYears = new Array<any>();
      const years = new Array<any>();
      let yearL = new Array<any>();
      data.forEach(so => {
        const yr = so.createdAt.split('-');
        const col = { year: yr[0], score: 0 };
        years.push(col);
      });
      yearL = Array.from(new Set(years.map(s => s.year))).map(y => {
        return { year: y };
      });
      // calcul user score by year
      yearL.forEach(year => {
        const soByYear = data
          .filter(so => {
            const y = so.createdAt.split('-');
            return y[0] === year.year;
          });
        let userScore = 0;
        soByYear.forEach(so => {
          userScore += so.points;

        });
        year.score = userScore;
      });

      // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
      this.listYears = yearL.sort(function (a, b) {
        return (b.year > a.year) ? 1 : -1;
      });
      if (this.listYears[0] ) {
        this.changeScore(this.listYears[0].year);
      } else {
        const date = String(this.datePipe.transform(new Date(), 'yyyy'));
        const col = { year: date, score: 0 };
        this.listYears.push(col);
      }

    });
  }
  changeScore(currentYear) {
    this.listYears.forEach(year => {
      if (year.year === currentYear) {
        this.userScore = year.score;
      }

    });
  }
  openModalRating() {
    const modalRef = this.modalService.open(ModalRating);
    modalRef.componentInstance.name = 'bonjour';
  }

}

/*******************************************************************************************************
*******************************************************************************************************
*******************************************************************************************************/
export type Data = {
  key: string,
  values: {
    x: string,
    y: number
  };
};
@Component({
  selector: 'modalRating',
  templateUrl: './modalRating.html'
})
@Injectable()
export class ModalRating {
  constructor(public activeModal: NgbActiveModal) { }

  // score;
  // // scoreValue(score){this.rating.setScore(score)}
  // topscore = 4250;
  // //  topScoreValue(topscore){this.rating.setTopScore(topscore)}
  // data: Array<Data>;
  // canvasWidth = 500;
  // needleValue;
  // nameFont = 30;
  // // public bottomLabel = '65'
  // bottomLabelFont = 28;
  // // centralLabel: string
  // name: string;
  // options: any;
  // listYears = [
  //   { id: 0, name: '2018' },
  //   { id: 1, name: '2017' },
  //   { id: 2, name: '2016' },
  //   { id: 3, name: '2015' },
  // ];
  // ngOnInit() {
  //   this.score;
  //   this.name = this.needleLabel(this.getScoreValue())
  //   this.options = {
  //     hasNeedle: true,
  //     needleColor: 'black',

  //     needleUpdateSpeed: 2000,
  //     arcColors: ['#F2726F', '#F8925E', 'FFC533', '#ccff66', '#66ff66', '#00cc66', '#62B58F'],
  //     arcDelimiters: [40, 50, 60, 70, 80, 90],
  //     rangeLabel: ['0', '+5000'],
  //     needleStartValue: 0,
  //     rangeLabelFontSize: 18
  //   };
  //   this.colorTopScore(this.getTopScoreValue());
  //   this.getJSON();
  //   this.getJSON().subscribe(data => {
  //     this.data = data;
  //   });

  // }
  // getScoreValue() { return this.rating.getScore(); }
  // getTopScoreValue() { return this.rating.getTopScore(); }
  // changeColor(color) {

  //   document.getElementById('myscore-modal').style.backgroundColor = color;
  // }
  // needleLabel(sc: number) {
  //   let val: string;
  //   switch (true) {
  //     case (sc > 0 && sc <= 500):
  //       {
  //         val = 'Weak';
  //         this.changeColor('#F2726F');
  //         this.needleValue = ((40 * this.getScoreValue()) / 500);
  //         break;
  //       }

  //     case (sc > 500 && sc <= 1000):
  //       {
  //         val = 'Medium';
  //         this.changeColor('#F8925E');
  //         this.needleValue = (((10 * this.getScoreValue()) / 500) + 30);
  //         break;
  //       }

  //     case (sc > 1000 && sc <= 2000):
  //       {
  //         val = 'Quite Well';
  //         this.changeColor('#FFC533');
  //         this.needleValue = (((10 * this.getScoreValue()) / 1000) + 40);
  //         break;
  //       }

  //     case (sc > 2000 && sc <= 3000):
  //       {
  //         val = 'Well';
  //         this.changeColor('#ccff66');
  //         this.needleValue = (((10 * this.getScoreValue()) / 1000) + 40);
  //         break;

  //       }

  //     case (sc > 3000 && sc <= 4000):
  //       {
  //         val = 'Good';
  //         this.changeColor('#66ff66');
  //         this.needleValue = (((10 * this.getScoreValue()) / 1000) + 40);
  //         break;
  //       }

  //     case (sc > 4000 && sc <= 5000):
  //       {
  //         val = 'Very Good';
  //         this.changeColor('#00cc66');
  //         this.needleValue = (((10 * this.getScoreValue()) / 1000) + 40);
  //         break;
  //       }

  //     case (sc > 5000):
  //       {
  //         this.changeColor('#62B58F');
  //         val = 'Excellent';
  //         this.needleValue = (((10 * this.getScoreValue()) / 1000) + 40);
  //       }

  //   }
  //   return val;
  // }
  // changeColor2(color) {
  //   document.getElementById('topscore-modal').style.backgroundColor = color;
  // }
  // colorTopScore(ts: number) {

  //   switch (true) {
  //     case (ts > 0 && ts <= 500):
  //       {
  //         this.changeColor2('#F2726F');
  //         break;
  //       }

  //     case (ts > 500 && ts <= 1000):
  //       {
  //         this.changeColor2('#F8925E');
  //         break;
  //       }

  //     case (ts > 1000 && ts <= 2000):
  //       {
  //         this.changeColor2('#FFC533');
  //         break;
  //       }

  //     case (ts > 2000 && ts <= 3000):
  //       {
  //         this.changeColor2('#ccff66');
  //         break;

  //       }

  //     case (ts > 3000 && ts <= 4000):
  //       {
  //         this.changeColor2('#66ff66');
  //         break;
  //       }

  //     case (ts > 4000 && ts <= 5000):
  //       {
  //         this.changeColor2('#00cc66');
  //         break;
  //       }

  //     case (ts > 5000):
  //       {
  //         this.changeColor2('#62B58F');
  //       }

  //   }
  // }
  // compareId(idFist, idSecond) {
  //   return idFist && idSecond && idFist.id === idSecond.id;
  // }

  // //   this.centralLabel= ''+ this.needleValue
  // public getJSON(): Observable<any> {
  //   return this.http.get('/assets/bars.json')
  //     .pipe(map(data => data.json() as Array<Data>));

  // }

}





