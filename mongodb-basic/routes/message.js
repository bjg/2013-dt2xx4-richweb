exports.index = function(req, res){
  res.render('messages/index', { title: 'Send Messages' });
};
