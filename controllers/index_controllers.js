const index_controller = {
  index: (req, res) => {
    res.render('index');
  },

  faq: (req, res) => {
    res.render('faq');
  },

  game: (req, res) => {
    res.render('game');
  },

  lottery: (req, res) => {
    res.render('lottery');
  }
};


module.exports = index_controller;