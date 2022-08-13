export default () => ({
    port      :  parseInt(process.env.PORT, 10) || 3000,
    database  : process.env.DATABASE || 'mongodb://localhost:27017/Demo',
    ether_url : process.env.ETHERFIRSTTX,
    currencies: [
        {
           "price":1,
           "key":"USD",
           "ethers":0.0001
        },
        {
           "price":1,
           "key":"EUR",
           "ethers":0.0001
        }
    ]
});