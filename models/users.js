module.exports = (sequelize, DataTypes) => {
    const users = sequelize.define('users', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
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
        isAdmin: {
            type: DataTypes.BOOLEAN,
            primaryKey: false,
            allowNull: false
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            primaryKey: false,
            allowNull: false
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