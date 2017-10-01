module.exports = function(sequelize, DataTypes) {
    var Race = sequelize.define("Race", {
        race_name: {
          type: DataTypes.STRING(1000),
          allowNull: false,
          validate: { notEmpty: true}
        },
        date: {
          type: DataTypes.STRING(10),
          allowNull: false,
          validate: { notEmpty: true}
        },
        city: {
          type: DataTypes.STRING(255),
          allowNull: false,
          validate: { notEmpty: true}
        },
        state: {
          type: DataTypes.STRING(45),
          allowNull: false,
          validate: { notEmpty: true}
        },

      }, {

        timestamps: false
    });

    return Race;
}