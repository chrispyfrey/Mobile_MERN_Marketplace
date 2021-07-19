import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    StyleSheet,
    Text,
    Image,
    View,
    Button,
    ToastAndroid,
    Platform,
    AlertIOS
} from 'react-native';

const Product = ({ cart, setCart, selectedProduct, setSelectedProduct }) => {
    const [quantity, setQuantity] = useState(0);

    useEffect(() => {
        setQuantity(selectedProduct.quantity);
    }, []);

    function addProductToCart(selectedProduct) {
        let prodInCart = false;
    
        if (selectedProduct.quantity > 0) {
            for (let i = 0; i < cart.length; ++i) {
                if (cart[i]._id == selectedProduct._id) {
                    if (cart[i].cartNum) {
                        prodInCart = true;
                        ++cart[i].cartNum;
                        break;
                    }
                }
            }
            
            if (!prodInCart) {
                selectedProduct.cartNum = 1;
                cart.push(selectedProduct);
            }
        
            --selectedProduct.quantity;
            setQuantity(selectedProduct.quantity);
            setCart(cart);
    
            AsyncStorage.setItem('cart', JSON.stringify(cart)).then(() => {
                if (Platform.OS === 'android')
                    ToastAndroid.show(`${selectedProduct.name} added to cart.`, ToastAndroid.SHORT)
                else 
                    AlertIOS.alert(`${selectedProduct.name} added to cart.`);
            }).catch((err) => console.log(err));
        }
        else {
            if (Platform.OS === 'android')
                ToastAndroid.show(`${selectedProduct.name} is out of stock.`, ToastAndroid.SHORT)
            else 
                AlertIOS.alert(`${selectedProduct.name} is out of stock.`);
        }    
    }

    const GoBackButton = () => {
        return (
            <View style={{width: 100}}>
                <Button
                    title={'Go Back'}
                    onPress={ () => {
                        setSelectedProduct(null);
                    }}
                />
            </View>
        );
    }

    const AddToCardButton = () => {
        return (
            <View style={{width: 100}}>
                <Button
                    title={'Add Cart'}
                    onPress={ () => addProductToCart(selectedProduct)}
                />
            </View>
        );
    }

    return (
        <>
        <View style={{flex: 1}}>
            <View style={styles.productBigContainer} >
                <View style={{flex: 0.70, width: '100%', height: '50%'}} >
                    <Image
                        source={{uri: selectedProduct.imgUri }}
                        style={{flex: 1, resizeMode: 'contain', margin: 10}}
                    />
                </View>
                <View style={{flex: 0.30, justifyContent: 'space-evenly'}} >
                    <Text style={styles.productName}>{`${selectedProduct.name}`}</Text>
                    <Text style={styles.productDesc}>{`${selectedProduct.description}`}</Text>
                    <Text style={styles.productPrice}>{`Price: $${selectedProduct.price}`}</Text>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Text style={styles.productQuan}>{`Quantity: ${quantity}`}</Text>
                        { selectedProduct.quantity > 0 
                        ? 
                        <Text style={{color: 'green', marginEnd: 10}}>In stock</Text>
                        : 
                        <Text style={{color: 'red', marginEnd: 10}}>Out of stock</Text> }
                    </View>
                </View>
            </View>
            <View style={{flex: 0.25, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}} >
                { selectedProduct.quantity > 0 
                    ? 
                    <> 
                    <GoBackButton /> 
                    <AddToCardButton /> 
                    </> 
                    : 
                    <GoBackButton /> }
            </View>
        </View>
        </>
    );
}

const styles = StyleSheet.create({
    productBigContainer: {
        flex: 0.75,
        justifyContent: 'flex-start',
        backgroundColor: '#d4d4d4',
        margin: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    productName: {
        fontSize: 30,
        marginBottom: 10,
        marginStart: 10,
        marginEnd: 10
    },
    productDesc: {
        fontSize: 18,
        marginBottom: 10,
        marginStart: 10,
        marginEnd: 10
    },
    productPrice: {
        fontSize: 16,
        marginBottom: 10,
        marginStart: 10,
        marginEnd: 10
    },
    productQuan: {
        fontSize: 16,
        marginStart: 10,
        marginEnd: 10,
        marginBottom: 10
    }
});

export default Product;
