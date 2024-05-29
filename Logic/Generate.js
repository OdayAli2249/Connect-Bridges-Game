const fs = require('fs');
const state = require('./State.js');
const grid = require('./Utils').Create_New_Grid();

var GenerateMod = 'file generating';

module.exports = {

    File_Generator: function (path) {

        var newState;
        var data = fs.readFileSync(path);
        var State = state();
        newState = new State(JSON.parse(data));
        return newState;


    }

}