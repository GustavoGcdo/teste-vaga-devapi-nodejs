db.users.insertMany([{"email" : "gustavo@email.com", "password" : "e10adc3949ba59abbe56e057f20f883e", "createdAt" : ISODate("2021-04-02T19:06:39.463Z"), "updatedAt" : ISODate("2021-04-02T19:06:39.463Z"), }]); db.connectors.insertMany([{ "name" : "Google Drive", "baseURL" : "example.com", "privacy" : "private", "status" : true, "type" : "rest", "createdAt" : ISODate("2021-04-02T21:45:57.379Z"),    "updatedAt" : ISODate("2021-04-02T21:51:11.548Z"), "__v" : 0, "category" : "armazenamento", "description" : null, "id" : "6067909597d7e55550d49cfa" }  , {     "name" : "Dropbox",     "baseURL" : "example.com",     "privacy" : "private",     "status" : true,     "type" : "rest",     "createdAt" : ISODate("2021-04-02T21:46:08.395Z"), "updatedAt" : ISODate("2021-04-02T21:46:08.395Z"),     "__v" : 0 }  , { "name" : "Mongodb",     "baseURL" : "example.com",     "privacy" : "public",    "status" : true,    "type" : "bd",    "createdAt" : ISODate("2021-04-02T21:46:21.800Z"),     "updatedAt" : ISODate("2021-04-02T21:46:21.800Z"),     "__v" : 0 }  , {     "name" : "Slack",     "baseURL" : "example.com",     "privacy" : "private", "status" : true,     "type" : "rest",     "createdAt" : ISODate("2021-04-02T21:46:44.372Z"),     "updatedAt" : ISODate("2021-04-02T21:46:44.372Z"),     "__v" : 0 } , {     "name" : "Kafka",     "baseURL" : "example.com",     "privacy" : "public",     "status" : true,     "type" : "soap",     "createdAt" : ISODate("2021-04-02T21:47:02.372Z"),     "updatedAt" : ISODate("2021-04-02T21:47:02.372Z"),     "__v" : 0 } , {     "name" : "teste remove",      "baseURL" : "example.com",     "category" : "category",     "privacy" : "private", "status" : false,  "type" : "soap", "createdAt" : ISODate("2021-04-02T21:52:10.977Z"), "updatedAt" : ISODate("2021-04-02T21:52:16.627Z"), "__v" : 0, "description" : null, "id" : "6067920a84b0fd45105936dd"}]);