import React, { useState, useEffect } from 'react';
import { StatusBar, View, Text, StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { list } from '../product/api-product';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Profile from '../user/Profile';
import Products from '../product/Products';
import Cart from '../cart/Cart';

const MainScreen = ({ setLoggedIn }) => {
	const Tab = createMaterialTopTabNavigator();
	const [cart, setCart] = useState(null);
	const [products, setProducts] = useState(null);
	const [selectedProduct, setSelectedProduct] = useState(null);

	useEffect(() => {
		let newCart = [];
		AsyncStorage.getItem('cart').then((storedCart) => {
			let pCart = JSON.parse(storedCart);
			if (!pCart) pCart = [];

			list().then((res) => {
				for (let i = 0; i < pCart.length; ++i) {
					for (let j = 0; j < res.length; ++j) {
						if (res[j]._id == pCart[i]._id) {
							res[j].quantity -= pCart[i].cartNum;
							res[j].cartNum = pCart[i].cartNum;
							newCart.push(res[j]);
							break;
						}
					}
				}
				setCart(newCart);
				setProducts(res);
			}).catch((err) => console.log(err));;
		}).catch((err) => console.log(err));
	}, []);

	return (
		<>
		<StatusBar></StatusBar>
		{ (cart == null || products == null) ? 
			<View style={styles.container}>
				<Text>Loading products...</Text>
			</View>
		:
		 	<Tab.Navigator>
				<Tab.Screen 
					name='Products' 
					children={ () => 
						<Products 
							cart={cart} 
							setCart={setCart}
							products={products}
							setProducts={setProducts}
							selectedProduct={selectedProduct}
							setSelectedProduct={setSelectedProduct}
						/> 
					} 
				/>
				<Tab.Screen 
					name='Cart' 
					children={ () => 
						<Cart 
							cart={cart} 
							setCart={setCart}
							setSelectedProduct={setSelectedProduct}
						/> 
					} 
				/>
				<Tab.Screen 
					name='Profile' 
					children={ () => 
						<Profile 
							setLoggedIn={setLoggedIn} 
						/> 
					} 
				/>
			</Tab.Navigator>
		}
		</>
	);
}

export default MainScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
