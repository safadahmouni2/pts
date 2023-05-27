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
export const dsParticipant = `{
  id,
  stateId,
  userId,
  userCode,
  ticketId
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
  dsParticipants ${dsParticipant}
  creator
}`
export const myDailyScrum = `{
  sprintId
	sprintTicketId
	sprintName
	startDate
	endDate
	dsStartTime
	dsEndTime
	dsDuration
	dsStartedAt
	dsFinishedAt
	dsStatusInfo
	sprintProgress
  productId
  scrumMasterBySprint
}`

export const myDailyScrums = `{
  items ${myDailyScrum}
}`; 
;