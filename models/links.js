module.exports = (sequelize, DataTypes) => {
    const links = sequelize.define('links', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        link: {
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

    return links;
}