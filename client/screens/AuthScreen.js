import React from 'react';
import { StatusBar} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Signin from '../auth/Signin';
import Signup from '../user/Signup';

const AuthScreen = ({ setLoggedIn }) => {
    const Tab = createMaterialTopTabNavigator();

    return (
        <>
        <StatusBar></StatusBar>
        <Tab.Navigator>
            <Tab.Screen 
                name='Sign In'
                children={ () => <Signin setLoggedIn={setLoggedIn} /> }
            />
            <Tab.Screen 
                name='Sign Up'
                children={ () => <Signup setLoggedIn={setLoggedIn} /> }
            />
        </Tab.Navigator>
        </>
    );
}

export default AuthScreen;
