export default {
  strategies: [
    {
      connections: [
        {
          requires_username: false,
          showForgot: true,
          showSignup: true,
          signup_url: "https://signup.com",
          forgot_password_url: "https://forgotpassword.com",
          name: "Username-Password-Authentication",
          passwordPolicy: "fair"
        }
      ],
      name: "auth0"
    },
    {
      connections: [
        {
          scope: [
            "email",
            "profile"
          ],
          name: "google-oauth2"
        }
      ],
      name: "google-oauth2"
    },
    {
      connections: [
        {
          name: "rolodato",
          domain: "rolodato.com",
          domain_aliases: [
            "rolodato.com"
          ]
        },
        {
          name: "ad-no-domain",
          domain: null
        },
      ],
      name: "ad"
    },
    {
      connections: [
        {
          name: "auth0.com",
          domain: "auth0.com",
          domain_aliases: [
            "auth0.com"
          ],
          scope: [
            "email",
            "profile"
          ]
        },
      ],
      name: "google-apps",
    },
    {
      connections: [
        {
          name: "auth10.com",
          domain: "auth10.com",
          domain_aliases: [
            "auth10.com"
          ],
          scope: [
            "email",
            "profile"
          ]
        },
      ],
      name: "google-apps",
    },
    {
      connections: [
        {
          name: "exact"
        }
      ],
      name: "exact"
    },
    {
      connections: [
        {
          name: "facebook"
        }
      ],
      name: "facebook"
    },
    {
      connections: [
        {
          name: "fitbit"
        }
      ],
      name: "fitbit"
    },
    {
      connections: [
        {
          name: "thirtysevensignals"
        }
      ],
      name: "thirtysevensignals"
    },
    {
      connections: [
        {
          name: "twitter"
        }
      ],
      name: "twitter"
    },
    {
      connections: [
        {
          name: "windowslive"
        }
      ],
      name: "windowslive"
    },
    {
      connections: [
        {
          name: "wordpress"
        }
      ],
      name: "wordpress"
    },
    {
      connections: [
        {
          name: "github"
        }
      ],
      name: "github"
    },
    {
      connections: [
        {
          name: "email"
        }
      ],
      name: "email"
    },
    {
      connections: [
        {
          name: "sms"
        }
      ],
      name: "sms"
    }
  ],
  hasAllowedOrigins: true,
  callback: window.location.href,
  authorize: "https://authorize.com",
  subscription: "free",
  tenant: "example",
  id: "L9kBZOpEbLizzCGv6N8n9wNfQhbvREw0"
};
