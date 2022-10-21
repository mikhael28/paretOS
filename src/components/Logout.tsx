import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth } from '@aws-amplify/auth'

export default function Logout() {
	const navigate = useNavigate();

	async function logout() {
		await Auth.signOut();
		navigate('/');
		window.location.reload();
	}

	useEffect(() => {
		if (window.location.pathname === '/logout') {
			logout();
		}
	}, [])
	return (
		<div></div>
	)
}