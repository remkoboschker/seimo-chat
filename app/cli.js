const {
  makeRequests,
  getSeismo,
  putSeismo
} = require('seismo-service');

function runService() {
  makeRequests(getSeismo, putSeismo, 50000);
}

module.exports = {
  runService
}
