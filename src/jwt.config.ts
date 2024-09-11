export default {
    jwt: {
      secretOrKey: "N(e)$t&B0i1(e)r&P1@t(e)",
      expiresIn: '5d',
      forgetTokenExpiresIn:'1d'
    },
    "gapi": {
      "CLIENT_ID": process.env.CLIENT_ID,
      "CLIENT_SECRET": process.env.CLIENT_SECRET,
      "REDIRECT_URI": process.env.REDIRECT_URI
  }
}