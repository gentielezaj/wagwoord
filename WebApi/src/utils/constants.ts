export class Constants {
    public static readonly EncryptionHashKey = "encryptionHash";
    public static get LocalStorageFolder(): string {
        return process.env.LOCAL_STORAGE_FOLDER ?? "appData";
    }
    public static readonly WagwoordId = "wagwoordId";
}