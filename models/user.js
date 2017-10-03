module.exports = function(sequelize, DataTypes) {
    
    var User = sequelize.define("User", {
        username: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: { notEmpty: true}
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notEmpty: true}
        }
      }, {

        timestamps: false
    });
    
    User.associate = function(models) {
    
        User.hasMany(models.Search, {
          onDelete: "cascade"
        });
    };

    return User;
}