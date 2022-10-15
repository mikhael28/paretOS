import React, { Component } from 'react';
import API from '@aws-amplify/api';
import LoaderButton from '../components/LoaderButton';
import { errorToast } from '../libs/toasts';

export default class Relationships extends Component {
	constructor(props) {
		super(props);

		this.state = {
			relationships: [],
			templates: [],
			loading: false
		};
	}

	async componentDidMount() {
		const relationships = await API.get('pareto', '/relationship');
		const templates = await API.get('pareto', '/templates');
		this.setState({ relationships: relationships, templates: templates });
	}

	renderRelationships = (relationships) => {
		return relationships.map((relationship, i) => {
			return (
				<div className="block" key={i}>
					<div className="context-card">
						<div style={{ display: 'flex', justifyContent: 'space-between' }}>
							<div style={{ display: 'flex', flexDirection: 'column' }}>
								<h4>Mentee</h4>
								<p>
									{relationship.mentee.fName} {relationship.mentee.lName}
								</p>
								<h4>Mentor:</h4>
								<p>
									{relationship.mentor.fName} {relationship.mentor.lName}
								</p>
								<LoaderButton
									text="Delete Relationship"
									loadingText="Deleting"
									isLoading={this.state.loading}
									onClick={async () => {
										this.setState({ loading: true });
										let newRelArray = this.state.relationships.slice();
										newRelArray.splice(i, 1);
										try {
											await API.del('pareto', `/relationship/${relationship.id}`);
											this.setState({ loading: false, relationships: newRelArray });
										} catch (e) {
											errorToast(e, this.props.user);
											this.setState({ loading: false });
										}
									}}
								/>
							</div>
						</div>
					</div>
				</div>
			);
		});
	};

	renderTemplates = (templates) => {
		return templates.map((template, i) => {
			return (
				<div className="block" key={i}>
					<div className="context-card">
						<div style={{ display: 'flex', justifyContent: 'space-between' }}>
							<div style={{ display: 'flex', flexDirection: 'column' }}>
								<h4>Title</h4>
								<p>{template.title}</p>
								<h4>Author:</h4>
								<p>{template.author}</p>
								<LoaderButton
									text="Delete Templates"
									loadingText="Deleting"
									isLoading={this.state.loading}
									onClick={async () => {
										this.setState({ loading: true });
										let newRelArray = this.state.templates.slice();
										newRelArray.splice(i, 1);
										try {
											await API.del('pareto', `/templates/${template.id}`);
											this.setState({ loading: false, templates: newRelArray });
										} catch (e) {
											errorToast(e, this.props.user);
											this.setState({ loading: false });
										}
									}}
								/>
							</div>
						</div>
					</div>
				</div>
			);
		});
	};

	render() {
		return (
			<React.Fragment>
				<h1>Mentorship & Template List</h1>
				<div className="flex">
					<div style={{ width: '50%' }}>{this.renderRelationships(this.state.relationships)}</div>
					<div style={{ width: '50%' }}>{this.renderTemplates(this.state.templates)}</div>
				</div>
			</React.Fragment>
		);
	}
}
