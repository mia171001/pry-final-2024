module.exports = {
    port: 8080,
    appEndpoint: "http://localhost:8080",
    apiEndpoint: "http://localhost:8080",
    jwt_secret: "myS33!!creeeT",
    jwt_expiration_in_seconds: 36000,
    environment: "dev",
    permissionLevels: {
      NORMAL_USER: 1,
      PAID_USER: 4,
      ADMIN: 2048
    }
  };
  