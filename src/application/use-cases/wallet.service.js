import WalletEntity from "../../domain/entities/wallet.entity.js";

const ALLOWED_WALLET_TYPES = ["BANK", "EFEC", "TARJETADEBITO"];

export default class WalletService {
    constructor(walletRepository) {
        this.walletRepository = walletRepository;
    }

    async createWallet(data) {
        if (!data.name || !data.type) {
            throw new Error("Name and type are required");
        }
        if (!ALLOWED_WALLET_TYPES.includes(data.type)) {
            throw new Error(
                `Invalid wallet type. Allowed values are: ${ALLOWED_WALLET_TYPES.join(", ")} (BANK=Banco, EFEC=Efectivo, TARJETADEBITO=Tarjeta de débito)`
            );
        }
        if (!data.userId) {
            throw new Error("User ID is required");
        }
        if (data.balance !== undefined && Number(data.balance) < 0) {
            throw new Error("Initial balance cannot be negative");
        }

        const wallet = new WalletEntity(data);
        return await this.walletRepository.save(wallet);
    }

    async getWallets(userId) {
        return await this.walletRepository.findByUserId(userId);
    }

    async deleteWallet(id, userId) {
        const wallet = await this.walletRepository.findById(id);
        if (!wallet) throw new Error("Wallet not found");
        if (String(wallet.userId) !== String(userId)) {
            throw new Error("Unauthorized: You can only delete your own wallets");
        }

        await this.walletRepository.delete(id);
        return { message: "Wallet deleted successfully" };
    }
}