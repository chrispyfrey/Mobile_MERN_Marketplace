import React, { useState, useEffect } from 'react';
import NOT_ENV from '../notEnv';
import { ScrollView } from 'react-native-gesture-handler';
import { PaymentsStripe as Stripe } from "expo-payments-stripe";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create, processCharge } from '../order/api-order';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Button,
    Picker, 
    Switch
} from 'react-native';

const charities = ['Select a charity', 'Mile High United Way Inc', 'Electronic Frontier Foundation']
const states = ['State', 'AK', 'AL', 'AR', 'AS', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 
                'FL', 'GA', 'GU', 'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 
                'LA', 'MA', 'MD', 'ME', 'MI', 'MN', 'MO', 'MP', 'MS', 'MT', 
                'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 
                'OR', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UM', 'UT',
                'VA', 'VI', 'VT', 'WA', 'WI', 'WV', 'WY'];

const ShippingInput = ({ label, val, setVal, type, maxLength }) => {
    return (
        <View style={styles.inputView}>
            <TextInput
                style={styles.textInput}
                onChangeText={setVal}
                value={val}
                placeholder={label}
                keyboardType={type}
                maxLength={maxLength}
            />
        </View>
    );
}

const Checkout = ({ setCheckingOut, cart, setCart, total }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [line1, setLine1] = useState('');
    const [line2, setLine2] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zip, setZip] = useState('');
    const [donate, setDonate] = useState(false);
    const [charity, setCharity] = useState('');
    const [paying, setPaying] = useState(false);
    const [token, setToken] = useState('');
    const [user, setUser] = useState(null);
    const charitySwitch = () => setDonate(lastState => !lastState);

    const payOptions = {
        requiredBillingAddressFields: 'full',
        prefilledInformation: {
            billingAddress: {
                name: 'Gunilla Haugeh',
                line1: 'Canary Place',
                line2: '3',
                city: 'Macon',
                state: 'Georgia',
                country: 'US',
                postalCode: '31217',
            }
        }
    };

    useEffect(() => {
        SecureStore.getItemAsync('token').then((authToken) => {
            setToken(authToken);

            AsyncStorage.getItem('user').then((user) => {
                setUser(JSON.parse(user));
            }).then(() => {
                Stripe.setOptionsAsync({
                    publishableKey: NOT_ENV.STRIPE_PUBLISHABLE_KEY
                });
            }).catch((err) => console.log(err));
        }).catch((err) => console.log(err));;
	}, []);

    let charityList = charities.map((charity, i) => {
        return <Picker.Item key={i} value={charity} label={charity} />
    });

    let stateList = states.map((state, i) => {
        return <Picker.Item key={i} value={state} label={state} />
    });

    if (!user) {
        return (
            <>
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
            </>
        );
    }

    if (paying) {
        Stripe.paymentRequestWithCardFormAsync(payOptions).then((stripeToken) => {
            let params = { userId: user._id };
            let order = {
                products: cart,
                customer_name: user.name,
                customer_email: user.email,
                donation: donate ? charity : null,
                delivery_address: {
                    street: line1 + ' ' + line2,
                    city: city,
                    state: state,
                    zipcode: zip,
                    country: 'USA'
                }
            };

            create(params, token, order, stripeToken.tokenId).then((createRes) => {
                let chargeParams = {
                    orderId: createRes._id,
                    userId: createRes.user._id,
                    shopId: createRes.products[0].shop
                };

                processCharge(chargeParams, token).then((chargeRes) => {
                    console.log('Charge processed.');
                }).catch((err) => console.log(err.message));
            }).catch((err) => console.log(err.message));
        }).catch((err) => console.log(err.message))
        .finally(() => {
            while(cart.length) cart.pop();
            setCart(cart);
            AsyncStorage.setItem('cart', JSON.stringify([])).catch((err) => console.log(err));
            setCheckingOut(false);
        });
    }

    return (
        <>
        <View style={styles.container}>
            <Text style={styles.titleText}>Shipping Details</Text>
        </View>

        <ScrollView style={{height: '50%'}}> 
        <ShippingInput label='First name' val={firstName} setVal={setFirstName} type='default' maxLength={25} />
        <ShippingInput label='Last name' val={lastName} setVal={setLastName} type='default' maxLength={25} />
        <ShippingInput label='Phone number' val={phone} setVal={setPhone} type='phone-pad' maxLength={15} />
        <ShippingInput label='Address line 1' val={line1} setVal={setLine1} type='default' maxLength={50} />
        <ShippingInput label='Address line 2' val={line2} setVal={setLine2} type='default' maxLength={50} />
        <ShippingInput label='City' val={city} setVal={setCity} type='default' maxLength={50} />
        <Picker
            selectedValue={state}
            style={{ margin: 20, height: 40, width: 150 }}
            onValueChange={(selState) => setState(selState)}
        >
            {stateList}
        </Picker>
        <ShippingInput label='Zip code' val={zip} setVal={setZip} type='numeric' maxLength={5} />
        </ScrollView>
        <View style={styles.charityContainer}>
            <Text>Round up to the next dollar for charity?</Text>
            <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={donate ? "#2180de" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={charitySwitch}
                value={donate}
            />
        <Text>{`$${(1 - (total % 1)).toFixed(2)}`}</Text>
        </View>
        { donate ?
            <View style={{flex: 2, justifyContent: 'center', alignItems: 'center'}}>
                <Picker
                    selectedValue={charity}
                    style={{marginStart: 20, height: 40, width: 300 }}
                    onValueChange={(selCharity) => setCharity(selCharity)}
                >
                    {charityList}
                </Picker>
            </View>
            :
            <>
            </>
        }
        <View style={styles.buttonContainer}>
            <View style={styles.buttonView}>
            <Button
                title={'Cancel'}
                onPress={ () => setCheckingOut(false)}
            />
            </View>
            <View style={styles.buttonView}>
            <Button
                title={'Payment'}
                onPress={ () => {
                    setPaying(true);
                }}
            />
            </View>
        </View>

        </>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 2,
      justifyContent: 'center',
      alignItems: 'center'
    },
    titleText: {
      fontSize: 30
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
    },
    buttonContainer: {
        flex: 3,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    charityContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginStart: 20,
        marginEnd: 20,
        marginTop: 20
    }
});

export default Checkout;
