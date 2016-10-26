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
          name: "db",
          passwordPolicy: "fair"
        },
        {
          requires_username: false,
          showForgot: true,
          showSignup: true,
          signup_url: "https://signup.com",
          forgot_password_url: "https://forgotpassword.com",
          name: "db1",
          passwordPolicy: "none"
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
          name: "rolodato.com",
          domain: "rolodato.com",
          domain_aliases: [
            "rolodato.com"
          ]
        },
        {
          name: "ad.com",
          domain: "ad.com",
          domain_aliases: [
            "ad.com"
          ]
        },
        {
          name: "corporate",
          domain: "corporate.com",
          domain_aliases: [
            "corporate.com"
          ]
        },
        {
          name: "corporate-no-domain",
          domain: null
        },
        {
          name: "corporate-no-domain1",
          domain: null
        }
      ],
      name: "ad"
    },
    {
      connections: [
        {
          name: "adfs.com",
          domain: "adfs.com",
          domain_aliases: [
            "adfs.com"
          ]
        },
      ],
      name: "adfs"
    },
    {
      connections: [
        {
          name: "auth0-adldap.com",
          domain: "auth0-adldap.com",
          domain_aliases: [
            "auth0-adldap.com"
          ]
        },
      ],
      name: "auth0-adldap"
    },
    {
      connections: [
        {
          name: "custom.com",
          domain: "custom.com",
          domain_aliases: [
            "custom.com"
          ]
        },
      ],
      name: "custom"
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
        {
          name: "google-apps.com",
          domain: "google-apps.com",
          domain_aliases: [
            "google-apps.com"
          ],
          scope: [
            "email",
            "profile"
          ]
        }
      ],
      name: "google-apps",
    },
    {
      connections: [
        {
          name: "ip.com",
          domain: "ip.com",
          domain_aliases: [
            "ip.com"
          ]
        },
      ],
      name: "ip"
    },
    {
      connections: [
        {
          name: "mscrm.com",
          domain: "mscrm.com",
          domain_aliases: [
            "mscrm.com"
          ]
        },
      ],
      name: "mscrm"
    },
    {
      connections: [
        {
          name: "office365.com",
          domain: "office365.com",
          domain_aliases: [
            "office365.com"
          ]
        },
      ],
      name: "office365"
    },
    {
      connections: [
        {
          name: "pingfederate.com",
          domain: "pingfederate.com",
          domain_aliases: [
            "pingfederate.com"
          ]
        },
      ],
      name: "pingfederate"
    },
    {
      connections: [
        {
          name: "samlp.com",
          domain: "samlp.com",
          domain_aliases: [
            "samlp.com"
          ]
        },
      ],
      name: "samlp"
    },
    {
      connections: [
        {
          name: "sharepoint.com",
          domain: "sharepoint.com",
          domain_aliases: [
            "sharepoint.com"
          ]
        },
      ],
      name: "sharepoint"
    },
    {
      connections: [
        {
          name: "waad.com",
          domain: "waad.com",
          domain_aliases: [
            "waad.com"
          ]
        },
      ],
      name: "waad"
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
