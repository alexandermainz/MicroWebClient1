//
// main.js
//
// Sample web application for Azue AD B2C demo
//

var accessToken = null;

// Configuration values for the sample client application registration
const msalConfig = {
    auth: {
        clientId: '4a816c64-03b1-402c-abf5-9ddc93b47a80',
        authority: 'https://alexandersb2c.b2clogin.com/tfp/alexandersb2c.onmicrosoft.com/B2C_1_SuSi',
        knownAuthorities: ['alexandersb2c.b2clogin.com'],
        redirectUri: 'http://localhost:52074'
    }
};

const msalInstance = new Msal.UserAgentApplication(msalConfig);

// show a login popup für Azure AD login
msalInstance.loginPopup({})
        .then(response => {
            // handle OK response
            const myAccounts = msalInstance.getAllAccounts();
            $("#username").html(myAccounts[0].idToken.emails[0]);
            // get access token for the "WebAPI1"-API
            acquireAccessToken();
        })
        .catch(err => {
            // handle errors
            console.log("login error!");
        });

function acquireAccessToken() {
    // configure the scope, for which an access token shall be fetched
    var request = {
        scopes: ["https://alexandersb2c.onmicrosoft.com/WebAPI1/user_impersonation"]
    };

    // try to silently get the token (this succeeds, if the user is already athenticated)
    msalInstance.acquireTokenSilent(request).then(tokenResponse => {
        // store the token response in a variable for testing purposes
        // (should be stored somewhere in application memory or cookie)
        accessToken = tokenResponse.accessToken;
    }).catch(async (error) => {
        // if silent acquire fails, try to get the token with a login popup
        return msalInstance.acquireTokenPopup(request);
    }).catch(error => {
        // handle errors
        console.log("error while acquiring access token!");
        console.log(error);
    });
}
