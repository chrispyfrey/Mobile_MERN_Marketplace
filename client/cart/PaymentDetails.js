import React, { useState } from 'react';
import { 
    StyleSheet, 
    Text, 
    View, 
    TextInput, 
    Button,
    Picker,
    Switch
} 
from 'react-native';

const months = ['Month', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
const years = ['Year', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35'];
const charities = ['Select a charity', 'Mile High United Way Inc', 'Electronic Frontier Foundation']

const PaymentDetails = ({ setCheckingOut, setPaying, cart, shippingDetails}) => {
    const [cardName, setCardName] = useState('');
    const [cardNum, setCardNum] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [cvv, setCvv] = useState('');
    const [donate, setDonate] = useState(false);
    const [charity, setCharity] = useState('');
    const charitySwitch = () => setDonate(lastState => !lastState);

    let monthList = months.map((state, i) => {
        return <Picker.Item key={i} value={state} label={state} />
    });

    let yearList = years.map((year, i) => {
        return <Picker.Item key={i} value={year} label={year} />
    });

    let charityList = charities.map((charity, i) => {
        return <Picker.Item key={i} value={charity} label={charity} />
    });

    return (
        <>
        <View style={styles.container}>
            <Text style={styles.titleText}>Payment Details</Text>
        </View>
        <View style={styles.inputView}>
            <TextInput
                style={styles.textInput}
                onChangeText={setCardName}
                value={cardName}
                placeholder={'Cardholder name'}
                maxLength={50}
            />
        </View>
        <View style={styles.inputView}>
            <TextInput
                style={styles.textInput}
                onChangeText={setCardNum}
                value={cardNum}
                placeholder={'Card number'}
                keyboardType={'numeric'}
                maxLength={16}
                secureTextEntry={true}
            />
        </View>
        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
            <Picker
                selectedValue={month}
                style={{ marginStart: 20, height: 40, width: 110 }}
                onValueChange={(selMonth) => setMonth(selMonth)}
                >
                    {monthList}
            </Picker>
            <Text style={{fontSize: 25}}>/</Text>
            <Picker
                selectedValue={year}
                style={{marginStart: 20, height: 40, width: 96 }}
                onValueChange={(selYear) => setYear(selYear)}
            >
                {yearList}
            </Picker>
            <View style={styles.inputView}>
            <TextInput
                style={{
                    flex: 1,
                    height: 40,
                    marginEnd: 20,
                    borderWidth: 1,
                    padding: 5
                }}
                onChangeText={setCvv}
                value={cvv}
                placeholder={'CVV/CVC'}
                keyboardType={'numeric'}
                maxLength={3}
                secureTextEntry={true}
            />
            </View>
        </View>
        <View style={styles.charityContainer}>
            <Text>Round up to the next dollar for charity?</Text>
            <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={donate ? "#2180de" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={charitySwitch}
                value={donate}
            />
        </View>
        { donate ? 
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
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
                onPress={ () => {
                    setCheckingOut(true);
                    setPaying(false);
                }}
            />
            </View>
            <View style={{width: 120}}>
            <Button 
                title={'Place Order'}
                onPress={ () => {
                    setPaying(false);
                    console.log('Payment confirmation button pressed.');
                }}
            />
            </View>
        </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
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
      flex: 2,
      height: 40,
      margin: 20,
      borderWidth: 1,
      padding: 5
    },
    buttonView: {
      width: 100
    },
    buttonContainer: {
        flex: 2,
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

export default PaymentDetails;