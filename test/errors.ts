import {beforeEach, describe, it} from 'mocha';
import {expect} from 'chai';
import {Errors} from '../src/Errors';

describe('Errors class', () => {
  let errorsObject: Errors;
  const errorResponse: object = {
    inputName: ['Error message'],
    multipleErrorInput: ['Some error message', 'Other error message']
  };

  describe('create and record', () => {
    it('should record errors on constructor', () => {
      errorsObject = new Errors(errorResponse);

      expect(errorsObject.errors).to.deep.eq(errorResponse);
    });

    it('should record errors by separated method', () => {
      errorsObject = new Errors();
      errorsObject.record(errorResponse);

      expect(errorsObject.errors).to.deep.eq(errorResponse);
    });
  });

  describe('functional with empty errors object', () => {
    beforeEach(() => {
      errorsObject = new Errors();
    });

    it('should return false if does not have any recorded errors', () => {
      expect(errorsObject.any()).to.be.false;
    });

    it('should return undefined if error does not exist', () => {
      expect(errorsObject.getFirst('otterInputName')).to.be.undefined;
      expect(errorsObject.get('otterInputName')).to.be.undefined;
    });
  });

  describe('functional with recorded errors', () => {
    beforeEach(() => {
      errorsObject = new Errors(errorResponse);
    });

    it('should return true if has error with existed key', () => {
      expect(errorsObject.has('inputName')).to.be.true;
    });

    it('should return false if does not have error with existed key', () => {
      expect(errorsObject.has('otherInputName')).to.be.false;
    });

    it('should return true if has any recorded errors', () => {
      expect(errorsObject.any()).to.be.true;
    });

    it('should return errors Array form field', () => {
      expect(errorsObject.get('inputName')).to.be.an('array')
    });

    it('should return error text form field', () => {
      expect(errorsObject.getFirst('inputName')).to.be.an('string');
      expect(errorsObject.getFirst('multipleErrorInput')).to.be.an('string');
    });

    it('should return first error text form field', () => {
      expect(errorsObject.getFirst('multipleErrorInput')).to.not.be.eq('Other error message');
      expect(errorsObject.getFirst('multipleErrorInput')).to.be.eq('Some error message');
    });

    it('should clear all errors', () => {
      errorsObject.clear();

      expect(errorsObject.errors).to.be.empty;
    });

    it('should clear errors by field', () => {
      errorsObject.clear('inputName');

      expect(errorsObject.errors).to.not.have.property('inputName');
      expect(errorsObject.errors).to.have.property('multipleErrorInput');
    });
  });
});
