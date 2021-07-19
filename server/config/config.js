const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || "YOUR_secret_key",
  mongoUri: process.env.MONGODB_URI,
  stripe_connect_test_client_id: 'YOUR_stripe_connect_test_client',
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  stripeClientId: process.env.STRIPE_CLIENT_ID,
  stripeSellerAccount: process.env.STRIPE_SELLER_ACCOUNT
}

module.exports = config;
