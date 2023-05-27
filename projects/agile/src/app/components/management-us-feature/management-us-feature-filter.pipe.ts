
import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'managementUSFeatureFilter',
    pure: false
})
export class ManagementUSFeatureFilterPipe implements PipeTransform {
    transform(items: any[], featureCriteria: any[]): any {

        if (featureCriteria[2] === 'features') {
            if (featureCriteria[1] === '' && !featureCriteria[3] && featureCriteria[4] == '0') {
                if (!items || featureCriteria[0].length === 0) {
                    return items;
                }
                if (featureCriteria.length > 0 && featureCriteria[0][0].text === 'DeSelectAll') {
                    return items;
                }
                return items.filter(item => featureCriteria[0].some(f => f.id === item.id));

            } else if (featureCriteria[1] !== '' && !featureCriteria[3] && featureCriteria[4] == '0') {
                if (!items || featureCriteria[0].length === 0) {
                    return items.filter(item => item.userStories.some(userStory => (userStory.shortDescription.search(featureCriteria[1]) !== -1)));
                }
                if (featureCriteria[0].length > 0 && featureCriteria[0][0].text === 'DeSelectAll') {
                    return items.filter(item => item.userStories.some(userStory => userStory.shortDescription.search(featureCriteria[1]) !== -1));
                }
                return items.filter(item => (featureCriteria[0].some(f => ((f.id === item.id)
                    && (item.userStories.some(userStory => userStory.shortDescription.search(featureCriteria[1]) !== -1))))));
            } else if (featureCriteria[1] !== '' && featureCriteria[3] && featureCriteria[4] == '0') {
                if (!items || featureCriteria[0].length === 0) {
                    return items.filter(item => item.userStories.some(userStory => (userStory.shortDescription.search(featureCriteria[1]) !== -1)
                        && (userStory.sprintId == featureCriteria[3])));
                }
                if (featureCriteria[0].length > 0 && featureCriteria[0][0].text === 'DeSelectAll') {
                    return items.filter(item => item.userStories.some(userStory => (userStory.shortDescription.search(featureCriteria[1]) !== -1)
                        && (userStory.sprintId == featureCriteria[3])));
                }
                return items.filter(item => (featureCriteria[0].some(f => ((f.id === item.id)
                    && (item.userStories.some(userStory => (userStory.shortDescription.search(featureCriteria[1]) !== -1)
                        && (userStory.sprintId == featureCriteria[3])))))));

            } else if (featureCriteria[1] === '' && featureCriteria[3] && featureCriteria[4] == '0') {
                if (!items || featureCriteria[0].length === 0) {

                    return items.filter(item => item.userStories.some(userStory => (userStory.sprintId == featureCriteria[3])));
                }
                if (featureCriteria[0].length > 0 && featureCriteria[0][0].text === 'DeSelectAll') {
                    return items.filter(item => item.userStories.some(userStory => userStory.sprintId == featureCriteria[3]));
                }
                return items.filter(item => (featureCriteria[0].some(f => ((f.id === item.id)
                    && (item.userStories.some(userStory => userStory.sprintId == featureCriteria[3]))))));
            } else if (featureCriteria[1] === '' && !featureCriteria[3] && featureCriteria[4] != '0') {
                // cas1
                if (!items || featureCriteria[0].length === 0) {
                    return items.filter(item => item.userStories.some(userStory => userStory.projectName == featureCriteria[4]));
                }
                if (featureCriteria[0].length > 0 && featureCriteria[0][0].text === 'DeSelectAll') {
                    return items.filter(item => item.userStories.some(userStory => userStory.projectName == featureCriteria[4]));
                }
                return items.filter(item => (featureCriteria[0].some(f => ((f.id === item.id)
                    && (item.userStories.some(userStory => userStory.projectName == featureCriteria[4]))))));


            } else if (featureCriteria[1] !== '' && !featureCriteria[3] && featureCriteria[4] != '0') {
                // cas 2
                if (!items || featureCriteria[0].length === 0) {
                    return items.filter(item => item.userStories.some(userStory => (userStory.shortDescription.search(featureCriteria[1]) !== -1)
                        && (userStory.projectName == featureCriteria[4])));
                }
                if (featureCriteria[0].length > 0 && featureCriteria[0][0].text === 'DeSelectAll') {
                    return items.filter(item => item.userStories.some(userStory => (userStory.shortDescription.search(featureCriteria[1]) !== -1)
                        && (userStory.projectName == featureCriteria[4])));
                }
                return items.filter(item => (featureCriteria[0].some(f => ((f.id === item.id)
                    && (item.userStories.some(userStory => (userStory.text.search(featureCriteria[1]) !== -1)
                        && (userStory.projectName == featureCriteria[4])))))));

            } else if (featureCriteria[1] === '' && featureCriteria[3] && featureCriteria[4] != '0') {
                // cas 3
                if (!items || featureCriteria[0].length === 0) {
                    return items.filter(item => item.userStories.some(userStory => (userStory.sprintId == featureCriteria[3])
                        && (userStory.projectName == featureCriteria[4])));
                }
                if (featureCriteria[0].length > 0 && featureCriteria[0][0].text === 'DeSelectAll') {
                    return items.filter(item => item.userStories.some(userStory => (userStory.sprintId == featureCriteria[3])
                        && (userStory.projectName == featureCriteria[4])));
                }
                return items.filter(item => (featureCriteria[0].some(f => ((f.id === item.id)
                    && (item.userStories.some(userStory => (userStory.sprintId == featureCriteria[3])
                        && (userStory.projectName == featureCriteria[4])))))));

            } else if (featureCriteria[1] !== '' && featureCriteria[3] && featureCriteria[4] != '0') {
                // cas 4
                if (!items || featureCriteria[0].length === 0) {
                    return items.filter(item => item.userStories.some(userStory => (userStory.shortDescription.search(featureCriteria[1]) !== -1)
                        && (userStory.sprintId == featureCriteria[3]) && (userStory.projectName == featureCriteria[4])));
                }
                if (featureCriteria[0].length > 0 && featureCriteria[0][0].text === 'DeSelectAll') {
                    return items.filter(item => item.userStories.some(userStory => (userStory.shortDescription.search(featureCriteria[1]) !== -1)
                        && (userStory.sprintId == featureCriteria[3]) && (userStory.projectName == featureCriteria[4])));
                }
                return items.filter(item => (featureCriteria[0].some(f => ((f.id === item.id)
                    && (item.userStories.some(userStory => (userStory.text.search(featureCriteria[1]) !== -1)
                        && (userStory.sprintId == featureCriteria[3]) && (userStory.projectName == featureCriteria[4])))))));

            }
        } else if (featureCriteria[2] === 'userStories') {
            if (featureCriteria[5] && featureCriteria[5].length > 0) {

                if (featureCriteria[1] !== '' && !featureCriteria[3] && featureCriteria[4] == '0') {
                    return items.filter(item => (item.shortDescription.search(featureCriteria[1]) !== -1)
                        && (featureCriteria[5].some(f => f.itemName === item.state)));

                } else if (featureCriteria[3] && featureCriteria[1] !== '' && featureCriteria[4] == '0') {
                    return items.filter(item => (item.sprintId == featureCriteria[3])
                        && (item.shortDescription.search(featureCriteria[1]) !== -1)
                        && (featureCriteria[5].some(f => f.itemName === item.state)));

                } else if (featureCriteria[3] && featureCriteria[1] === '' && featureCriteria[4] == '0') {

                    return items.filter(item => item.sprintId == featureCriteria[3]
                        && (featureCriteria[5].some(f => f.itemName === item.state)));

                } else if (featureCriteria[1] !== '' && !featureCriteria[3] && featureCriteria[4] != '0') {

                    return items.filter(item => (item.shortDescription.search(featureCriteria[1]) !== -1)
                        && (item.projectName == featureCriteria[4])
                        && (featureCriteria[5].some(f => f.itemName === item.state)));

                } else if (featureCriteria[1] === '' && featureCriteria[3] && featureCriteria[4] != '0') {

                    return items.filter(item => (item.sprintId == featureCriteria[3])
                        && (item.projectName == featureCriteria[4])
                        && (featureCriteria[5].some(f => f.itemName === item.state)));

                } else if (featureCriteria[1] !== '' && featureCriteria[3] && featureCriteria[4] != '0') {

                    return items.filter(item => (item.sprintId == featureCriteria[3])
                        && (item.shortDescription.search(featureCriteria[1]) !== -1) && (item.projectName == featureCriteria[4])
                        && (featureCriteria[5].some(f => f.itemName === item.state)));

                } else if (featureCriteria[1] === '' && !featureCriteria[3] && featureCriteria[4] != '0') {

                    return items.filter(item => (item.projectName == featureCriteria[4])
                        && (featureCriteria[5].some(f => f.itemName === item.state)));

                } else {

                    return items.filter(item => featureCriteria[5].some(f => f.itemName === item.state));
                }

            } else {
                if (featureCriteria[1] !== '' && !featureCriteria[3] && featureCriteria[4] == '0') {

                    return items.filter(item => item.shortDescription.search(featureCriteria[1]) !== -1);

                } else if (featureCriteria[3] && featureCriteria[1] !== '' && featureCriteria[4] == '0') {

                    return items.filter(item => (item.sprintId == featureCriteria[3]) && (item.shortDescription.search(featureCriteria[1]) !== -1));

                } else if (featureCriteria[3] && featureCriteria[1] === '' && featureCriteria[4] == '0') {

                    return items.filter(item => item.sprintId == featureCriteria[3]);

                } else if (featureCriteria[1] !== '' && !featureCriteria[3] && featureCriteria[4] != '0') {

                    return items.filter(item => (item.shortDescription.search(featureCriteria[1]) !== -1) && (item.projectName == featureCriteria[4]));

                } else if (featureCriteria[1] === '' && featureCriteria[3] && featureCriteria[4] != '0') {

                    return items.filter(item => (item.sprintId == featureCriteria[3]) && (item.projectName == featureCriteria[4]));

                } else if (featureCriteria[1] !== '' && featureCriteria[3] && featureCriteria[4] != '0') {

                    return items.filter(item => (item.sprintId == featureCriteria[3])
                        && (item.shortDescription.search(featureCriteria[1]) !== -1) && (item.projectName == featureCriteria[4]));

                } else if (featureCriteria[1] === '' && !featureCriteria[3] && featureCriteria[4] != '0') {

                    return items.filter(item => item.projectName == featureCriteria[4]);

                } else {
                    return items;
                }
            }
        }
    }
}
