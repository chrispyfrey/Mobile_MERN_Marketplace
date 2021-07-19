import React, { useEffect, useState } from 'react';
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons'; 
import { FlatList } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import DeleteUserButton from './DeleteUserButton';
import LogoutButton from './LogoutButton';
import { listByUser } from '../order/api-order';
import userActions from './api-user';
import { 
    StyleSheet, 
    Text, 
    View,
    Pressable,
    TextInput,
    Button
} from 'react-native';

const Profile = ({ setLoggedIn }) => {
    const [user, setUser] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [authToken, setAuthToken] = useState(null);
    const [orders, setOrders] = useState(null);
    const [totalEFF, setTotalEEF] = useState(0);
    const [totalMHUWI, setTotalMHUWI] = useState(0);
    const [totalDonations, setTotalDonations] = useState(0);

    useEffect(() => {
        SecureStore.getItemAsync('token').then((token) => {
            setAuthToken(token);

            AsyncStorage.getItem('user').then((resUser) => {
                setUser(JSON.parse(resUser));
                
                userActions.donations({userId: JSON.parse(resUser)._id}, token).then((dntns) => {
                    let tot = 0;
                    if (dntns.donations.length > 0) {
                        dntns.donations.forEach((don) => {
                            if (don.charity == 'Electronic Frontier Foundation') {
                                tot += don.total_to_date_cents / 100.00;
                                setTotalEEF(don.total_to_date_cents / 100.00);
                            }
                            else if (don.charity == 'Mile High United Way Inc') {
                                tot += don.total_to_date_cents / 100.00;
                                setTotalMHUWI(don.total_to_date_cents / 100.00);
                            }
                        });
                    }
                    setTotalDonations(tot);

                    listByUser({ userId: JSON.parse(resUser)._id}, token).then((ords) => {
                        setOrders(ords);
                    }).catch((err) => console.log(err));
                }).catch(err => console.log(err));
            }).catch((err) => console.log(err));
        }).catch((err) => console.log(err));
	}, []);

    function getOrders() {
        if (user) {
            setOrders(null);
            listByUser({ userId: user._id}, authToken).then((ords) => {
                setOrders(ords);

                userActions.donations({userId: user._id}, authToken).then((dntns) => {
                    let tot = 0;
                    if (dntns.donations.length > 0) {
                        dntns.donations.forEach((don) => {
                            if (don.charity == 'Electronic Frontier Foundation') {
                                tot += don.total_to_date_cents / 100.00;
                                setTotalEEF(don.total_to_date_cents / 100.00);
                            }
                            else if (don.charity == 'Mile High United Way Inc') {
                                tot += don.total_to_date_cents / 100.00;
                                setTotalMHUWI(don.total_to_date_cents / 100.00);
                            }
                        });
                    }
                    setTotalDonations(tot);
                }).catch(err => console.log(err));
            }).catch((err) => console.log(err));
        }
    }

    const EditProfile = ({ token }) => {
        const [name, setName] = useState('');
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');

        function updateUser(id, tok, name, email, password) {
            let req = {};
        
            if (name) {
                req.name = name;
                user.name = name;
            }
            if (email) {
                req.email = email;
                user.email = email;
            }
            if (password) {
                req.password = password;
            }
        
            if (req.name || req.email || req.password) {
                userActions.update({ userId: id }, { t: tok }, req).then((resUser) => {
                    AsyncStorage.setItem('user', JSON.stringify(resUser)).then(() => setUser(user))
                        .catch((err) => console.log(err));
                }).catch((err) => console.log(err));
            }
        }
    
        if (!user) {
            return (
                <>
                <View style={styles.container}>
                    <Text>Loading...</Text>
                </View>
                </>
            );
        }
    
        return (
            <>
            <View style={styles.largeContainer}>
                <Text style={styles.titleText}>Edit Profile</Text>
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
            
            <View style={styles.buttonContainer}>
                <View style={styles.buttonView}>
                    <Button 
                        title={'Cancel'}
                        onPress={ () => {
                            setIsEdit(false);
                        }}
                    />
                </View>
    
                <View style={styles.buttonView}>
                    <Button 
                        title={'Submit'}
                        onPress={ () => {
                            updateUser(user._id, token, name, email, password);
                            setIsEdit(false);
                        }}
                    />
                </View>
            </View>
    
            <View style={styles.container}>
    
            </View>
            </>
        );
    }

    const OrderList = () => {
        if (!orders) {
            return (
                <>
                <View style={styles.container}>
                    <Text>Loading...</Text>
                </View>
                </>
            );
        }

        if (orders.length == 0) {
            return (
                <>
                <View style={styles.container}>
                    <Text>No orders</Text>
                </View>
                </>
            );
        }

        return (
            <FlatList
                data={orders}
                keyExtractor={ ord => ord._id }
                renderItem={({ item }) => <OrderCard order={item} /> }
            />
        );
    }
    
    const OrderCard = ({ order }) => {
        let itemNum = 0;
        order.products.forEach(prod => itemNum += prod.quantity);
        return (
            <>
            <View style={styles.listOrder}>
                <View style={styles.listTextContainer}>
                    <View style={styles.smallTextContainer}>
                        <View>
                            <Text style={{fontSize: 20, marginStart: 10}}>Order:</Text>
                            <Text style={styles.listText}>{`Date: ${order.created.slice(0, 10)}`}</Text>
                            <Text style={styles.listText}>{`Time: ${order.created.slice(11, 16)}${order.created.slice(-1)}`}</Text>
                            <Text style={styles.listText}>{`Items: ${itemNum}`}</Text>
                            <Text style={styles.listText}>{`Total: ${order.total.toFixed(2)}`}</Text>
                            <Text style={styles.listText}>{order.donation ? `Donation: ${(1 - (order.total % 1)).toFixed(2)}` : `Donation: 0.00`}</Text>
                        </View>
                        <View>
                            <Text style={{fontSize: 20, marginStart: 10}}>Shipping:</Text>
                            <Text style={styles.listText}>{`Name: ${order.customer_name}`}</Text>
                            <Text style={styles.listText}>{`Street: ${order.delivery_address.street}`}</Text>
                            <Text style={styles.listText}>{`City: ${order.delivery_address.city}`}</Text>
                            <Text style={styles.listText}>{`State: ${order.delivery_address.state}`}</Text>
                            <Text style={styles.listText}>{`Zip: ${order.delivery_address.zipcode}`}</Text>
                        </View>
                    </View>
                </View>
            </View>
            </>
        );
    }

    if (!user || !authToken || !orders) {
        return (
            <>
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
            </>
        );
    }

    return (
        <>
        { isEdit ? <EditProfile token={authToken}/> :
            <>
            <View style = {styles.lineStyle}/>
            <View style={styles.userContainer}>
                <View style={styles.nameContainer}>
                    <Text>{user.name}</Text>
                    <Text>{user.email}</Text>
                    <Text>{`Joined: ${user.created.slice(0, 10)}`}</Text>
                    <Text>{`Mile High United Way Inc: ${totalMHUWI.toFixed(2)}`}</Text>
                    <Text>{`Electronic Frontier Foundation: ${totalEFF.toFixed(2)}`}</Text>
                    <Text>{`Total donations: ${totalDonations.toFixed(2)}`}</Text>
                </View>

                <View style={styles.iconContainer}>
                    <LogoutButton setLoggedIn={setLoggedIn} />
                    <Pressable
                        style={styles.iconContainer}
                        underlayColor={'#d4d4d4'}
                        onPress={ () => setIsEdit(true)}
                    >
                        <AntDesign 
                            name='edit'
                            size={40} 
                            color='black'
                        />
                    </Pressable>
                    <DeleteUserButton setLoggedIn={setLoggedIn}/>
                </View>
            </View>
            <View style={styles.lineStyle}/>
            <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
                <Text style={styles.regularText}>Your Orders:</Text>
                <Pressable onPress={ () => {getOrders()}}>
                    <Feather 
                        name='refresh-ccw' 
                        size={30} 
                        color='black'
                        style={{marginEnd: 20}}
                    />
                </Pressable>
            </View>
            <OrderList />
            </>
        }
        </>
    );
}

const styles = StyleSheet.create({
    largeContainer: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    userContainer: {
        height: 100,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    nameContainer: {
        marginStart: 10,
        justifyContent: 'space-evenly'
    },
    picContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    iconContainer: {
        margin: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 10
    },
    listItem: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#d4d4d4',
        height: 80,
        marginBottom: 5,
        marginStart: 10,
        marginEnd: 10
    },
    lineStyle:{
        borderBottomWidth: 1.5,
        borderColor: 'black',
        margin: 10
    },
    titleText: {
        fontSize: 40
    },
    regularText: {
        flex: 1,
        fontSize: 20,
        margin: 10
    },
    buttonView: {
        width: 150,
        marginEnd: 10
    },
    inputView: {
        flex: 1
    },
    textInput: {
        height: 40,
        marginStart: 30,
        marginEnd: 30,
        borderWidth: 1,
        paddingStart: 5
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    listTextContainer: {
        flex: 1,
        flexShrink: 1,
        marginTop: 10,
        marginBottom: 10,
        justifyContent: 'space-evenly'
    },
    listOrder: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        backgroundColor: '#d4d4d4',
        marginBottom: 10,
        marginStart: 10,
        marginEnd: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    listTitleText: {
        fontSize: 18
    },
    listText: {
        fontSize: 14,
        marginStart: 10,
        marginEnd: 10
    },
    smallTextContainer: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row'
    }
});

export default Profile;