import Product from './Product';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList } from 'react-native-gesture-handler';
import { listCategories } from './api-product';
import { AntDesign, Feather } from '@expo/vector-icons';
import NOT_ENV from '../notEnv';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    Pressable,
    ToastAndroid,
    Platform,
    AlertIOS,
    Picker
} from 'react-native';

function searchLocal(query, products) {
    let sanQuery = query.replace(/[^a-zA-Z0-9:-\s]/g, '');
    let re = RegExp(`(?:${sanQuery})`, 'i');
    let results = [];
    
    products['All'].forEach(product => {
        if (product.name.search(re) > -1 || product.description.search(re) > -1) {
            results.push(product);
        }
    });

    products['Search'] = results;
    return products;
}

const Products = ({ cart, setCart, products, setProducts, selectedProduct, setSelectedProduct }) => {
    const [query, setQuery] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');

    useEffect(() => {
        let categoryProducts = {};

        listCategories().then((res) => {
            res.unshift('All');
            setCategories(res);
            res.forEach(category => categoryProducts[category] = []);
            products.forEach(product => categoryProducts[product.category].push(product));
            categoryProducts['All'] = products;
            setProducts(categoryProducts);
        }).catch((err) => console.log(err));
	}, []);

    function addProductToCart(prod, setQuan) {
        let prodInCart = false;
    
        if (prod.quantity > 0) {
            for (let i = 0; i < cart.length; ++i) {
                if (cart[i]._id == prod._id) {
                    if (cart[i].cartNum) {
                        prodInCart = true;
                        ++cart[i].cartNum;
                        break;
                    }
                }
            }
            
            if (!prodInCart) {
                prod.cartNum = 1;
                cart.push(prod);
            }
            
            --prod.quantity;
            setCart(cart);
            setQuan(prod.quantity);
            setProducts(products);
    
            AsyncStorage.setItem('cart', JSON.stringify(cart)).then(() => {
                if (Platform.OS === 'android')
                    ToastAndroid.show(`${prod.name} added to cart.`, ToastAndroid.SHORT)
                else 
                    AlertIOS.alert(`${prod.name} added to cart.`);
            }).catch((err) => console.log(err));
        }
        else {
            if (Platform.OS === 'android')
                ToastAndroid.show(`${prod.name} is out of stock.`, ToastAndroid.SHORT)
            else 
                AlertIOS.alert(`${prod.name} is out of stock.`);
        }    
    }

    const CategoriesPicker = () => {
        let pickerCategoryList = categories.map((cat, i) => {
            return <Picker.Item key={i} value={cat} label={cat} />
        });

        return (
            <Picker
                selectedValue={selectedCategory}
                style={{ height: 35, width: 120 }}
                onValueChange={(selCat) => setSelectedCategory(selCat)}
            >
                {pickerCategoryList}
            </Picker>
        );
    }

    const ClearSearchButton = () => {
        return (
            <Pressable 
                onPress={ () => {
                    setSelectedCategory('All');
                }}
            >   
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Feather 
                    name='x'
                    size={25} 
                    color='red'
                />
                <Text style={{fontSize: 16, color: 'red', marginEnd: 10}}>Clear Search</Text>
                </View>
            </Pressable>
        );
    }
    
    const SearchButton = () => {
        return (
            <Pressable 
                onPress={ () => {
                    if (query) {
                        setQuery('');
                        setProducts(searchLocal(query, products));
                        setSelectedCategory('Search');
                    }
                }}
            >
                <AntDesign 
                    name='search1'
                    size={30} 
                    color='black'
                />
            </Pressable>
        );
    }
    
    const SelectedCategory = () => {
        return (
            <Text style={{
                fontSize: 18, 
                marginBottom: 10, 
                marginStart: 10}}
            >
                {`${selectedCategory}:`}
            </Text>
        );
    }
    
    const ProductsList = () => {
        return (
            <FlatList
                data={products[selectedCategory]}
                keyExtractor={ product => product._id }
                renderItem={({ item }) => <ProductCard product={item} /> }
            />
        );
    }
    
    const ProductCard = ({ product }) => {
        const [quan, setQuan] = useState(0);
        product.imgUri = `${NOT_ENV.API_DOMAIN}/api/product/image/${product._id}?${new Date().getTime()}`;

        useEffect(() => {
            setQuan(product.quantity);
        }, []);

        if (!product) {
            return (
                <>
                </>
            );
        }
        
        return (
            <>
            <Pressable
                underlayColor={'#d4d4d4'}
                onPress={ () => setSelectedProduct(product)}
            >
                <View style={styles.listProduct}>
                    <Image
                        source={{ uri: `${product.imgUri}`}}
                        style={styles.tinyLogo}
                    />
                    <View style={styles.listTextContainer}>
                        <Text style={styles.listTitleText}>{product.name}</Text>
                        <View style={styles.smallTextContainer}>
                            <View style={styles.listTextContainer}>
                                <Text style={styles.listText}>{`Price: $${product.price.toFixed(2)}`}</Text>
                                <Text style={styles.listText}>{`Quantity: ${quan}`}</Text>
                                <Text style={styles.listText}>{`Category: ${product.category}`}</Text>
                            </View>
                            
                            <View style={styles.stockContainer}>
                                { product.quantity > 0 ? <InStockView prod={product} setQuan={setQuan} /> : <OutStockView /> }
                            </View>
                        </View>
                    </View>
                </View>
            </Pressable>
            </>
        );
    }
    
    const InStockView = ({ prod, setQuan }) => {
        return (
            <View style={{alignItems:'center'}}>
                <CartIconButton 
                    prod={prod}
                    setQuan={setQuan}
                />
                <Text style={styles.inStockText} >In stock</Text>
            </View>
        );
    }

    const CartIconButton = ({ prod, setQuan }) => {
        return (
            <Pressable
                onPress={ () => addProductToCart(prod, setQuan)}
            >
                <AntDesign 
                    style={{marginBottom: 5}}
                    name='shoppingcart'
                    size={40} 
                    color='black'
                />
            </Pressable>
        );
    }

    if (!products['All']) {
        return (
            <>
            <View style={styles.container}>
                <Text>Loading products...</Text>
            </View>
            </>
        );
    }

    if (selectedProduct) {
        return (
            <Product 
                cart={cart} 
                setCart={setCart} 
                selectedProduct={selectedProduct}
                setSelectedProduct={setSelectedProduct}
            />
        );
    }
    
    return (
        <View style={{ flex: 1}}>
            <View style={styles.inputView}>
                <CategoriesPicker />
                <SearchInput query={query} setQuery={setQuery} />
                <SearchButton />
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <SelectedCategory />
                {selectedCategory == 'Search' ? <ClearSearchButton /> : <></>}
            </View>
            <ProductsList />
        </View>
    );
}

const SearchInput = ({ query, setQuery }) => {
    return (
        <TextInput 
            style={styles.textInput}
            value={query}
            onChangeText={(txt) => {setQuery(txt)}}
            placeholder={'Search all products'}
        />
    );
}

const OutStockView = () => {
    return <Text style={styles.outOfStockText}>Out of stock</Text>;
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
    stockContainer: {
        marginEnd: 10,
        justifyContent: 'flex-end',
        alignItems: 'flex-end'
    },
    smallTextContainer: {
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    inStockText: {
        color: 'green'
    },
    outOfStockText: {
        color: 'red'
    },
    inputView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
        marginStart: 10,
        marginEnd: 10,
        marginTop: 20
    },
    textInput: {
        flex: 3,
        height: 35,
        borderWidth: 1,
        paddingStart: 5,
        marginStart: 10,
        marginEnd: 10
    }
});

export default Products;
