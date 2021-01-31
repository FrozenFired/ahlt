module.exports = function(app){
	require('./aaAderRouter')(app);
	require('./aRouter')(app);
};