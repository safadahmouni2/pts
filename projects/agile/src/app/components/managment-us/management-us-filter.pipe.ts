
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'managementUSFilter',
    pure: false
})
export class ManagementUSFilterPipe implements PipeTransform {
    transform(items: any[], topicCriteria: any[]): any {

        if (topicCriteria[2] === 'topics') {
            if (topicCriteria[1] === '' && !topicCriteria[3] && topicCriteria[4] == '0') {
                if (!items || topicCriteria[0].length === 0) {
                    return items;
                }
                if (topicCriteria.length > 0 && topicCriteria[0][0].text === 'DeSelectAll') {
                    return items;
                }
                return items.filter(item => topicCriteria[0].some(f => f.id === item.id));

            } else if (topicCriteria[1] !== '' && !topicCriteria[3] && topicCriteria[4] == '0') {
                if (!items || topicCriteria[0].length === 0) {
                    return items.filter(item => item.userStories.some(userStory => (userStory.shortDescription.search(topicCriteria[1]) !== -1)));
                }
                if (topicCriteria[0].length > 0 && topicCriteria[0][0].text === 'DeSelectAll') {
                    return items.filter(item => item.userStories.some(userStory => userStory.shortDescription.search(topicCriteria[1]) !== -1));
                }
                return items.filter(item => (topicCriteria[0].some(f => ((f.id === item.id)
                    && (item.userStories.some(userStory => userStory.shortDescription.search(topicCriteria[1]) !== -1))))));
            } else if (topicCriteria[1] !== '' && topicCriteria[3] && topicCriteria[4] == '0') {
                if (!items || topicCriteria[0].length === 0) {
                    return items.filter(item => item.userStories.some(userStory => (userStory.shortDescription.search(topicCriteria[1]) !== -1)
                        && (userStory.sprintId == topicCriteria[3])));
                }
                if (topicCriteria[0].length > 0 && topicCriteria[0][0].text === 'DeSelectAll') {
                    return items.filter(item => item.userStories.some(userStory => (userStory.shortDescription.search(topicCriteria[1]) !== -1)
                        && (userStory.sprintId == topicCriteria[3])));
                }
                return items.filter(item => (topicCriteria[0].some(f => ((f.id === item.id)
                    && (item.userStories.some(userStory => (userStory.shortDescription.search(topicCriteria[1]) !== -1)
                        && (userStory.sprintId == topicCriteria[3])))))));

            } else if (topicCriteria[1] === '' && topicCriteria[3] && topicCriteria[4] == '0') {
                if (!items || topicCriteria[0].length === 0) {

                    return items.filter(item => item.userStories.some(userStory => (userStory.sprintId == topicCriteria[3])));
                }
                if (topicCriteria[0].length > 0 && topicCriteria[0][0].text === 'DeSelectAll') {
                    return items.filter(item => item.userStories.some(userStory => userStory.sprintId == topicCriteria[3]));
                }
                return items.filter(item => (topicCriteria[0].some(f => ((f.id === item.id)
                    && (item.userStories.some(userStory => userStory.sprintId == topicCriteria[3]))))));
            } else if (topicCriteria[1] === '' && !topicCriteria[3] && topicCriteria[4] != '0') {
                // cas1
                if (!items || topicCriteria[0].length === 0) {
                    return items.filter(item => item.userStories.some(userStory => userStory.projectName == topicCriteria[4]));
                }
                if (topicCriteria[0].length > 0 && topicCriteria[0][0].text === 'DeSelectAll') {
                    return items.filter(item => item.userStories.some(userStory => userStory.projectName == topicCriteria[4]));
                }
                return items.filter(item => (topicCriteria[0].some(f => ((f.id === item.id)
                    && (item.userStories.some(userStory => userStory.projectName == topicCriteria[4]))))));


            } else if (topicCriteria[1] !== '' && !topicCriteria[3] && topicCriteria[4] != '0') {
                // cas 2
                if (!items || topicCriteria[0].length === 0) {
                    return items.filter(item => item.userStories.some(userStory => (userStory.shortDescription.search(topicCriteria[1]) !== -1)
                        && (userStory.projectName == topicCriteria[4])));
                }
                if (topicCriteria[0].length > 0 && topicCriteria[0][0].text === 'DeSelectAll') {
                    return items.filter(item => item.userStories.some(userStory => (userStory.shortDescription.search(topicCriteria[1]) !== -1)
                        && (userStory.projectName == topicCriteria[4])));
                }
                return items.filter(item => (topicCriteria[0].some(f => ((f.id === item.id)
                    && (item.userStories.some(userStory => (userStory.shortDescription.search(topicCriteria[1]) !== -1)
                        && (userStory.projectName == topicCriteria[4])))))));

            } else if (topicCriteria[1] === '' && topicCriteria[3] && topicCriteria[4] != '0') {
                // cas 3
                if (!items || topicCriteria[0].length === 0) {
                    return items.filter(item => item.userStories.some(userStory => (userStory.sprintId == topicCriteria[3])
                        && (userStory.projectName == topicCriteria[4])));
                }
                if (topicCriteria[0].length > 0 && topicCriteria[0][0].text === 'DeSelectAll') {
                    return items.filter(item => item.userStories.some(userStory => (userStory.sprintId == topicCriteria[3])
                        && (userStory.projectName == topicCriteria[4])));
                }
                return items.filter(item => (topicCriteria[0].some(f => ((f.id === item.id)
                    && (item.userStories.some(userStory => (userStory.sprintId == topicCriteria[3])
                        && (userStory.projectName == topicCriteria[4])))))));

            } else if (topicCriteria[1] !== '' && topicCriteria[3] && topicCriteria[4] != '0') {
                // cas 4
                if (!items || topicCriteria[0].length === 0) {
                    return items.filter(item => item.userStories.some(userStory => (userStory.shortDescription.search(topicCriteria[1]) !== -1)
                        && (userStory.sprintId == topicCriteria[3]) && (userStory.projectName == topicCriteria[4])));
                }
                if (topicCriteria[0].length > 0 && topicCriteria[0][0].text === 'DeSelectAll') {
                    return items.filter(item => item.userStories.some(userStory => (userStory.shortDescription.search(topicCriteria[1]) !== -1)
                        && (userStory.sprintId == topicCriteria[3]) && (userStory.projectName == topicCriteria[4])));
                }
                return items.filter(item => (topicCriteria[0].some(f => ((f.id === item.id)
                    && (item.userStories.some(userStory => (userStory.shortDescription.search(topicCriteria[1]) !== -1)
                        && (userStory.sprintId == topicCriteria[3]) && (userStory.projectName == topicCriteria[4])))))));

            }
        } else if (topicCriteria[2] === 'userStories') {
            if (topicCriteria[5] && topicCriteria[5].length > 0) {

                if (topicCriteria[1] !== '' && !topicCriteria[3] && topicCriteria[4] == '0') {
                    return items.filter(item => (item.shortDescription.search(topicCriteria[1]) !== -1)
                        && (topicCriteria[5].some(f => f.itemName === item.state)));

                } else if (topicCriteria[3] && topicCriteria[1] !== '' && topicCriteria[4] == '0') {
                    return items.filter(item => (item.sprintId == topicCriteria[3])
                        && (item.shortDescription.search(topicCriteria[1]) !== -1)
                        && (topicCriteria[5].some(f => f.itemName === item.state)));

                } else if (topicCriteria[3] && topicCriteria[1] === '' && topicCriteria[4] == '0') {

                    return items.filter(item => item.sprintId == topicCriteria[3]
                        && (topicCriteria[5].some(f => f.itemName === item.state)));

                } else if (topicCriteria[1] !== '' && !topicCriteria[3] && topicCriteria[4] != '0') {

                    return items.filter(item => (item.shortDescription.search(topicCriteria[1]) !== -1)
                        && (item.projectName == topicCriteria[4])
                        && (topicCriteria[5].some(f => f.itemName === item.state)));

                } else if (topicCriteria[1] === '' && topicCriteria[3] && topicCriteria[4] != '0') {

                    return items.filter(item => (item.sprintId == topicCriteria[3])
                        && (item.projectName == topicCriteria[4])
                        && (topicCriteria[5].some(f => f.itemName === item.state)));

                } else if (topicCriteria[1] !== '' && topicCriteria[3] && topicCriteria[4] != '0') {

                    return items.filter(item => (item.sprintId == topicCriteria[3])
                        && (item.shortDescription.search(topicCriteria[1]) !== -1) && (item.projectName == topicCriteria[4])
                        && (topicCriteria[5].some(f => f.itemName === item.state)));

                } else if (topicCriteria[1] === '' && !topicCriteria[3] && topicCriteria[4] != '0') {

                    return items.filter(item => (item.projectName == topicCriteria[4])
                        && (topicCriteria[5].some(f => f.itemName === item.state)));

                } else {

                    return items.filter(item => topicCriteria[5].some(f => f.itemName === item.state));
                }

            } else {
                if (topicCriteria[1] !== '' && !topicCriteria[3] && topicCriteria[4] == '0') {

                    return items.filter(item => item.shortDescription.search(topicCriteria[1]) !== -1);

                } else if (topicCriteria[3] && topicCriteria[1] !== '' && topicCriteria[4] == '0') {

                    return items.filter(item => (item.sprintId == topicCriteria[3]) && (item.shortDescription.search(topicCriteria[1]) !== -1));

                } else if (topicCriteria[3] && topicCriteria[1] === '' && topicCriteria[4] == '0') {

                    return items.filter(item => item.sprintId == topicCriteria[3]);

                } else if (topicCriteria[1] !== '' && !topicCriteria[3] && topicCriteria[4] != '0') {

                    return items.filter(item => (item.shortDescription.search(topicCriteria[1]) !== -1) && (item.projectName == topicCriteria[4]));

                } else if (topicCriteria[1] === '' && topicCriteria[3] && topicCriteria[4] != '0') {

                    return items.filter(item => (item.sprintId == topicCriteria[3]) && (item.projectName == topicCriteria[4]));

                } else if (topicCriteria[1] !== '' && topicCriteria[3] && topicCriteria[4] != '0') {

                    return items.filter(item => (item.sprintId == topicCriteria[3])
                        && (item.shortDescription.search(topicCriteria[1]) !== -1) && (item.projectName == topicCriteria[4]));

                } else if (topicCriteria[1] === '' && !topicCriteria[3] && topicCriteria[4] != '0') {

                    return items.filter(item => item.projectName == topicCriteria[4]);

                } else {
                    return items;
                }
            }
        }
    }
}
