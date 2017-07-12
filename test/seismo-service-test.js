const {
  makeRequests,
  getSeismo,
  putSeismo,
  parseSeismogram,
  getOrDeployContractInstance
} = require('../app/seismo-service');

describe('seismo service', () => {
  it('should request data every interval', () => {

  });
  it('should not update the seismo chat contract if there is no sufficient data', () => {

  });
  it('should update the seismo chat contract if there is sufficient data', () => {

  });
  it('should not throw an error if the request fails', () => {

  });

  it('should convert the seismogram to a 5 value scale', () => {

  });
  it('should use the first five hundred elements of the seismogram', () => {

  });
  it('should throw an error if there are less than 500 measurements', () => {

  });
  it('should deploy a contract if no contract is deployed', () => {

  });
});