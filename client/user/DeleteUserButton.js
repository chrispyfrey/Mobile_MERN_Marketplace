import React from 'react';
import { AntDesign } from '@expo/vector-icons';
import { Alert, Pressable } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import userActions from './api-user';

function deleteAccount(setLoggedIn) {
    SecureStore.getItemAsync('token').then((token) => {
        AsyncStorage.getItem('user').then((user) => {
            userActions.remove({ userId: JSON.parse(user)._id }, { t: token }).then( () => {
                SecureStore.deleteItemAsync('token').catch((err) => console.log(err));
                AsyncStorage.removeItem('user').catch((err) => console.log(err));
                AsyncStorage.removeItem('cart').catch((err) => console.log(err));
                AsyncStorage.removeItem('orders').catch((err) => console.log(err));
                AsyncStorage.removeItem('loggedIn').catch((err) => console.log(err));
                setLoggedIn(false);
            }).catch((err) => console.log(err));
        }).catch((err) => console.log(err));
    }).catch((err) => console.log(err));
}

const DeleteUserButton = ({ setLoggedIn }) => {
    return (
        <>
        <Pressable 
            underlayColor={'#d4d4d4'}
            onPress={ () => { Alert.alert(
                    "Delete Account",
                    "Confirm to delete your account.",
                    [{
                        text: "Cancel"
                    },
                    { 
                        text: "Confirm", 
                        onPress: () => {
                            deleteAccount(setLoggedIn);
                        }
                    }]
                );
            }}
        >
            <AntDesign 
                name='delete' 
                size={40} 
                color='black' 
            />
        </Pressable>
        </>
    );
}

export default DeleteUserButton;