process.env.NODE_ENV = 'test';
const mongoose = require('mongoose');
const request = require('request');

let chai = require('chai');
let chaiHttp = require('chai-http');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const PassThrough = require('stream').PassThrough;
const server = require('../index');
let should = chai.should();
const nconf = require('../config/nconf.js');
const spotifyWebApi = require('spotify-web-api-node');
const UserSchema =require('../models/User');

const userController = require('../controllers/userController');
const movieController = require('../controllers/movieController');
const Stub = require('./stub');
const mocks = require('./mocks');

chai.use(chaiHttp);
chai.use(sinonChai);

let stubAuth, stubGetMe, stubGetUserPlaylists, stubGetPlaylistTracks;

describe('movie controller:', () => {
  before(() => {
    sinon
    .stub(request, 'get')
    .yields(null, null, JSON.stringify({
      results:[
        {id:'1'   ,poster_path:true},
        {id:'2'   ,poster_path:true},
        {id:'3'  ,poster_path:true},
        {id:'4'  ,poster_path:true},
        {id:'5' ,poster_path:true},
        {id:'6' ,poster_path:true},
        {id:'7' ,poster_path:true},
        {id:'8'  ,poster_path:true},
        {id:'9' ,poster_path:true},
        {id:'10' ,poster_path:true},
        {id:'11' ,poster_path:true},
        {id:'12' ,poster_path:true},
        {id:'13',poster_path:true},
        {id:'14',poster_path:true},
        {id:'15',poster_path:true},
      ]
    }));
    const stubFind=Stub.createStub(UserSchema,'find',[mocks.userDoc])
    const stubUpdate=Stub.createStub(userController,'updateUser',[mocks.userDoc])
    const stubRatedMovies=Stub.createStub(movieController,'findRatedMovies',[
      '1',
      '2',
      '3',
    ])
  });

  it('should return correct number of movies for new user', (done) => {
    let res={};
    res.send = (obj) => {
      try {
        obj.should.be.a('object');
        obj.should.have.property('movies');
        obj.movies.length.should.eql(12);
        obj.should.eql({movies:['4','5','6','7', '8', '9','10', '11','12','13','14','15']});
        done();
      } catch (err) {
        done(err);
      }
    };
    let req = {
      headers:{
        authorization:`Bearer 123`
      }
    };
    movieController.survey(req, res);
  });
  it('should return correct number of movies for exising user', (done) => {
    mocks.userDoc.firstLogin=false;
    let res={};
    res.send = (obj) => {
      console.log(obj, ": obj");
      try {
        obj.should.be.a('object');
        obj.should.have.property('movies');
        obj.movies.length.should.eql(3);
        done();
      } catch (err) {
        done(err);
      }
    };
    let req = {
      headers:{
        authorization:`Bearer 123`
      }
    };
    movieController.survey(req, res);
  });
  it('should return not repeat movies', (done) => {
    mocks.userDoc.firstLogin=true;

    let res={};
    res.send = (obj) => {
      try {
        obj.should.be.a('object');
        obj.should.have.property('movies');
        obj.should.eql({movies:['4','5','6','7', '8', '9','10', '11','12','13','14','15']});
        done();
      } catch (err) {
        done(err);
      }
    };
    let req = {
      headers:{
        authorization:`Bearer 123`
      }
    };
    movieController.survey(req, res);
  });
})
