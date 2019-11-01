define({ "api": [
  {
    "type": "get",
    "url": "/api/dashboard/timestamp",
    "title": "crowdsale end date",
    "name": "crowdsale_end_date",
    "version": "0.0.1",
    "group": "dashboard",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "boolean",
            "optional": false,
            "field": "success",
            "description": "<p>information about operation success. If false - <code>errorCode</code> must be defined.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "payload",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "payload.date",
            "description": "<p>crowdsale end date</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "errorCode",
            "description": "<p>code of occurred error. Can be one of: <code>INTERNAL_ERROR</code></p>"
          }
        ]
      }
    },
    "filename": "src/backend/routes/protected/dashboard.ts",
    "groupTitle": "dashboard"
  },
  {
    "type": "get",
    "url": "/api/dashboard/accept",
    "title": "accept terms & conditions",
    "name": "qr",
    "version": "0.0.1",
    "group": "dashboard",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "boolean",
            "optional": false,
            "field": "success",
            "description": "<p>information about operation success. If false - <code>errorCode</code> must be defined.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "errorCode",
            "description": "<p>code of occurred error. Can be one of: <code>INTERNAL_ERROR</code></p>"
          }
        ]
      }
    },
    "filename": "src/backend/routes/protected/dashboard.ts",
    "groupTitle": "dashboard"
  },
  {
    "type": "post",
    "url": "/api/dashboard/save-investment",
    "title": "saving the investment",
    "name": "saving_the_investment",
    "version": "0.0.1",
    "group": "dashboard",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "number",
            "optional": false,
            "field": "amount",
            "description": "<p>amount of currency</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "currency",
            "description": "<p>currency type</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "boolean",
            "optional": false,
            "field": "success",
            "description": "<p>information about operation success. If false - <code>errorCode</code> must be defined.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "errorCode",
            "description": "<p>code of occurred error. Can be one of: <code>INTERNAL_ERROR</code>, <code>CURRENCY_NOT_VALID</code>, <code>AMOUNT_NOT_VALID</code></p>"
          }
        ]
      }
    },
    "filename": "src/backend/routes/protected/dashboard.ts",
    "groupTitle": "dashboard"
  },
  {
    "type": "get",
    "url": "/api/dashboard/rates",
    "title": "token rates",
    "name": "token_rates",
    "version": "0.0.1",
    "group": "dashboard",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "boolean",
            "optional": false,
            "field": "success",
            "description": "<p>information about operation success. If false - <code>errorCode</code> must be defined.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "payload",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "number",
            "optional": false,
            "field": "payload.usd",
            "description": "<p>usd rate</p>"
          },
          {
            "group": "Success 200",
            "type": "number",
            "optional": false,
            "field": "payload.btc",
            "description": "<p>btc rate</p>"
          },
          {
            "group": "Success 200",
            "type": "number",
            "optional": false,
            "field": "payload.eur",
            "description": "<p>eur rate</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "errorCode",
            "description": "<p>code of occurred error. Can be one of: <code>INTERNAL_ERROR</code></p>"
          }
        ]
      }
    },
    "filename": "src/backend/routes/protected/dashboard.ts",
    "groupTitle": "dashboard"
  },
  {
    "type": "post",
    "url": "/api/dashboard/history/:page",
    "title": "transaction history",
    "name": "transaction_history",
    "version": "0.0.1",
    "group": "dashboard",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "number",
            "optional": false,
            "field": "page",
            "description": "<p>(in link) current page</p>"
          },
          {
            "group": "Parameter",
            "type": "number",
            "optional": false,
            "field": "count",
            "description": "<p>count of records per page</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "boolean",
            "optional": false,
            "field": "success",
            "description": "<p>information about operation success. If false - <code>errorCode</code> must be defined.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "payload",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "number",
            "optional": false,
            "field": "payload.count",
            "description": "<p>total count of user&quot;s transactions</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "payload.history",
            "description": "<p>transactions list for current page</p>"
          },
          {
            "group": "Success 200",
            "type": "number",
            "optional": false,
            "field": "payload.history.id",
            "description": "<p>transaction id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "payload.history.agent",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "payload.history.transType",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "number",
            "optional": false,
            "field": "payload.history.amount",
            "description": "<p>amount of currency spent</p>"
          },
          {
            "group": "Success 200",
            "type": "number",
            "optional": false,
            "field": "payload.history.amountTokens",
            "description": "<p>amount of tokens bought</p>"
          },
          {
            "group": "Success 200",
            "type": "number",
            "optional": false,
            "field": "payload.history.bonus",
            "description": "<p>bonus percentage for transaction</p>"
          },
          {
            "group": "Success 200",
            "type": "number",
            "optional": false,
            "field": "payload.history.currencyRate",
            "description": "<p>rate of spent currency</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "payload.history.bankId",
            "description": "<p>bank id</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "payload.history.time",
            "description": "<p>transaction time</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "errorCode",
            "description": "<p>code of occurred error. Can be one of: <code>INTERNAL_ERROR</code>, <code>COUNT_NOT_VALID</code>, <code>PAGE_NOT_VALID</code></p>"
          }
        ]
      }
    },
    "filename": "src/backend/routes/protected/dashboard.ts",
    "groupTitle": "dashboard"
  },
  {
    "type": "get",
    "url": "/api/dashboard/balance",
    "title": "user balance",
    "name": "user_balance",
    "version": "0.0.1",
    "group": "dashboard",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "boolean",
            "optional": false,
            "field": "success",
            "description": "<p>information about operation success. If false - <code>errorCode</code> must be defined.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "payload",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "number",
            "optional": false,
            "field": "payload.balance",
            "description": "<p>current user&quot;s balance</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "errorCode",
            "description": "<p>code of occurred error. Can be one of: <code>INTERNAL_ERROR</code></p>"
          }
        ]
      }
    },
    "filename": "src/backend/routes/protected/dashboard.ts",
    "groupTitle": "dashboard"
  },
  {
    "type": "get",
    "url": "/api/dashboard/user-info",
    "title": "user info",
    "name": "user_info",
    "version": "0.0.1",
    "group": "dashboard",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "boolean",
            "optional": false,
            "field": "success",
            "description": "<p>information about operation success. If false - <code>errorCode</code> must be defined.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "payload",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "payload.email",
            "description": "<p>user&quot;s email</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "payload.country",
            "description": "<p>user&quot;s country</p>"
          },
          {
            "group": "Success 200",
            "type": "boolean",
            "optional": false,
            "field": "payload.vip",
            "description": "<p>flag that shows is user is vip or not</p>"
          },
          {
            "group": "Success 200",
            "type": "boolean",
            "optional": false,
            "field": "payload.enabled2fa",
            "description": "<p>flag that shows is 2fa enabled or not</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "payload.address",
            "description": "<p>user's address</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "payload.city",
            "description": "<p>user's city</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "payload.state",
            "description": "<p>user's state</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "payload.zipCode",
            "description": "<p>user's zipCode</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "payload.phone",
            "description": "<p>user's phone</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "payload.description",
            "description": "<p>user's description</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "errorCode",
            "description": "<p>code of occurred error. Can be one of: <code>INTERNAL_ERROR</code></p>"
          }
        ]
      }
    },
    "filename": "src/backend/routes/protected/dashboard.ts",
    "groupTitle": "dashboard"
  },
  {
    "type": "delete",
    "url": "/api/settings/delete-account",
    "title": "delete user account",
    "name": "delete_user_account",
    "version": "0.0.1",
    "group": "settings",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "boolean",
            "optional": false,
            "field": "success",
            "description": "<p>information about operation success. If false - <code>errorCode</code> must be defined.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "errorCode",
            "description": "<p>code of occurred error. Can be one of: <code>INTERNAL_ERROR</code></p>"
          }
        ]
      }
    },
    "filename": "src/backend/routes/protected/settings.ts",
    "groupTitle": "settings"
  },
  {
    "type": "get",
    "url": "/api/settings/qr",
    "title": "generate qr-code",
    "name": "qr",
    "version": "0.0.1",
    "group": "settings",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "src",
            "description": "<p>source of qr-code in .png image</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "src",
            "description": "<p>blank string</p>"
          }
        ]
      }
    },
    "filename": "src/backend/routes/protected/settings.ts",
    "groupTitle": "settings"
  },
  {
    "type": "post",
    "url": "/api/settings/save",
    "title": "save settings",
    "name": "save_settings",
    "version": "0.0.1",
    "group": "settings",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "currentPass",
            "description": "<p>current user password (required only for password changing)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "newPass",
            "description": "<p>new user password (required only for password changing)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "confirm",
            "description": "<p>new user password confirmation (required only for password changing)</p>"
          },
          {
            "group": "Parameter",
            "type": "boolean",
            "optional": false,
            "field": "enable2fa",
            "description": "<p>flag that shows is 2fa enabled or not (required only for 2fa enabling/disabling)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>password from Google Authenticator app (required only for 2fa enabling/disabling)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "boolean",
            "optional": false,
            "field": "success",
            "description": "<p>information about operation success. If false - <code>errorCode</code> must be defined.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "errorCode",
            "description": "<p>code of occurred error. Can be one of: <code>INTERNAL_ERROR</code>, <code>PASSWORD_NOT_VALID</code>, <code>NEW_PASSWORD_NOT_VALID</code>, <code>CONFIRM_NOT_VALID</code>, <code>WRONG_TOKEN</code>, <code>PASSWORD_MISMATCH</code>, <code>WRONG_PASSWORD</code></p>"
          }
        ]
      }
    },
    "filename": "src/backend/routes/protected/settings.ts",
    "groupTitle": "settings"
  },
  {
    "type": "post",
    "url": "/api/signin/login",
    "title": "login",
    "name": "log_in",
    "version": "0.0.1",
    "group": "signin",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>email address</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>password</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>code from Google Authenticator (not required)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "boolean",
            "optional": false,
            "field": "success",
            "description": "<p>information about operation success. If false - <code>errorCode</code> must be defined.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "errorCode",
            "description": "<p>code of occurred error. Can be one of: <code>INTERNAL_ERROR</code>, <code>WRONG_EMAIL_OR_PASS</code>, <code>REQUIRED_2FA</code></p>"
          }
        ]
      }
    },
    "filename": "src/backend/routes/public/signin.ts",
    "groupTitle": "signin"
  },
  {
    "type": "get",
    "url": "/api/signin/logout",
    "title": "logout",
    "name": "logout",
    "version": "0.0.1",
    "group": "signin",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "boolean",
            "optional": false,
            "field": "success",
            "description": "<p>information about operation success. If false - <code>errorCode</code> must be defined.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "errorCode",
            "description": "<p>code of occurred error. Can be one of: <code>INTERNAL_ERROR</code></p>"
          }
        ]
      }
    },
    "filename": "src/backend/routes/public/signin.ts",
    "groupTitle": "signin"
  },
  {
    "type": "post",
    "url": "/api/signin/recover",
    "title": "recover password",
    "name": "recover",
    "version": "0.0.1",
    "group": "signin",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>user's email to recover</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "boolean",
            "optional": false,
            "field": "success",
            "description": "<p>information about operation success. If false - <code>errorCode</code> must be defined.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "errorCode",
            "description": "<p>code of occurred error. Can be one of: <code>INTERNAL_ERROR</code>, <code>NOT_FOUND</code>, <code>TOO_EARLY</code></p>"
          }
        ]
      }
    },
    "filename": "src/backend/routes/public/signin.ts",
    "groupTitle": "signin"
  },
  {
    "type": "post",
    "url": "/api/signup/check-email",
    "title": "check email",
    "name": "email_checking",
    "version": "0.0.1",
    "group": "signup",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>entered email address</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "boolean",
            "optional": false,
            "field": "success",
            "description": "<p>information about operation success. If false - <code>errorCode</code> must be defined.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "errorCode",
            "description": "<p>code of occurred error. Can be one of: <code>INTERNAL_ERROR</code>, <code>EMAIL_NOT_VALID</code>, <code>EMAIL_NOT_UNIQUE</code></p>"
          }
        ]
      }
    },
    "filename": "src/backend/routes/public/signup.ts",
    "groupTitle": "signup"
  },
  {
    "type": "get",
    "url": "/api/signup/verify-email",
    "title": "verify email",
    "name": "email_verification",
    "version": "0.0.1",
    "group": "signup",
    "description": "<p>in case of successfully verification app sets cookie &quot;verified&quot; to &quot;true&quot; value</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "code",
            "description": "<p>verification code</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "boolean",
            "optional": false,
            "field": "success",
            "description": "<p>information about operation success. If false - <code>errorCode</code> must be defined.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "errorCode",
            "description": "<p>code of occurred error. Can be one of: <code>INTERNAL_ERROR</code>, <code>VERIFICATION_CODE_NOT_VALID</code>, <code>NOT_FOUND</code>, <code>EXPIRED</code></p>"
          }
        ]
      }
    },
    "filename": "src/backend/routes/public/signup.ts",
    "groupTitle": "signup"
  },
  {
    "type": "post",
    "url": "/api/signup/register",
    "title": "register",
    "name": "user_registration",
    "version": "0.0.1",
    "group": "signup",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "firstName",
            "description": "<p>first name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "lastName",
            "description": "<p>last name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>email address</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>password</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "confirm",
            "description": "<p>password confirmation</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "country",
            "description": "<p>country</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "address",
            "description": "<p>address</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "city",
            "description": "<p>city</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "state",
            "description": "<p>state</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "zipCode",
            "description": "<p>zipCode</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "phone",
            "description": "<p>phone in fully format</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>user role description. can be one of: <code>INDIVIDUAL</code>, <code>SYNDICATE</code>, <code>CRYPTO_FUND</code>, <code>VENTURE_FUND</code>, <code>STRATEGIC</code>, <code>GOVERNMENT_ENTITY</code></p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "boolean",
            "optional": false,
            "field": "success",
            "description": "<p>information about operation success. If false - <code>errorCode</code> must be defined.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "errorCode",
            "description": "<p>code of occurred error. Can be one of: <code>INTERNAL_ERROR</code>, <code>FIRST_NAME_NOT_VALID</code>, <code>LAST_NAME_NOT_VALID</code>, <code>EMAIL_NOT_VALID</code>, <code>PASSWORD_NOT_VALID</code>, <code>CONFIRM_NOT_VALID</code>, <code>COUNTRY_NOT_VALID</code>, <code>ADDRESS_NOT_VALID</code>, <code>CITY_NOT_VALID</code>, <code>STATE_NOT_VALID</code>, <code>ZIP_CODE_NOT_VALID</code>, <code>PHONE_NOT_VALID</code>, <code>DESCRIPTION_NOT_VALID</code>, <code>PASSWORD_MISMATCH</code>, <code>EMAIL_NOT_UNIQUE</code></p>"
          }
        ]
      }
    },
    "filename": "src/backend/routes/public/signup.ts",
    "groupTitle": "signup"
  },
  {
    "type": "post",
    "url": "/api/signup/resend",
    "title": "resend verification letter",
    "name": "verification_resending",
    "version": "0.0.1",
    "group": "signup",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>email address for verification resending</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "boolean",
            "optional": false,
            "field": "success",
            "description": "<p>information about operation success. If false - <code>errorCode</code> must be defined.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "errorCode",
            "description": "<p>code of occurred error. Can be one of: <code>NOT_FOUND</code>, <code>USER_ALREADY_VERIFIED</code>, <code>TOO_EARLY</code>, <code>INTERNAL_ERROR</code>, <code>EMAIL_NOT_VALID</code></p>"
          }
        ]
      }
    },
    "filename": "src/backend/routes/public/signup.ts",
    "groupTitle": "signup"
  }
] });
