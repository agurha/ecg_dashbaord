/**
 * Created with JetBrains WebStorm.
 * User: agurha
 * Date: 31/03/2013
 * Time: 11:53
 * To change this template use File | Settings | File Templates.
 */

exports.home = function(req,res) {

  res.render("home",  {
    layout:'layout',
    title:'home'
  })

}

exports.about = function(req,res){
  res.render("about", {

    title:'about'
  })
}

exports.terms = function(req,res) {

  res.render('terms', {
    title : 'terms'
  })
}

exports.docs = function(req,res) {

  res.render('docs', {
    title : docs
  })
}