import { Sequelize, DataTypes, Model } from "sequelize";
import { readFileSync, readdirSync } from "node:fs";

let password = "";

try {
    password = readFileSync(`/run/secrets/${process.env.DB_PASSWORD_FILE}`);
    password = password.toString();
} catch (err) {
    console.error(err);
}

console.log(process.env.DB_HOST);
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    password,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
    }
);

class ChatBox extends Model { }

ChatBox.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        idUser: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        title: {
            type: DataTypes.TEXT,
            allowNull: false,
        }
    },
    {
        sequelize,
        modelName: "ChatBox",
        tableName: "chat_box",
    },
);

class ChatMessage extends Model { }

ChatMessage.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        role: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        thinking: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: "ChatMessage",
        tableName: "chat_message",
    },
);

ChatBox.hasMany(ChatMessage, {
    as: "messages",
    onDelete: "CASCADE",
});

ChatMessage.belongsTo(ChatBox, {
    foreignKey: "ChatBoxId",
    as: "chatBox",
});

sequelize.sync();
export { ChatBox, ChatMessage };