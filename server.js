
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

// Include Modules
let exp = require('express');
let path = require('path');
let fs = require('fs');

let config = require('./configs/configs');
let express = require('./configs/express');
let mongoose = require('./configs/mongoose');


let swaggerUi = require('swagger-ui-express');

// HTTP Authentication
var basicAuth = require('basic-auth');
var auth = function (req, res, next) {
    var user = basicAuth(req);
    if (!user || !user.name || !user.pass) {
        res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
        res.sendStatus(401);
        return;
    }
    next();

}

global.appRoot = path.resolve(__dirname);

db = mongoose();
const app = express();

app.get('/', function (req, res, next) {
    res.send('hello world');
});

/* Old path for serving public folder */
app.use('/', exp.static(__dirname + '/public'));

if (process.env.NODE_ENV !== "production") {
    var options = {
        customCss: '.swagger-ui .models { display: none }',
        swaggerOptions: {
            docExpansion: 'none'
        }
    };
    let mainSwaggerData = JSON.parse(fs.readFileSync('swagger.json'));
    mainSwaggerData.host = config.host;
    mainSwaggerData.basePath = config.baseApiUrl;

    const modules = './app/modules';
    fs.readdirSync(modules).forEach(file => {
        if (fs.existsSync(modules + '/' + file + '/swagger.json')) {
            const stats = fs.statSync(modules + '/' + file + '/swagger.json');
            const fileSizeInBytes = stats.size;
            if (fileSizeInBytes) {
                let swaggerData = fs.readFileSync(modules + '/' + file + '/swagger.json');
                swaggerData = swaggerData ? JSON.parse(swaggerData) : { paths: {}, definitions: {} };
                mainSwaggerData.paths = { ...swaggerData.paths, ...mainSwaggerData.paths };
                mainSwaggerData.definitions = { ...swaggerData.definitions, ...mainSwaggerData.definitions };
            }
        }
    });

    app.get("/docs", auth, (req, res, next) => {
        next();
    });





    let swaggerDocument = mainSwaggerData;
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));
}



// Listening Server
app.listen(parseInt(config.serverPort), async () => {
    console.log('process.env.NODE_ENV', process.env.NODE_ENV);
    console.log(`Server running at http://localhost:${config.serverPort}`);
});
