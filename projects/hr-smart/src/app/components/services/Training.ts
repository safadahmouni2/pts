import {User} from './user';

export class Training {

    id: string;
    subject: string;
    departement = {devolepment : false,
                Quality: false,
                Design: false,
                Other: false};
    date: string;
    Hours: number;
    urgency: string;
    description: string;
    status = {Accepted: false, Rejected: false, Onhold: true };
    creator: User;
    moderator: User;
}






