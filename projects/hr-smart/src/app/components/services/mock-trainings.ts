import {Training} from './Training';
import {USERS} from './mock-users';

export const TRAININGS: Training[] =
[ {
    id: '001',
    subject: 'Data Mining',
    departement: {devolepment : true,
        Quality: false,
        Design: false,
        Other: false},
    date: '01/02/2019',
    Hours: 3,
    urgency: 'High',
    description:'Data mining is the process of finding anomalies, patterns and correlations within large data sets to predict outcomes. Using a broad range of techniques, you can use this information to increase revenues, cut costs, improve customer relationships, reduce risks and more.',
    status: {Accepted: false, Rejected: false, Onhold: true },
    creator: USERS[1],
    moderator: USERS[0]

}
];
