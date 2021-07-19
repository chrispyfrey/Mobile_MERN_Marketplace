import React from 'react';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authActions from './api-auth'
import { 
    StyleSheet, 
    Text, 
    View, 
    TextInput, 
    Button } 
from 'react-native';

const Signin = ({ setLoggedIn }) => {
    const [email, setEmail] = React.useState();
    const [password, setPassword] = React.useState();

    return (
        <>
        <View style={styles.container}>
            <Text style={styles.titleText}>Sign In</Text>
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
                title={'Sign In'}
                onPress={ () => { 
                    authActions.signin({ email: email, password: password })
                        .then((result) => {
                            if (result.token && result.user) {
                                SecureStore.setItemAsync('token', result.token).catch((err) => console.log(err));
                                AsyncStorage.setItem('user', JSON.stringify(result.user)).catch((err) => console.log(err));
                                AsyncStorage.setItem('loggedIn', JSON.stringify(true)).catch((err) => console.log(err));
                                setEmail('');
                                setPassword('');
                                setLoggedIn(true);
                            }
                            else if (result.error) {
                                alert(result.error);
                            }
                        }).catch(err => console.log(err));
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
      paddingStart: 5
    },
    buttonView: {
      width: 100
    }
});

export default Signin;
