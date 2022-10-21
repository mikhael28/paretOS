import API from '@aws-amplify/api';

import React, { useState, useEffect } from 'react';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import LoaderButton from '../components/LoaderButton';

function UpgradeToAdmin(props) {
	const [ users, setUsers ] = useState([]);
	const [ activeUserAdmin, setActiveUserAdmin ] = useState('Not Selected');
	const [ activeUserInstructor, setActiveUserInstructor ] = useState('Not Selected');
	const [ isLoading, setLoading ] = useState(false);

	async function fetchUsers() {
		setLoading(true);
		try {
			const usrs = await API.get('pareto', '/users');
			setUsers(usrs);
		} catch (e) {
			console.log('Error fetching users: ', e);
		}
		setLoading(false);
	}

	function handleChangeAdmin(event) {
		setActiveUserAdmin(event.target.value);
	}

	function handleChangeInstructor(event) {
		setActiveUserInstructor(event.target.value);
	}

	async function handleSubmitAdmin() {
		setLoading(true);
		let body = {
			admin: true
		};
		try {
			let upgrade = await API.put('pareto', `/users/${activeUserAdmin}`, { body });
			console.log(upgrade);
		} catch (e) {
			console.log('error upgrading user: ', e);
		}
		setLoading(false);
	}

	async function handleSubmitInstructor() {
		setLoading(true);
		let body = {
			instructor: true
		};
		try {
			await API.put('pareto', `/users/${activeUserInstructor}`, { body });
		} catch (e) {
			console.log('error upgrading user: ', e);
		}
		setLoading(false);
	}

	useEffect(() => {
		fetchUsers();
	}, []);

	return (
		<div>
			<h1>Upgrade Users</h1>
			<FormGroup controlId="formControlsSelect">
				<ControlLabel>Select User for Admin</ControlLabel>
				<FormControl
					type="text"
					componentClass="select"
					placeholder="Choose User to Upgrade"
					onChange={(event) => handleChangeAdmin(event)}
				>
					{users.map((user, index) => {
						console.log(user);
						return (
							<option value={user.id} key={index}>
								{user.fName} {user.lName}
							</option>
						);
					})}
				</FormControl>
			</FormGroup>
			<LoaderButton
				align="center"
				block
				// disabled={!this.validateForm()}
				bsSize="small"
				// type="submit"
				onClick={handleSubmitAdmin}
				isLoading={isLoading}
				text="Create Match"
				loadingText="Creating..."
			/>
			<br />
			<FormGroup controlId="formControlsSelect">
				<ControlLabel>Select User for Instructor</ControlLabel>
				<FormControl
					type="text"
					componentClass="select"
					placeholder="Choose User to Upgrade"
					onChange={(event) => handleChangeInstructor(event)}
				>
					{users.map((user, index) => {
						return (
							<option value={user.id} key={index}>
								{user.fName} {user.lName}
							</option>
						);
					})}
				</FormControl>
			</FormGroup>
			<LoaderButton
				align="center"
				block
				// disabled={!this.validateForm()}
				bsSize="small"
				// type="submit"
				onClick={handleSubmitInstructor}
				isLoading={isLoading}
				text="Create Match"
				loadingText="Creating..."
			/>
		</div>
	);
}

export default UpgradeToAdmin;
