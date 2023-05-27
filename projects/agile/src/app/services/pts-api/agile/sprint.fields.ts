export const sprintItem = `{
  id
  name
  startDate
  endDate
  stateId
  dsMeetingUrl
  ticketId
}`
;

export const sprintDetail = `{
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

export const sprints = `{
  items ${sprintItem}
}`; 

export const StateCount = `{
  stateId
  count
}`

export const StateCounts = `{
  items ${StateCount}
}`; 