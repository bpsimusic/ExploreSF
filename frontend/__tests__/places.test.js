/*global jest*/

describe('entry file', ()=>{
  beforeEach(()=>{
      document.addEventListener = jest.fn();
      let Entry = require('../places');
  });

  it('sets a listener for when the DOM finishes loading', ()=>{
    const callDetails = document.addEventListener.mock.calls;
    expect(document.addEventListener).toBeCalled();
    expect(callDetails[0][0]).toEqual('DOMContentLoaded');
    expect(typeof callDetails[0][1]).toEqual('function');
  });
});
