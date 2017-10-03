module.exports = function(sequelize, DataTypes) {
    var Search = sequelize.define("Search", {
        state: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: { notEmpty: true}
        },
        start_date: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notEmpty: true}
        },
        end_date: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notEmpty: true}
        }
      }, {

        timestamps: false
    });

    
    Search.associate = function(models) {
    
        Search.belongsTo(models.User, {
            foreignKey: {
            allowNull: false
            }
        });
    };

    return Search;
}