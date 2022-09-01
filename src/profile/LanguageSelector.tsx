import { useState, useContext, FormEvent } from "react";
import {
	FormControl,
	FormLabel,
	RadioGroup,
	FormControlLabel,
	Radio,
	FormHelperText,
	Select,
} from "@mui/material";
// import FormGroup from "react-bootstrap/lib/FormGroup";
// import ControlLabel from "react-bootstrap/lib/ControlLabel";
// import FormControl from "react-bootstrap/lib/FormControl";
import { MdAutorenew } from "react-icons/md";
import LanguageContext, { Language } from "../state/LanguageContext";
import { availableLanguages, updateLanguage } from "../libs/languages";
import { User } from "../types/ProfileTypes";

const LanguageSelector = (props: { user: User }) => {
	const langContext = useContext(LanguageContext);
	const language = langContext.language as Language;
	const setLanguage = langContext.setLanguage;
	let [isLoading, setIsLoading] = useState(false);

	const handleSetIsLoading = (bool: boolean) => {
		setIsLoading(bool);
	};

	const handleSetLanguage = (language: Language) => {
		setLanguage(language);
	};

	const handleChange = (e: FormEvent<FormControl>) => {
		updateLanguage({
			language: availableLanguages.find(
				(x) => x.code === (e.target as HTMLSelectElement).value
			),
			id: props.user.id,
			setLanguage: handleSetLanguage,
			setIsLoading: handleSetIsLoading,
		});
	};
	return (
		<FormControl id="defaultLanguage" component="fieldset" variant="outlined">
			<FormLabel htmlFor="residence-type-radio">
				<h2>Default Language</h2>
			</FormLabel>
			<RadioGroup
				aria-label="residence"
				id="residence-type-radio"
				defaultValue="homeowner"
				name="radio-buttons-group"
				onChange={handleChange}
			>
				<FormControlLabel
					value="homeowner"
					control={<Select />}
					label="Homeowner"
				/>
				<FormControlLabel value="renter" control={<Radio />} label="Renter" />
				<FormControlLabel value="nomad" control={<Radio />} label="Nomad" />
			</RadioGroup>
			<FormHelperText>Disabled</FormHelperText>
		</FormControl>
		// <FormGroup controlId="defaultLanguage" bsSize="large">
		// 	{/* Here we are updating our default language */}
		// 	<ControlLabel>
		// 		<h2>Default Language</h2>
		// 	</ControlLabel>
		// 	<div className="flex">
		// 		{isLoading ? (
		// 			<>
		// 				<FormControl
		// 					name="newLanguage"
		// 					componentClass="select"
		// 					onChange={handleChange}
		// 				>
		// 					<option value="">
		// 						Please wait - saving language preferences.
		// 					</option>
		// 				</FormControl>
		// 				<MdAutorenew
		// 					style={{ margin: 8, height: "100%" }}
		// 					className="loading-icon spinning"
		// 				/>
		// 			</>
		// 		) : (
		// 			<FormControl
		// 				name="newLanguage"
		// 				componentClass="select"
		// 				onChange={handleChange}
		// 				defaultValue={language?.code || ""}
		// 				value={language.code || ""}
		// 			>
		// 				{availableLanguages.map(({ code, name }) =>
		// 					code === language.code ? (
		// 						<option key={code} value={code} selected>
		// 							{name}
		// 						</option>
		// 					) : (
		// 						<option key={code} value={code}>
		// 							{name}
		// 						</option>
		// 					)
		// 				)}
		// 			</FormControl>
		// 		)}
		// 	</div>
		// </FormGroup>
	);
};
export default LanguageSelector;
