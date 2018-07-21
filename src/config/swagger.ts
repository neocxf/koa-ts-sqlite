export default {
  swaggerDefinition: {
    // openapi: '3.0.0',
    swagger: "2.0",
    info: {
      description: "neospot authorization service. You can find out more about Neo\'s contribution at [https://www.neospot.top](https://www.neospot.top) or on [github.com, #SFG](http://github.com/neocxf/). For this sample, you can use the api key `special-key` to test the authorization filters.",
      title: 'Neo Auth',
      version: '1.0.0',
      contact: {
        email: "neocxf@gmail.com"
      },
      license: {
        name: "Apache 2.0",
        url: "http://www.apache.org/licenses/LICENSE-2.0.html"
      }
    },
    host: `${process.env.HOST_URL || 'localhost:3000'}`,
    basePath: "/v1",
    schemes: [
      "http",
      "https",
    ],
    tags: [
      {
        name: "users",
        description: "Authentication using mechanisms such as JWT, provide user registration, login, and etc..",
        externalDocs: {
          description: "Find out more",
          url: "http://swagger.io"
        }
      },
      {
        name: "store",
        description: "Access to Petstore orders"
      },
      {
        name: "user",
        description: "Operations about user",
        externalDocs: {
          description: "Find out more about our store",
          url: "http://swagger.io"
        }
      }
    ],

    "securityDefinitions": {
      "JWT": {
        "description": "the jwt access token that append when try to access sensitive information",
        "type": "apiKey",
        "name": "Authorization",
        "in": "header"
      }
    }

  },
  apis: ['dist/**/*.js'], // Path to the API docs
}