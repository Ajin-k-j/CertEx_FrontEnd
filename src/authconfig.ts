import { Configuration, LogLevel } from "@azure/msal-browser";

export const msalConfig: Configuration = {
  auth: {
    clientId: "1810b0e7-735e-4da2-86f7-066a37307c1d", // Replace with your Azure AD App client ID
    authority: "https://login.microsoftonline.com/5b751804-232f-410d-bb2f-714e3bb466eb", // Replace with your tenant ID
    redirectUri: "http://localhost:5173", // Replace with your redirect URI
  },
  cache: {
    cacheLocation: "localStorage", // Use localStorage to persist login across tabs
    storeAuthStateInCookie: false, // Set to true if cookies are needed for IE11 or Edge
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) return;
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            break;
          case LogLevel.Info:
            console.info(message);
            break;
          case LogLevel.Verbose:
            console.debug(message);
            break;
          case LogLevel.Warning:
            console.warn(message);
            break;
        }
      },
      logLevel: LogLevel.Info, // Adjust log level as needed
      piiLoggingEnabled: false,
    },
  },
};

export const loginRequest = {
  scopes: ["User.Read"], // Define the scopes you need
};
