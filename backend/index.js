const restify = require('restify');

const errs = require('restify-errors');


const server = restify.createServer({
    name: 'myapp',
    version: '1.0.0'
});

const knex = require('knex')({
    client: 'mysql',
    connection: {
        host: '50.62.209.185',
        user: 'test_node',
        password: 'Masterkey1',
        database: 'test_node'
    }
});

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

server.listen(8080, function() {
    console.log('%s listening at %s', server.name, server.url);
});

server.post('/create', function(req, res, next) {

    knex('REST')
        .insert(req.body)
        .then((dados) => {
            res.send(dados);

        }, next);

    return next();
});

server.get('/', restify.plugins.serveStatic({

    directory: "../dist",
    file: "index.html"
}));

server.get('/read', function(req, res, next) {

    knex('REST').then((dados) => {
        res.send(dados);

    }, next);

    return next();
});

server.get('/show/:id', function(req, res, next) {

    const { id } = req.params;
    knex('REST')
        .where('id', id)
        .first()
        .then((dados) => {
            if (!dados)
                return res.send(new errs.BadRequestError('nada foi encontrado'));

            res.send(dados);
        }, next);
});

server.put('/update/:id', function(req, res, next) {

    const { id } = req.params;
    knex('REST')
        .where('id', id)
        .update(req.body)
        .then((dados) => {
            if (!dados)
                return res.send(new errs.BadRequestError('nada foi encontrado'));

            res.send('Dados Atualizados');
        }, next);
});

server.del('/delete/:id', function(req, res, next) {

    const { id } = req.params;
    knex('REST')
        .where('id', id)
        .delete()
        .then((dados) => {
            if (!dados)
                return res.send(new errs.BadRequestError('nada foi encontrado'));

            res.send('Registro Excluído');
        }, next);
});