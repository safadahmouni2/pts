export const topic = `{
    id
    name
    description
    displayOrder
    project
    ticketId
    stateId
  }`
  ;
  export const sprint = `{
    id
    productId
    ticketId
    stateId
    name
    startDate
    endDate
    dsStartTime
    dsDuration
    shortName
    project
    parent
    dsMeetingUrl
  }`
  ;
  
  export const feature = `{
    id
    name
    description
    project
    stateId
    displayOrder
  }`;
  
export const userStory = `{  
    id
    ticketId
    stateId
    topic ${topic}
    feature ${feature}
    parentTicketId
    parentUsTicketId
    productId
    project
    sprint ${sprint}
    shortDescription
    longDescription
    responsibleId
    urgencyId
    progress
    storyPoints
    orderByTopic
    acceptanceCriteria  
    userCode,
    project  
  }`
  ;

  export const userStories = `{
    items ${userStory}
}`;
  
 