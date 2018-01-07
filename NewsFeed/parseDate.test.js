import React from 'react';
import {parseDate} from './App';

describe('Test parseDate function', function() {

  it('should parse from 12 Aug 2018 1800 to 12th August 2018 | 6pm', () => {
    expect(parseDate('12 Aug 2018', 1800)).toEqual('12th August 2018 | 6pm');
  });

  it('should parse from 3 Dec 2018 1100 to 3rd December 2018 | 11am', () => {
    expect(parseDate('3 Dec 2018', 1100)).toEqual('3rd December 2018 | 11am');
  });

  it('should parse from  1800 to  | 1800', () => {
    expect(parseDate('', 1800)).toEqual(' | 1800');
  });

  it('should parse from 12 Aug 2018, 2510 to 12 Aug 2018 | 2510', () => {
    expect(parseDate('12 Aug 2018', 2510)).toEqual('12 Aug 2018 | 2510');
  });

});
