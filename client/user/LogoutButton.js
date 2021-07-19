import React from 'react';
import { AntDesign } from '@expo/vector-icons';
import { TouchableHighlight, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authActions from '../auth/api-auth';

function logout(setLoggedIn) {
    AsyncStorage.setItem('loggedIn', JSON.stringify(false)).then(() => {
        authActions.signout().then( () => {
            setLoggedIn(false);
        }).catch((err) => console.log(err));
        
    }).catch(err => console.log(err))
}

const LogoutButton = ({ setLoggedIn }) => {
    return (
        <>
        <TouchableHighlight 
            underlayColor={'#d4d4d4'}
            onPress={ () => Alert.alert(
                "Logout",
                "Confirm to logout.",
                [{
                    text: "Cancel"
                },
                { 
                    text: "Confirm", 
                    onPress: () => {
                        logout(setLoggedIn);
                    }
                }]
            )}
        >
            <AntDesign 
                name='logout' 
                size={40} 
                color='black' 
            />
        </TouchableHighlight>
        </>
    );
}

export default LogoutButton;
