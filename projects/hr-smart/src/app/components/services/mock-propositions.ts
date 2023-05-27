import {Proposition} from './Proposition';

export const PROPOSITIONS: Proposition[] = [
    { user: 'ali',
      type: 'Proposition of PFE',
      points: 150,
      subject: 'subject 01',
      departement: {devolepment : false,
        Quality: false,
        Design: false,
        Other: false},
      date: '19/01/2019',
      Hours: 0,
      description: ' it gives students a chance to demonstrate all they have learned.The project module is very different from other modules. Although students are supervised, the onus is on the student to define the problem boundaries, to investigate possible solutions, and to present the results in writing, verbally and in action. ',
      status: {Accepted: true, Rejected: false, Onhold: false } ,
      urgency: 'Extremly urgent'
    },
    {
     user: 'salah',
    type: 'Proposition of technology',
      points: 100,
      subject: 'subject 02',
      departement: {devolepment : false,
        Quality: false,
        Design: false,
        Other: false},
      date: '18/01/2019',
      Hours: 0,
      description:'There were huge advances in aviation technology during the Second World War. Satellite technology offers the opportunity, as never before, for continuous television coverage of major international events. With computer technology, even people working on their own can produce professional-looking documents.',
      status: {Accepted: false, Rejected: true, Onhold: false } ,
      urgency: 'Urgent'
    },
    {
      user:  'mohamed',
      type:  'Recommandation Emp',
      points: 500,
      subject: 'subject 03',
      departement: {devolepment : false,
        Quality: false,
        Design: false,
        Other: false},
      date: '17/01/2019',
      Hours: 0,
      description:'I highly recommend Jane Doe as a candidate for employment. Jane was employed by ABC Company as an Administrative Assistant from 20XX to 20XX. Jane was responsible for office support, including word processing, scheduling appointments and creating brochures, newsletters, and other office literature.',
      status: {Accepted: false, Rejected: false, Onhold: true } ,
      urgency: 'High'
    }

   ];
