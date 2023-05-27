export class Proposition {
    user: string;
    type = 'Training';
    points: number;
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
}
