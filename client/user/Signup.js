import React from 'react';
import * as SecureStore from 'expo-secure-store';
import userActions from './api-user';
import authActions from '../auth/api-auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { 
    StyleSheet, 
    Text, 
    View, 
    TextInput, 
    Button } 
from 'react-native';

const Signup = ({ setLoggedIn }) => {
    const [name, setName] = React.useState();
    const [email, setEmail] = React.useState();
    const [password, setPassword] = React.useState();

    return (
        <>
        <View style={styles.container}>
            <Text style={styles.titleText}>Sign Up</Text>
        </View>

        <View style={styles.inputView}>
            <TextInput 
                style={styles.textInput}
                onChangeText={setName}
                value={name}
                placeholder={'Name'}
            />
        </View>

        <View style={styles.inputView}>
            <TextInput 
                style={styles.textInput}
                onChangeText={setEmail}
                value={email}
                placeholder={'E-mail'}
            />
        </View>

        <View style={styles.inputView}>
            <TextInput 
                style={styles.textInput}
                onChangeText={setPassword}
                value={password}
                secureTextEntry={true}
                placeholder={'Password'}
            />
        </View>

        <View style={styles.container}>
            <View style={styles.buttonView}>
            <Button 
                title={'Sign Up'}
                onPress={ () => {
                    let user = {
                        name: name,
                        email: email,
                        password: password
                    }

                    userActions.create(user)
                        .then((response) => {
                            if (!response.error) {
                                authActions.signin({ email: user.email, password: user.password })
                                    .then((res) => {
                                        SecureStore.setItemAsync('token', res.token).catch((err) => console.log(err));
                                        AsyncStorage.setItem('user', JSON.stringify(res.user)).catch((err) => console.log(err));
                                        AsyncStorage.setItem('loggedIn', JSON.stringify(true)).catch((err) => console.log(err));
                                        setName('');
                                        setEmail('');
                                        setPassword('');
                                        setLoggedIn(true);
                                    }).catch((err) => console.log(err));
                            }
                            else {
                                alert(response.error);
                            }

                        }).catch((err) => console.log(err));

                }}
            />
            </View>
        </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 3,
      justifyContent: 'center',
      alignItems: 'center'
    },
    titleText: {
      fontSize: 40
    },
    inputView: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center'
    },
    textInput: {
      flex: 3,
      height: 40,
      margin: 20,
      borderWidth: 1,
      padding: 5
    },
    buttonView: {
      width: 100
    }
});

export default Signup;
