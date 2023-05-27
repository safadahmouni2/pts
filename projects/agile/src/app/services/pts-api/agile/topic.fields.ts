export const topic = `{
  id
  name
  description
  displayOrder
  project
  ticketId
  stateId
  productId
}`
;


export const topics = `{
  items ${topic}
}`; 
export const TopicMaxOrderOutput = `{
  maxOrder
}`;
