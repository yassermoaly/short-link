module.exports = (sequelize, DataTypes) => {
    const links = sequelize.define('links', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        link: {
            type: DataTypes.TEXT,
            primaryKey: false
        },
        createdAt: {
            type: DataTypes.DATE,
            primaryKey: false
        },
        updatedAt: {
            type: DataTypes.DATE,
            primaryKey: false
        },
        isVisited: {
            type: DataTypes.BOOLEAN,
            primaryKey: false,
            allowNull: false
        },
        visitedAt: {
            type: DataTypes.DATE,
            primaryKey: false
        }
    });

    return links;
}