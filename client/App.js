import AuthScreen from './screens/AuthScreen';
import MainScreen from './screens/MainScreen';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
	const [loggedIn, setLoggedIn] = useState(false);

	useEffect(() => {
		AsyncStorage.getItem('loggedIn').then((loggedIn) => {
			setLoggedIn(JSON.parse(loggedIn))
		}).catch((err) => console.log(err));
	}, []);

	if (!loggedIn) {
		return (
			<NavigationContainer>
				<AuthScreen setLoggedIn={setLoggedIn} />
			</NavigationContainer>
		);
	}

	return (
		<NavigationContainer>
			<MainScreen setLoggedIn={setLoggedIn} />
		</NavigationContainer>
	);
}
