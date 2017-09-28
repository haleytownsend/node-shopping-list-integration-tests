const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

// this lets us use *should* style syntax in our tests
const should = chai.should();

// This let's us make HTTP requests
// in our tests.
chai.use(chaiHttp);


describe('Recipes', function() {

  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });

  it('should list items on GET', function() {
    return chai.request(app)
      .get('/recipes')
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body.length.should.be.at.least(1);
        res.body.forEach(function(item) {
          item.should.be.a('object');
          item.should.include.keys('id', 'name', 'ingredients');
        });
      });
  });


  it('should add an item on POST', function() {
    const newRecipe = {name: 'cafe au lait', ingredients: ['coffee', 'steamed milk']};
    return chai.request(app)
      .post('/recipes')
      .send(newRecipe)
      .then(function(res) {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.include.keys('id', 'name', 'ingredients');
        res.body.name.should.equal(newRecipe.name);
        res.body.ingredients.should.be.a('array');
        res.body.ingredients.should.include.members(newRecipe.ingredients);
      });
  });

 
  it('should update recipes on PUT', function() {
    const updateData = {
      name: 'foo',
      ingredients: ['fizz', 'buzz', 'bang']
    };

    return chai.request(app)
      .get('/recipes')
      .then(function(res) {
        updateData.id = res.body[0].id;
     
        return chai.request(app)
          .put(`/recipes/${updateData.id}`)
          .send(updateData);
      })
      .then(function(res) {
        res.should.have.status(204);
      });
  });


  it('should delete items on DELETE', function() {
    return chai.request(app)
      .get('/recipes')
      .then(function(res) {
        return chai.request(app)
          .delete(`/recipes/${res.body[0].id}`);
      })
      .then(function(res) {
        res.should.have.status(204);
      });
  });
});
