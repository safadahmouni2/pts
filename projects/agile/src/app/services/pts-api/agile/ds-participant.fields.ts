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
  
  export const dailyScrum = `{
    id
    ticketId
    stateId
    startedAt
    finishedAt
    sprintProgress
    ticketId
    stateId
    sprint ${sprint}
  }`
  ;
export const dsParticipant = `{
    id,
    stateId,
    userId,
    userCode,
    dailyScrum ${dailyScrum},
    ticketId
    }`;

    