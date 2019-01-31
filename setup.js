const bcrypt = require('bcryptjs');

const User = require('./models/User');
const keys = require('./config/keys');
const USER_ROLES = require('./constants/userRoles');

const usernames = [
  'angel', 'bubbles', 'shimmer', 'angelic', 'bubbly', 'glimmer', 'baby', 'pink', 'little', 'butterfly', 'sparkly', 'doll', 'sweet', 'sparkles', 'dolly', 'sweetie', 'sprinkles', 'lolly', 'princess', 'fairy', 'honey', 'snowflake', 'pretty', 'sugar', 'cherub', 'lovely', 'blossom',
  'bandalls', 'wattlexp', 'sweetiele', 'hyperYauFarer', 'editussion', 'experthead', 'flamesbria', 'heroAnhart', 'liveltekah', 'linguss', 'interestec', 'fuzzySpuffy', 'monsterup', 'milkA1Baby', 'lovesBoost', 'edgymnerch', 'ortspoon', 'oranolio', 'oneMama', 'dravenfact', 'reallychel', 'reakefit', 'popularkiya', 'breacche', 'blikimore', 'stoneWellForever', 'simmson', 'brightHulk', 'bootecia', 'spuffyffet', 'rozalthiric', 'bookman'
];

module.exports = {
  createAdmin: () => {
    User
      .findOne({ role: USER_ROLES.ADMIN })
      .then(user => {
        if (!user) {
          const values = {
            username: 'super-admin',
            email: keys.superAdminEmail,
            password: keys.superAdminPassword,
            role: USER_ROLES.ADMIN
          };

          bcrypt
            .genSalt(10)
            .then(salt => bcrypt.hash(keys.superAdminPassword, salt))
            .then(hash =>
              new User({
                ...values,
                password: hash
              }).save())
            .then(() => console.log('super admin was successfully created.'));
        }
      })
      .catch(err => console.error(err));
  },
  createUsers: () => {
    const users = usernames.map(username => new User({
      username,
      password: username,
      email: `${username}@gmail.com`,
      role: 'user'
    }));

    Promise.all(
      users.map(u => u.save())
    ).then(() => console.log('users were created.'));
  }
};
