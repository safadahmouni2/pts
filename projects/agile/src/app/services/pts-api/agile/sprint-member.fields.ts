export const sprintMemberItem = `{
	id
	stateId
  	userCode
  	role
  	sprintId
}`;

export const sprintMemberDetail = `{
	stateId
  	userCode
  	role
  	sprintId
}`;

export const sprintMembers = `{
    items ${sprintMemberItem}
}`;