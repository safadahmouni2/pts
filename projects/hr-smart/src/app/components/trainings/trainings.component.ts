import { Component, OnInit, Injectable, ViewChild, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../services/auth.service';
import { DefaultService, UserEntry, TrainingEntry, ParticipantEntry, SmartObjectEntry } from '../../webservice/generated/hr-smart-service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-trainings',
  templateUrl: './trainings.component.html',
  styleUrls: ['./trainings.component.css']
})
@Injectable()
export class TrainingsComponent implements OnInit {
  trainings: any;
  searchtype: any;
  searchresponsable: any;
  searchurgency: any;
  searchdecision: any;
  collapsed: any;
  userData;
  serverpath = 'https://pts.thinktank.de';
  moderator = '';
  allUser;
  userNoParticipants;
  modalRef;
  participants;
  currentTraining: any;
  SOpoints: number;
  trainingParticipants: any;
  trainingParticipantsData: any;
  filterUrgency = new Array<any>();
  freeSearch: any;
  @ViewChild('ModalModerator', { static: true }) ModalModerator: TemplateRef<any>;
  @ViewChild('ModalParticipants', { static: true }) ModalParticipants: TemplateRef<any>;
  constructor(private modalService: NgbModal, private authService: AuthService,
    private defaultService: DefaultService, private route: ActivatedRoute,
    public router: Router, private datePipe: DatePipe) {
    this.participants = new Array<any>();
    this.userData = JSON.parse(sessionStorage.getItem('currentUser'));
    this.route.params.subscribe(routeParams => {
      this.getUsers();
      this.getTraining(routeParams.status);
    });
  }
  ngOnInit() {
    this.trainings = new Array<any>();
  }
  /****************************************/
  /*            public  Methods           */
  /****************************************/
  public onSearch(value) {
    this.freeSearch = value;
  }
  public setTraining(tr) {
    this.trainings = tr;
  }
  public openModalModerator(tr) {
    this.currentTraining = tr;
    this.modalRef = this.modalService.open(this.ModalModerator);

    this.getUsers();
  }
  public openModalParticipants(tr) {
    this.modalRef = this.modalService.open(this.ModalParticipants);
    this.getParticipant(tr.id);
  }

  public trainingDone(tr: any, trainingStatus) {
    this.currentTraining = tr;
    this.onSubmit(trainingStatus);
  }
  public meAsModerator(tr: any, trainingStatus) {
    this.moderator = this.userData.code;
    this.currentTraining = tr;
    this.onSubmit(trainingStatus);
  }
  public meAsParticipant(tr: any) {
    this.participants.push({ code: this.userData.code });
    this.currentTraining = tr;
    this.addParticipants(tr, true);
  }
  public confirmeTraining(training) {
    this.getPoints('pt');
    const dateFormat = String(this.datePipe.transform(new Date(), 'yyyy-MM-dd'));
    const rest: SmartObjectEntry = {
      subject: training.subject,
      departement: training.departement,
      date: training.date,
      hours: training.hours,
      description: training.description,
      moderator: training.moderator.code,
      status: 'Accepted',
      urgency: training.urgency,
      createdAt: dateFormat,
      updatedAt: dateFormat

    };
    this.defaultService.getParticipant(training.id).subscribe((data) => {
      const trainings = new Array();
      this.userNoParticipants = this.allUser;
      data.forEach(element => {
        trainings.push(element.trainings);
      });
      let ps = new Array<any>();
      trainings.forEach(element => {
        const col = { code: element.code };
        ps.push(col);
      });
      this.participants = Array.from(new Set(ps.map(s => s.code))).map(co => {
        return { code: co };
      });
      this.participants.forEach(participant => {
        rest.id = 'pt';
        rest.type = 'pt';
        rest.creator = participant.code;
        rest.points = 10;
        this.defaultService.addSmartObject(rest).subscribe((so) => {
        });
      });
    });
    this.getPoints('tech');
    rest.id = 'tech';
    rest.type = 'tech';
    rest.creator = training.moderator.code;
    rest.points = 150;
    this.currentTraining = training;
    this.defaultService.addSmartObject(rest).subscribe((so) => {
      this.onSubmit('Confirmed');
    });
  }
  public onChangeModerator() {
    this.currentTraining.moderator.code = this.moderator;
  }
  public onSubmit(trainingStatus) {
    if (this.modalRef) {
      this.modalRef.close();
    }
    const trainingModerator: UserEntry = {
      code: this.moderator,
    };

    const training: TrainingEntry = {
      id: this.currentTraining.id,
      moderator: trainingModerator,
      topic: this.currentTraining.topic,
      subject: this.currentTraining.subject,
      departement: this.currentTraining.departement,
      date: this.currentTraining.date,
      hours: this.currentTraining.hours,
      description: this.currentTraining.description,
      status: trainingStatus,
      urgency: this.currentTraining.urgency,

    };
    this.defaultService.updateTrainings(training).subscribe((so) => {
      this.router.navigate(['/app-trainings/' + trainingStatus]);
      this.getTraining(trainingStatus);
    });
  }
  public addParticipants(trainings, meAsMOderator) {
    if (this.modalRef) {
      this.modalRef.close();
    }
    const ps: ParticipantEntry = {
      participantId: trainings.participantId,
      training: trainings
    };
    // meAsMOderator
    if (meAsMOderator) {
      this.defaultService.getParticipant(trainings.id).subscribe((data) => {
        // eslint-disable-next-line @typescript-eslint/no-shadow
        const trainings = new Array();
        data.forEach(element => {
          trainings.push(element.trainings);
        });
        const user = trainings.find(ob => ob.code === this.userData.code);

        if (!user) {
          ps.trainings = { code: this.userData.code };
          this.defaultService.addParticipants(ps).subscribe((so) => {
          });
        }
      });
    } else {
      // addParticipants
      if (this.trainingParticipants.length < this.participants.length) {
        if (this.trainingParticipants.length > 0) {
          this.participants.forEach(participant => {
            const user = this.trainingParticipants.find(ob => ob.code === participant.code);
            if (!user) {
              // update Participant List
              this.updateParticipantList(participant);
            }

          });
        }
        this.participants.forEach(element => {
          ps.trainings = element;
          this.defaultService.addParticipants(ps).subscribe((so) => {
          });
        });

        //  deleteParticipant
      } else if (this.trainingParticipants.length > this.participants.length) {
        this.trainingParticipants.forEach(participant => {
          const user = this.userNoParticipants.find(ob => ob.code === participant.code);
          if (user) {
            // update Participant List
            this.updateParticipantList(participant);
          }

        });

        this.participants.forEach(element => {
          // find removed participant code
          const removedParticipant = this.trainingParticipants.find(ob => ob.code === element.code);
          // find removed participant participantId
          const removedP = this.trainingParticipantsData.find(trainingParticipan =>
            trainingParticipan.trainings.code === removedParticipant.code);
          this.defaultService.deleteParticipant(removedP.participantId).subscribe((so) => {
          });
        });
      }
    }
  }
  /****************************************/
  /*            private  Methods           */
  /****************************************/
  private getTraining(status) {
    this.defaultService.getTrainings().subscribe((data) => {
      this.trainings = data
        .filter(training => {
          return training.status === status;
        });
      // get distinct smart object
      this.filterUrgency = Array.from(new Set(this.trainings.map(s => s.urgency))).map(y => {
        return { urgency: y };
      });
    });
  }
  private getParticipant(trainingId) {
    this.defaultService.getParticipant(trainingId).subscribe((data) => {
      this.trainingParticipantsData = data;
      const trainings = new Array();
      this.userNoParticipants = this.allUser;

      // get Participants
      data.forEach(element => {
        trainings.push(element.trainings);
      });
      let ps = new Array<any>();
      trainings.forEach(element => {
        const col = { code: element.code };
        ps.push(col);
      });
      this.participants = Array.from(new Set(ps.map(s => s.code))).map(co => {
        return { code: co };
      });
      this.trainingParticipants = this.participants;

      // get No Participant
      if (this.participants.length !== 0) {
        this.participants.forEach(participant => {
          const user = this.userNoParticipants.find(ob => ob.code === participant.code);
          this.getNoParticipant(user);

        });
      }
    });
  }

  private getNoParticipant(participant) {
    const updatedArray = [];
    for (let el of this.userNoParticipants) {
      if (el !== participant) {
        updatedArray.push(el);
      }
    }
    this.userNoParticipants = updatedArray;
  }
  private getUsers() {
    this.defaultService.getUsers().subscribe((data) => {
      this.allUser = data;
      this.moderator = data[0].code;
    });
  }
  private getPoints(propType) {
    this.defaultService.getSmartActionType(propType).subscribe((data) => {
      this.SOpoints = data[0].points;

    });
  }
  private updateParticipantList(participant) {
    const updatedArray = [];
    updatedArray.push(participant);
    this.participants = updatedArray;
  }
}

