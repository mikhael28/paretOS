import React from 'react';

export default function Admin(props) {
	return (
		<div style={{ marginRight: 10 }}>
			<h1>Admin Controls</h1>
			<p>
				Welcome to the Admin controls. You currently have {props.users.length} users,{' '}
				{props.relationships.length} mentorship connections.
			</p>
			{props.users.map((user, idx) => {
				return (
					<p key={idx}>
						{user.fName} {user.lName}: {user.email}
					</p>
				);
			})}
		</div>
	);
}
