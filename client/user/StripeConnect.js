import React, { Component } from 'react';
import { 
    StyleSheet, 
    Text, 
    View, 
    TextInput, 
    Button } 
from 'react-native';

export default class StripeConnect extends Component {
    state = {
        apiKey: '',
    };

    textChange = key => text => {
        this.setState({ [key]: text });
    }

    render = () => {
        return (
            <>
            <View style={styles.container}>
                <Text style={styles.titleText}>Connect Stripe</Text>
            </View>

            <View style={styles.inputView}>
                <TextInput 
                    style={styles.textInput}
                    onChangeText={this.textChange('apiKey')}
                    value={this.state.apiKey}
                    placeholder={'API Key???'}
                />
            </View>

            <View style={styles.buttonContainer}>
                <View style={styles.buttonView}>
                    <Button 
                        title={'Cancel'}
                        onPress={ () => {
                            this.props.navigation.navigate('MainScreen');
                        }}
                    />
                </View>

                <View style={styles.buttonView}>
                    <Button 
                        title={'Connect'}
                        onPress={ () => {
                            // Needs linked to Stripe auth
                            this.props.navigation.navigate('MainScreen');
                        }}
                    />
                </View>
            </View>
            </>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly'
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
      borderWidth: 1
    },
    buttonView: {
      width: 100
    }
});
