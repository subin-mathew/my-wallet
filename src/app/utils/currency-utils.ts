export class CurrencyUtils {

    static toAmountMinor(amount: number, minorUnit: number = 2): number {
        return Math.round(amount * (10 ** minorUnit));
    }

    static fromAmountMinor(amount: number, minorUnit: number = 2): number {
        return Math.round(amount / (10 ** minorUnit));
    }

}