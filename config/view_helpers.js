const env = require('./environment');
const fs = require('fs');
const path = require('path');

// this will recieve the express app instance 
module.exports = (app) => {
    app.locals.assetPath = function(filePath){
        // it will see wheather the environment is development or production then it will fetch the correct file and give it to browser
        if(env.name == 'development'){
            return '/' + filePath;
        }
        return '/' + JSON.parse(fs.readFileSync(path.join(__dirname, '../public/assets/rev-manifest.json')))[filePath];
    }
}