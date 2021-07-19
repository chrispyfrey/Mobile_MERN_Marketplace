# Group #11 Final Project

A single-seller shop for Android based off of our React textbook's MERN Marketplace, expanded to allow users to elect to round up the total of their order and donate the additional cents to charity.

Implemented using React Native, MongoDB, Node.js, Express, and Expo.

## How to use

### Install Expo
    npm install -g expo-cli

### Install dependancies
    npm install
    
### Point notEnv.js -> NOT_ENV.API_DOMAIN to API server
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
