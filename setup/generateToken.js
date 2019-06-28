const fetch = require("node-fetch");

const Constants = require("./Constants");

module.exports = async function generateToken() {
  const operatorUsername = Constants.OPERATOR_USERNAME;
  const operatorPassword = Constants.OPERATOR_PASSWORD;
  const response = await fetch(Constants.TOKEN_URL, {
    method: "POST",
    body: `grant_type=password&client_id=admin-cli&username=${operatorUsername}&password=${operatorPassword}`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
  const body = await response.json();
  console.log(`Generated user token for user ${Constants.OPERATOR_USERNAME}`);

  return body.access_token;
};
