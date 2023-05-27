export class Task {
    id: number;
    type: string;
    text: string;
    responsibleCode: string;
    state: string;
    stateId: number;
    productId:number;
    project: string;
    prio: string;
    estimation: string;

    displayProperties(): { abreviation: string, class: string } {
        const display = {
            abreviation: ((this.type) ? this.type.charAt(0) : ''),
            class: 'unknown-task'
        };
        switch (this.type) {
            case ('Ticket'): {
                display.class = 'ticket';
                break;
            }
            case ('Requirement'): {
                display.class = 'requirement';
                break;
            }
            case ('Maintenance'): {
                display.class = 'requirement';
                break;
            }
            case ('Change'): {
                display.class = 'requirement';
                break;
            }
            case ('Problem'): {
                display.class = 'problem';
                break;
            }
        }
        return display;
    }
}
