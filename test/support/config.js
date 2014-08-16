/**
 * Configure mocha
 */

mocha.timeout(60000);
mocha.ui('bdd');
mocha.globals(['jQuery*', '__auth0jp*']);

