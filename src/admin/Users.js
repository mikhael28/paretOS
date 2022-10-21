import React, { Component } from 'react';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import Button from 'react-bootstrap/lib/Button';
import Table from 'react-bootstrap/lib/Table';
import API from '@aws-amplify/api';
// import { Page, Text, Image, View, Document, StyleSheet, Link, PDFDownloadLink } from '@react-pdf/renderer';
import ConfirmModal from '../components/ConfirmModal';

export default class Home extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isLoading: false,
			users: [],
			reportUsers: [],
			school: 'all',
			showModal: false,
			deletionId: ''
		};
	}

	async componentDidMount() {
		await this.fetchUsers();
	}

	fetchUsers = async () => {
		const users = await API.get('pareto', '/users');
		this.setState({ users: users });
	};

	handleClose = () => {
		this.setState({ showModal: false });
	};

	renderTable() {
		return (
			<Table striped bordered hover>
				<thead>
					<tr>
						<th>First Name</th>
						<th>Last Name</th>
						<th>ID</th>
						<th>Email</th>
					</tr>
				</thead>
				<tbody>{this.renderStudentsTable(this.state.users)}</tbody>
			</Table>
		);
	}

	renderStudentsTable(users) {
		return users.map((user, i) => {
			return (
				<React.Fragment>
					<tr key={i}>
						<td>{user.fName}</td>
						<td>{user.lName}</td>
						<td>{user.id.substring(0, 5)}</td>
						<td>{user.email}</td>
						<td>
							<Button
								onClick={() => {
									alert(
										JSON.stringify({
											...user,
											notes: ''
										})
									);
								}}
							>
								View
							</Button>
							<Button onClick={() => this.setState({ showModal: true, deletionId: user.id })}>
								Delete
							</Button>
						</td>
					</tr>

				</React.Fragment>
			);
		});
	}

	render() {
		// const styles = StyleSheet.create({
		// 	page: {
		// 		padding: 30
		// 	},
		// 	experience: {
		// 		container: {
		// 			flex: 1,
		// 			paddingTop: 30,
		// 			paddingLeft: 15,
		// 			'@media max-width: 400': {
		// 				paddingTop: 10,
		// 				paddingLeft: 0
		// 			}
		// 		},
		// 		entryContainer: {
		// 			marginBottom: 10
		// 		},
		// 		date: {
		// 			fontSize: 11
		// 			// fontFamily: 'Lato Italic',
		// 		},
		// 		detailContainer: {
		// 			flexDirection: 'row'
		// 		},
		// 		detailLeftColumn: {
		// 			flexDirection: 'column',
		// 			marginLeft: 10,
		// 			marginRight: 10
		// 		},
		// 		detailRightColumn: {
		// 			flexDirection: 'column',
		// 			flexGrow: 9
		// 		},
		// 		bulletPoint: {
		// 			fontSize: 10
		// 		},
		// 		details: {
		// 			fontSize: 10
		// 			// fontFamily: 'Lato',
		// 		},
		// 		headerContainer: {
		// 			flexDirection: 'row',
		// 			marginBottom: 10
		// 		},
		// 		leftColumn: {
		// 			flexDirection: 'column',
		// 			flexGrow: 9
		// 		},
		// 		rightColumn: {
		// 			flexDirection: 'column',
		// 			flexGrow: 1,
		// 			alignItems: 'flex-end',
		// 			justifySelf: 'flex-end'
		// 		},
		// 		title: {
		// 			fontSize: 11,
		// 			color: 'black',
		// 			textDecoration: 'none'
		// 			// fontFamily: 'Lato Bold',
		// 		}
		// 	},
		// 	list: {
		// 		item: {
		// 			flexDirection: 'row',
		// 			marginBottom: 5
		// 		},
		// 		bulletPoint: {
		// 			width: 10,
		// 			fontSize: 10
		// 		},
		// 		itemContent: {
		// 			flex: 1,
		// 			fontSize: 10
		// 			// fontFamily: 'Lato',
		// 		}
		// 	},
		// 	ideas: {
		// 		title: {
		// 			// fontFamily: 'Lato Bold',
		// 			fontSize: 11,
		// 			marginBottom: 10
		// 		},
		// 		ideas: {
		// 			// fontFamily: 'Lato',
		// 			fontSize: 10,
		// 			marginBottom: 10
		// 		}
		// 	},

		// 	title: {
		// 		// fontFamily: 'Lato Bold',
		// 		fontSize: 14,
		// 		marginBottom: 10,
		// 		textTransform: 'uppercase'
		// 	},
		// 	container: {
		// 		flex: 1,
		// 		flexDirection: 'row',
		// 		'@media max-width: 400': {
		// 			flexDirection: 'column'
		// 		}
		// 	},
		// 	image: {
		// 		marginBottom: 10
		// 	},
		// 	leftColumn: {
		// 		flexDirection: 'column',
		// 		width: 170,
		// 		paddingTop: 30,
		// 		paddingRight: 15
		// 	},
		// 	rightColumn: {
		// 		fontSize: 10
		// 	},
		// 	footer: {
		// 		fontSize: 12,
		// 		// fontFamily: 'Lato Bold',
		// 		textAlign: 'center',
		// 		marginTop: 25,
		// 		paddingTop: 10,
		// 		borderWidth: 3,
		// 		borderColor: 'gray',
		// 		borderStyle: 'dashed',
		// 		'@media orientation: landscape': {
		// 			marginTop: 10
		// 		}
		// 	},
		// 	education: {
		// 		container: {
		// 			marginBottom: 10
		// 		},
		// 		fontSize: 14
		// 	},
		// 	header: {
		// 		container: {
		// 			flexDirection: 'row',
		// 			borderBottomWidth: 2,
		// 			borderBottomColor: '#112131',
		// 			borderBottomStyle: 'solid',
		// 			alignItems: 'stretch'
		// 		},
		// 		detailColumn: {
		// 			flexDirection: 'column',
		// 			flexGrow: 9
		// 		},
		// 		linkColumn: {
		// 			flexDirection: 'column',
		// 			flexGrow: 2,
		// 			alignSelf: 'flex-end',
		// 			justifySelf: 'flex-end'
		// 		},
		// 		name: {
		// 			fontSize: 24,
		// 			textTransform: 'uppercase'
		// 			// fontFamily: 'Lato Bold',
		// 		},
		// 		subtleName: {
		// 			fontSize: 24,
		// 			marginTop: 26
		// 		},
		// 		subtitle: {
		// 			fontSize: 10,
		// 			justifySelf: 'flex-end',
		// 			textTransform: 'uppercase'
		// 			// fontFamily: 'Lato',
		// 		},
		// 		link: {
		// 			// fontFamily: 'Lato',
		// 			fontSize: 10,
		// 			color: 'black',
		// 			textDecoration: 'none',
		// 			alignSelf: 'flex-end',
		// 			justifySelf: 'flex-end'
		// 		}
		// 	}
		// });

		return (
			<div style={{ marginTop: 10, marginRight: 20 }}>
				<h1>Student Information</h1>
				{/* <PDFDownloadLink
					document={
						<Document>
							{this.state.users.map((user, i) => {
								return (
									<React.Fragment>
										{this.state.school === user.school ? (
											<Page size="A4" style={styles.page} key={i}>
												<View style={styles.header.container}>
													<View style={styles.header.detailColumn}>
														<Text style={styles.header.name}>
															{user.fName} {user.lName}
														</Text>
														<Text style={styles.header.subtitle}>
															Student at {user.school} - {user.city}
														</Text>
													</View>
													<View style={styles.header.linkColumn}>
														<Link style={styles.header.link}>Latino Community Fund</Link>
													</View>
												</View>

												<View
													style={{
														display: 'flex',
														flexDirection: 'row',
														marginTop: 20
													}}
												>
													<View style={styles.leftColumn}>
														<Image src={user.picture} style={styles.image} />
													</View>
													<View>
														<Text style={{ marginRight: 160, marginTop: 26 }}>
															{user.summary}
														</Text>
													</View>
												</View>

												<Text style={styles.header.subtleName}>Project Notes & Ideas</Text>
												{user.ideas.map((idea, i) => <Text key={i}>{idea}</Text>)}

												<Text style={styles.header.subtleName}>Projects</Text>
												{user.projects.map((project, idx) => {
													return (
														<View>
															<Text key={idx}>{project.name}</Text>
															<Text>{project.description}</Text>
															<Text>{project.github}</Text>
														</View>
													);
												})}

												<Text style={styles.header.subtleName}>Room for Notes</Text>
												<Text>Use your pen and pencil to jot notes down.</Text>
											</Page>
										) : null}
									</React.Fragment>
								);
							})}
						</Document>
					}
					fileName="report.pdf"
				>
					Download
				</PDFDownloadLink> */}
				{this.renderTable()}
				<ConfirmModal
					show={this.state.showModal}
					handleClose={this.handleClose}
					id={this.state.deletionId}
					fetchUsers={this.fetchUsers}
				/>
			</div>
		);
	}
}
