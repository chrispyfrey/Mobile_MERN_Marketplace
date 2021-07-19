# Group #11 Final Project - Client

React Native mobile client for our extension of the [MERN Marketplace](https://github.com/shamahoque/mern-marketplace/tree/master). Only targets Android at this time. MERN Marketplace client reinterpreted for mobile environment and extended for charity round-up.

## How to use

### Install Expo
    npm install -g expo-cli

### Install dependancies
    npm install
    
### Within notEnv.js, define NOT_ENV.API_DOMAIN as your server endpoint
- Default is set to https://csc3916-team11-final-server.herokuapp.com/
- If running locally, use local IP address instead of localhost

### Run App
    npm start OR expo start
    
### Download and/or open Expo Go application on mobile device
- Console/Expo-webpage will output a QR code to scan. 
- Scan from Expo Go on Android.
- Scan from camera app on iOS - Picker component is currently broken on iOS.

### Images

#### Signin
<img src="https://github.com/chrispyfrey/CSC3916_Final_Client/blob/master/readme_pngs/apisignin.png?raw=true" width=25% height=25%>

#### Products
<img src="https://github.com/chrispyfrey/CSC3916_Final_Client/blob/master/readme_pngs/apiproducts.png?raw=true" width=25% height=25%>

#### Purchase - Shipping Details
<img src="https://github.com/chrispyfrey/CSC3916_Final_Client/blob/master/readme_pngs/apishipping.png?raw=true" width=25% height=25%>

#### Purchase - Stripe Payment
<img src="https://github.com/chrispyfrey/CSC3916_Final_Client/blob/master/readme_pngs/apicheckout.png?raw=true" width=25% height=25%>

#### Profile - Orders & Donations
<img src="https://github.com/chrispyfrey/CSC3916_Final_Client/blob/master/readme_pngs/apiprofile.png?raw=true" width=25% height=25%>
