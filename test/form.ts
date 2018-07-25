import {after, before, beforeEach, describe, it} from 'mocha';
import {expect} from 'chai';
import {Form} from '../src/Form';
import http from 'http'
import express from './helpers/express';

describe('Form class', () => {
  let server: http.Server;
  let form: Form;
  const initData: {
    title: string,
    name: string,
    conformed: boolean,
    ids: any[],
    file?: File
  } = {
    title: 'Title',
    name: 'Name',
    conformed: true,
    ids: [1, 2, 3],
    file: null,
  };

  before(() => server = express.listen(3000));
  after(() => server.close());

  describe('creation instance', () => {
    it('should store payload and original data', () => {
      form = new Form(initData);

      expect(form).to.deep.include({payload: initData});
      expect(form.title).to.equal(initData.title);
    });
  });

  describe('instance functional', () => {
    beforeEach(() => {
      form = new Form(initData);
    });

    it('should change only payload data', () => {
      const newTitle: string = 'Some new title';
      form.title = newTitle;

      expect(form.title).to.be.equal(newTitle);
      expect(form.formData()).to.be.equal(form.payload);
      expect(form.payload.title).to.be.equal(newTitle);
      expect(form.originalData.title).to.be.equal(initData.title);
    });

    it('should send data to the server ', () => {
      form.post('http://localhost:3000/post')
        .then(response => expect(response.data).to.deep.include(form.payload))
        .catch(err => expect(true, err).to.be.false);
    });

    it('should convert method if file presents in the form data', () => {
      form.file = new File(['foo bar'], 'foo.txt', {type: 'text/plain'});
      expect(form.formData() instanceof FormData).to.be.true;
    });

    it('should store errors', async () => {
      try {
        await form.post('http://localhost:3000/error');
        expect(true, 'Response should be unsuccessful').to.be.false;
      } catch (err) {
        expect(form.errors.errors).to.have.deep.include({field: ['Error message']})
      }
    });

    it('should reset payload to original state', () => {
      const newTitle = 'Some new title';
      form.title = newTitle;
      expect(form.title).to.be.equal(newTitle);
      form.reset();
      expect(form.title).to.be.equal(initData.title);
    });
  });
});
