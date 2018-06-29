import {beforeEach, describe, it} from 'mocha';
import {expect} from 'chai';
import {Form} from '../src/Form';

describe('Form class', () => {
  let form;
  const initData = {
    title: 'Tile',
    name: 'Name',
    confirmed: false
  };

  describe('creation instance', () => {
    it('should store payload and original data', () => {
      form = new Form(initData);

      expect(form).to.deep.include({payload: initData});
    });
  });

  describe('instance functional', () => {
    beforeEach(() => {
      form = new Form(initData);
    });

  });
});
