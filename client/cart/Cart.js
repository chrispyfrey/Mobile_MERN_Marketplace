import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native-gesture-handler';
import NOT_ENV from '../notEnv';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign } from '@expo/vector-icons';
import Checkout from './Checkout';
import {
    StyleSheet,
    Button,
    Text,
    View,
    Image,
    Pressable,
    ToastAndroid,
    Platform,
    AlertIOS
} from 'react-native';

const Cart = ({ cart, setCart, setSelectedProduct }) => {
    const [total, setTotal] = useState(0);
    const [checkingOut, setCheckingOut] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => calculateTotals());
        return unsubscribe;
	}, [navigation]);

    function calculateTotals() {
        let rmv_arr = [];
        let tot_sum = 0;
        cart.forEach((prod, ndx) => {
            tot_sum += prod.price * prod.cartNum;
            if (prod.quantity < 0) {
                rmv_arr.push(ndx);
            }
        }); 
        rmv_arr.forEach(ndx => cart.splice(ndx, 1));
        setCart(cart);
        setTotal(tot_sum);
    }

    function removeProductFromCart(selectedProduct) {
        let ndx = -1;

        cart.forEach((prod, i) => {
            if (prod._id == selectedProduct._id) {
                if (prod.cartNum == 1) {
                    ndx = i;
                }
                --prod.cartNum;
                ++prod.quantity;
            }
        });
    
        if (ndx > -1) {
            cart.splice(ndx, 1)
        }
    
        setCart(cart);
        calculateTotals();
    
        AsyncStorage.setItem('cart', JSON.stringify(cart)).then(() => {
            if (Platform.OS === 'android')
                ToastAndroid.show(`${selectedProduct.name} removed from cart.`, ToastAndroid.SHORT)
            else 
                AlertIOS.alert(`${selectedProduct.name} removed from cart.`);
        }).catch((err) => console.log(err));
    }

    const ProductsList = () => {
        return (
            <FlatList
                data={cart}
                keyExtractor={ product => product._id }
                renderItem={ ({ item }) => <ProductCard product={item} /> }
            />
        );
    }
    
    const ProductCard = ({ product }) => {
        const imgUri = `${NOT_ENV.API_DOMAIN}/api/product/image/${product._id}?${new Date().getTime()}`;
    
        return (
            <>
            <Pressable
                underlayColor={'#d4d4d4'}
                onPress={ () => {
                    setSelectedProduct(product);
                    navigation.navigate('Products');
                }}
            >
                <View style={styles.listProduct}>
                    <Image
                        source={{ uri: `${imgUri}`}}
                        style={styles.tinyLogo}
                    />
                    <View style={styles.listTextContainer}>
                        <Text style={styles.listTitleText}>{product.name}</Text>
                        <View style={styles.smallTextContainer}>
                            <View style={styles.listTextContainer}>
                                <Text style={styles.listText}>{`Price: $${product.price.toFixed(2)}`}</Text>
                                <Text style={styles.listText}>{`Quantity: ${product.cartNum}`}</Text>
                                <Text style={styles.listText}>{`Category: ${product.category}`}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{justifyContent: 'flex-end', alignItems: 'flex-end'}}>
                        <Pressable onPress={() => {
                            removeProductFromCart(product);
                        }}>
                            <AntDesign 
                                style={{margin: 10}}
                                name='delete' 
                                size={40} 
                                color='black' 
                            />
                        </Pressable>
                    </View>
                </View>
            </Pressable>
            </>
        );
    }

    if (cart.length == 0) {
        return (
            <>
            <View style={styles.container}>
                <Text>No Items</Text>
            </View>
            </>
        );
    }

    if (checkingOut) {
        return (
            <Checkout
                setCheckingOut={setCheckingOut}
                cart={cart}
                setCart={setCart}
                total={total}
            />
        );
    }

    return (
        <View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <View>
                    <Text style={{marginStart: 10, marginTop: 5, marginBottom: 10}}>{`Total: $${total.toFixed(2)}`}</Text>
                </View>
                <View style={{width: 100, margin: 10}}>
                    <Button
                        title={'Checkout'}
                        onPress={ () => setCheckingOut(true)}
                    />
                </View>
            </View>
            <ProductsList />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    listTextContainer: {
        flex: 1,
        flexShrink: 1,
        marginTop: 10,
        marginBottom: 10,
        justifyContent: 'space-evenly'
    },
    listProduct: {
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
        fontSize: 14
    },
    tinyLogo: {
        width: 100,
        height: 100,
        margin: 10
    },
    smallTextContainer: {
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    outOfStockText: {
        color: 'red'
    }
});

export default Cart;
