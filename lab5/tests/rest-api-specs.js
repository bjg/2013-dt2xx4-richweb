var superagent = require('superagent');
var chai = require('chai');
var expect = chai.expect;

/*
 * Note the use of the async mode (i.e. the use of the done callback)
 * of Mocha tests to work with the fact that underlying HTTP requests
 * used in each unit test are asynchronous with respect to the test
 * runner flow
 */
describe('Messages API service', function() {
  var id;

  it('create a new message', function(done){
    superagent.post('http://localhost:3000/collections/home')
      .send({ text: 'Some message or other' })
      .end(function(e,res){
        // console.log(res.body)
        expect(e).to.equal(null);
        expect(res.body).to.not.equal(null);
        expect(res.body._id.length).to.equal(24);
        id = res.body._id;
        done();
      });
  });

  it('retrieves a message by id', function(done){
    superagent.get('http://localhost:3000/collections/home/'+id)
      .end(function(e, res){
        // console.log(res.body)
        expect(e).to.equal(null);
        expect(typeof res.body).to.equal('object');
        expect(res.body._id.length).to.equal(24);
        expect(res.body._id).to.equal(id);
        done();
      });
  });

  it('retrieves a collection of home', function(done){
    superagent.get('http://localhost:3000/collections/home')
      .end(function(e, res){
        // console.log(res.body)
        expect(e).to.equal(null);
        expect(res.body.length).to.be.above(0);
        expect(res.body.map(function (item){return item._id})).to.contain(id);
        done();
      });
  });

  it('updates an existing message', function(done){
    superagent.put('http://localhost:3000/collections/home/'+id)
      .send({ text: 'New message text ...'})
      .end(function(e, res){
        // console.log(res.body)
        expect(e).to.equal(null);
        expect(typeof res.body).to.equal('object');
        expect(res.body.msg).to.equal('success');
        done()
      });
  });

  it('checks an updated object', function(done){
    superagent.get('http://localhost:3000/collections/home/'+id)
      .end(function(e, res){
        // console.log(res.body)
        expect(e).to.equal(null);
        expect(typeof res.body).to.equal('object');
        expect(res.body._id.length).to.equal(24);
        expect(res.body._id).to.equal(id);
        expect(res.body.text).to.equal('New message text ...');
        done();
      });
  });
  
  it('removes an object', function(done){
    superagent.del('http://localhost:3000/collections/home/'+id)
      .end(function(e, res){
        // console.log(res.body)
        expect(e).to.equal(null);
        expect(typeof res.body).to.equal('object');
        expect(res.body.msg).to.equal('success');
        done();
      });
  });
});
