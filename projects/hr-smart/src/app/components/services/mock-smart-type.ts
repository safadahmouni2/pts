import {SmartActionType} from './SmartActionType';
export const SmartTypes: SmartActionType[] = [
    {
        id: 'pfe',
        name: 'Supervision of final year project',
        points: 150,
        affectedSkills: [ 'DOCU', 'Tech', 'Skill', 'Resources', 'team leadership']
    },
    {
        id: 'trainee',
        name: 'Supervision of Student Trainee',
        points: 100,
        affectedSkills: ['DOCU', 'Tech', 'Skill', 'Resources', 'team leadership']
    },
    {
        id: 'tech',
        name: 'Training new technologies',
        points: 150,
        affectedSkills: ['DOCU', 'Tech', 'Skill', 'team building', 'team leadership', 'improvement internal process']
    },
    {
        id: 'emp',
        name: 'Supervision of new employee',
        points: 100,
        affectedSkills: ['Skill', 'Resources', 'team building', 'team leadership', 'improvement internal process']
    },
    {
        id: 'rec',
        name: 'Recommandation of new employee',
        points: 500,
        affectedSkills: ['Resources']
    },
    {
        id: 'p.pfe',
        name: 'Proposition of subject PFE',
        points: 20,
        affectedSkills: [ 'DOCU', 'Tech']
    },
    {
        id: 'p.trn',
        name: 'Proposition of trainee',
        points: 15,
        affectedSkills: ['DOCU', 'Tech']
    },
    {
        id: 'p.tech',
        name: 'Proposition of training',
        points: 30,
        affectedSkills: [ 'DOCU', 'Tech']
    },
    {
        id: 'recr',
        name: 'Interview Candidate',
        points: 15,
        affectedSkills: ['Skill', 'team leadership']
    },
    {
        id: 'tba',
        name: 'team buildin action',
        points: 50,
        affectedSkills: ['motivation', 'team building', 'team leadership', 'improvement internal process']
    },
    {
        id: 'pro',
        name: 'Process review / optimization',
        points: 300,
        affectedSkills: ['DOCU', 'Skill', 'team building', 'team leadership', 'crisis mgement', 'improvement internal process']
    },
    {
        id: 'pt',
        name: 'Participate in trainings/ workshops',
        points: 10,
        affectedSkills: ['Tech', 'Skill', 'motivation', 'team building']
    }
];

