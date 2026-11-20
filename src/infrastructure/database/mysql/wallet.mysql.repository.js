import { DataTypes } from "sequelize";
import sequelize from "./connection.js";

export const WalletModel = sequelize.define("Wallet", {
    name: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.STRING, allowNull: false }, // ej: "CASH", "BANK", "DEBIT_CARD"
    balance: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
    currency: { type: DataTypes.STRING, allowNull: true }, // ej: "BOB", "USD"
    userId: { type: DataTypes.STRING, allowNull: false }
}, { timestamps: true });

export default class WalletMySQLRepository {
    async save(walletEntity) {
        const wallet = await WalletModel.create({
            name: walletEntity.name,
            type: walletEntity.type,
            balance: walletEntity.balance,
            currency: walletEntity.currency,
            userId: walletEntity.userId
        });
        return wallet.toJSON();
    }

    async findByUserId(userId) {
        const wallets = await WalletModel.findAll({
            where: { userId }
        });
        return wallets.map(w => w.toJSON());
    }

    async findById(id) {
        const wallet = await WalletModel.findByPk(id);
        return wallet ? wallet.toJSON() : null;
    }

    async delete(id) {
        const wallet = await WalletModel.findByPk(id);
        if (!wallet) return null;
        await wallet.destroy();
        return true;
    }
}