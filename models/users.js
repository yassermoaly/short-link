module.exports = (sequelize, DataTypes) => {
    const users = sequelize.define('users', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        username: {
            type: DataTypes.STRING,
            primaryKey: false
        },
        password: {
            type: DataTypes.STRING,
            primaryKey: false
        },
        createdAt: {
            type: DataTypes.DATE,
            primaryKey: false
        },
        updatedAt: {
            type: DataTypes.DATE,
            primaryKey: false
        }
        
        
    });

    return users;
}