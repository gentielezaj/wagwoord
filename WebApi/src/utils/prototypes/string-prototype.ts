declare interface String {
    isNullOrEmpty(): boolean;
    equals(value: string, ignoreCaseSensitive?: boolean): boolean
}

String.prototype.isNullOrEmpty = function (this: string): boolean {
    return typeof this == 'string' && !this || this.trim() == '';
};

String.prototype.equals = function (this: string, value: string, ignoreCaseSensitive?: boolean): boolean {
    if (this == value) return true;
    if (this && value && ignoreCaseSensitive) return this.toLowerCase() == value.toLowerCase();
    return false
};