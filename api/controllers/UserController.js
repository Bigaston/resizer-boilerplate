/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const passport = require('passport');

module.exports = {

  /**
   * `UserController.login()`
   */
  login: async function (req, res) {
    passport.authenticate('local', (err, user) => {
      if ((err) || (!user)) {
        return res.redirect('/login');
      } req.logIn(user, (err) => {
        if (err) { res.send(err); }
        return res.redirect('/');
      });
    })(req, res);
  },

  /**
   * `UserController.logout()`
   */
  logout: async function (req, res) {
    req.logout();
    res.redirect('/login');
  },

  /**
   * `UserController.signup()`
   */
  signup: async function (req, res) {
    User.signup({
      username: req.param('username'),
      password: req.param('password'),
      passwordConfirm: req.param('password_confirm')
    }, (err) => {
      if (err) {
        return res.negotiate(err);
      }
      return res.redirect('/login');
    });
  }
};

