# MIM Replenish Email Notification Bot

This repo contains a simple CLI tool that checks to see how many MIM(Magic Internet Money) are available to borrow on [Abracadabra.money](https://abracadabra.money/) in the UST cauldron on Ethereum. It will email you if this value changes. By default, it polls once a minute, and only sends an email if the value is 25% different than the last time it checked. It uses your login credentials from gmail in order to send emails via SMTP. For gmail, you will need to turn on the "Access for less secure apps" setting, which is a big security issue, so DON'T use your primary email account for this.

You'll need to create a .env file with the following environment variables in the root directory.

```
RPC_URL=<rpc url from Infura or Alchemy>
EMAIL=<username of email account>
PASSWORD=<password of email account>
FROM=<your email address>
TO=<destination email address>
```

To use, first install the dependencies.

```
npm install
```

Then run the bot. You'll know it's working correctly if values are being printed to the console once per minute.

```
npm start
```
