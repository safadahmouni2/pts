import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { SectionDto } from '../../dto/section-dto';
import { MessageService } from '../../services/message.service';
import { SectionService } from '../../services/section.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TicketService } from '../../services/ticket.service';
import { SectionMessage } from '../../dto/section-message';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  ticketId = 10482614;

  tabMessage: any = [];
  tabSection: any = [];
  description: String
  ticket: any;
  tabIsEdit: boolean[] = [];
  i: number;
  showBox: boolean[] = [];
  sectionId: number;
  sectionMessage: any = []
  tabSectionUpdated: SectionDto[] = [];
  sectionUpdated: SectionDto = new SectionDto();
  tabTitle: String[] = [];
  isReady =false;



  constructor(private matIconRegistry: MatIconRegistry,
    private domSanitzer: DomSanitizer,
    private messageService: MessageService,
    private ticketService: TicketService,
    private route: Router,
    private sectionService: SectionService,
    private router: ActivatedRoute) {
    this.matIconRegistry.addSvgIcon('edit_outline', this.domSanitzer.bypassSecurityTrustResourceUrl('assets/icons/edit_outline.svg'));
    this.matIconRegistry.addSvgIcon('save_outline', this.domSanitzer.bypassSecurityTrustResourceUrl('assets/icons/save_outline.svg'));
  }

  ngOnInit(): void {
    //Retreive id from the route
    //this.ticketId=this.router.snapshot.params['id'];
    this.messageService.getMessageByTicket(this.ticketId).subscribe(res => {
      this.tabMessage = res;
      

      this.sectionService.getSectionByTicket(this.ticketId).subscribe(res => {
        this.tabSection = res;
        
        //ordonner les messages 
        for (let i: number = 0; i < this.tabSection.length; i++) {
          let x: number;
          let Changed = false;
          do {
            Changed = false;
            for (let j: number = 0; j < this.tabSection[i].sectionMessageList.length-1; j++) {
              if (this.tabSection[i].sectionMessageList[j].order > this.tabSection[i].sectionMessageList[j + 1].order) {
                x = this.tabSection[i].sectionMessageList[j];
                this.tabSection[i].sectionMessageList[j] = this.tabSection[i].sectionMessageList[j + 1];
                this.tabSection[i].sectionMessageList[j + 1] = x;
                Changed = true;
              }
            }
          } while (Changed); 
        }
        
        //fill tabIsEdit with initial values
        /* for (this.i = 0; this.i < this.tabSection.length; this.i++) {
          this.tabIsEdit[this.i] = false;
        } */


        //add all messages of section to sectionMessage)

        for (let i: number = 0; i < this.tabSection.length; i++) {
          for (let j: number = 0; j < this.tabSection[i].sectionMessageList.length; j++) {
            this.sectionMessage.push(this.tabSection[i].sectionMessageList[j].messageDto);
          }
        }
       
        //remove message from tabMessage displayed in section 
        let before = this.sectionMessage
        
        for (let k: number = 0; k < this.sectionMessage.length; k++) {
          for (let i = 0; i < this.tabMessage.length; i++) {
            if (this.sectionMessage[k].id == this.tabMessage[i].id) {
              this.tabMessage.splice(i, 1);
            }
          }
        }
        let newTabMsg = []
        for (let i = 0; i < this.tabMessage.length; i++) {
              let sm =  new SectionMessage ()
              sm.messageDto = this.tabMessage[i];              
              newTabMsg.push(sm)   
        }
        this.tabMessage = newTabMsg;              
        this.isReady = true;
      })
    });
    
    


    this.ticketService.getTicket(this.ticketId).subscribe(res => {
      this.ticket = res;
      this.description = this.ticket.description;


    })

  }

  addSection(id: number) {

    const x: number = this.tabSection.length;
    const sectionDto: SectionDto = {

      title: 'Section' + (x + 1),
      ticketId: id,
      creationDate: new Date()

    };
    this.sectionService.postSection(sectionDto).subscribe(res => {
      //add new section to tabsection 
      this.tabSection.push(res);

    });
  }

  editSection(idSection, index: number) {
    this.sectionUpdated = {
      title: this.tabTitle[index],
      ticketId: this.ticketId,
      creationDate: null,


    }
    
    this.sectionService.editSection(idSection, this.sectionUpdated).subscribe(res => {
      this.tabSection[index].title = res.title;

      

    })
  }
  drop(event: CdkDragDrop<SectionMessage[]>, idSection) {
    if (event.previousContainer === event.container) {
      let id = event.previousContainer.data[event.previousIndex].messageDto.id;
      let order = event.currentIndex
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      this.sectionService.assignMessageToSection(idSection, id , order).subscribe(res => console.log(res));
    } else {
      //console.log(event);
      
      let messageId = event.previousContainer.data[event.previousIndex].messageDto.id;
      let order= event.currentIndex
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      this.sectionService.assignMessageToSection(idSection, messageId, order).subscribe(res => console.log(res))
    }

  }



}

