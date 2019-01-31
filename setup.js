const bcrypt = require('bcryptjs');

const User = require('./models/User');
const keys = require('./config/keys');
const USER_ROLES = require('./constants/userRoles');

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
              }).save()
            )
            .then(() => console.log('super admin was successfully created.'));
        }
      })
      .catch(err => console.error(err));
  }
};
