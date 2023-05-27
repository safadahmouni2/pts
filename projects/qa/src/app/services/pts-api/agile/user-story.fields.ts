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
  
export const userStory = `{  
    id
    ticketId
    stateId
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
  
 