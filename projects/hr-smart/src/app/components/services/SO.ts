import {User} from './user';
export class SO {
    creator: User;
    type: string;
    points: number = 0;
    subject: string;
    departement = {devolepment : false,
        Quality: false,
        Design: false,
        Other: false};
    date: string;
    Hours: number;
    description: string;
    status = {Accepted: false, Rejected: false, Onhold: true };
    urgency: string;
    createdAt: Date;
    updator: User;
    updatedAt: Date;
    moderator:string;

}
