import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import * as io from 'socket.io-client';
import { environment } from '../../environments/environment';


@Injectable()
export class SocketioService {
  // private socket = io( environment.apiNotification);
  private url = environment.apiNotification;  
  private socket;

  dsSendNotification(ds, sprint, state, startTime) {
    this.socket.emit(state, { ds: ds, sprint: sprint, startTime: startTime });
    console.log('socket service : DsSendNotification ', ds);
  }


  getDsNotification(state) {

    return new Observable(observer => {
      this.socket = io.connect(this.url);
      this.socket.on(state, (data) => {
        observer.next(data);    
      });
      return () => {
        this.socket.disconnect();
      };  
    })     
  }


  newUserNotification(userId, userCode, ds, sprint) {
    this.socket.emit('user-joined', { user: userId, userCode: userCode, ds: ds, sprint: sprint });
  }


  getNewUserNotification() {
    return new Observable(observer => {
      this.socket = io.connect(this.url);
      this.socket.on('user-joined', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
  }

  sendNewUserTalking(idUser: number, userCode: string, state: string, dsId: number, sprintId: number) {
    this.socket.emit('user-talking', { user: idUser, userCode: userCode, state: state, dsId: dsId, sprintId: sprintId });
  }


  getNewUserTalking() {
    return new Observable(observer => {
      this.socket = io.connect(this.url);
      this.socket.on('user-talking', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
  }





  updateUserStoryNotification(notification) {
    console.log('notification SocketService: ', notification);
    this.socket.emit('us-update', notification);
  }

  getUpdatedUserStoryNotification() {
    this.socket = io.connect(this.url);
    return new Observable(observer => {
      this.socket.on('us-update', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
  }






  sendMessage(message) {
    this.socket.emit('add-message', message);
  }


  sendLoggedUser(user) {
    this.socket.emit('add-user', user);
  }


  getMessages() {
    return new Observable(observer => {
      this.socket = io.connect(this.url);
      this.socket.on('message', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
  }

  getLoggedUsers() {
    return new Observable(observer => {
      this.socket = io.connect(this.url);
      this.socket.on('user', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
  }

  deleteUser(user) {
    this.socket.emit('delete-user', user);
  }

  getLoggedOutUser() {
    return new Observable(observer => {
      this.socket = io.connect(this.url);
      this.socket.on('loggedout-user', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
  }


  setUserStatus(user) {
    this.socket.emit('onstatuschage-user', user);
  }


  getUserStatus() {
    return new Observable(observer => {
      this.socket = io.connect(this.url);
      this.socket.on('user-statuschanged', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
  }



}
