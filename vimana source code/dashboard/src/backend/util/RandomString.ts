export class RandomString {
    private static _getString(length: number): string {
        return ((Math.random() * Date.now()).toString(36).replace(/[^a-z]+/g, "").toUpperCase()
            + (Math.random() * Date.now()).toString(36).replace(/[^a-z]+/g, "").toUpperCase()).substr(0, length);
    }

    private strings: object = {};

    public getRandomString(save: boolean = true, length: number = 8): string {
        length = length > 36 ? 36 : length;

        let random: string = RandomString._getString(length);

        if (save) {
            let counter: number = 0;

            while (this.strings[random] || counter < 10) {
                random = RandomString._getString(length);
                counter++;
            }

            this.strings[random] = true;
        }

        return random;
    }

    public release(random: string): void {
        if (this.strings[random]) {
            delete this.strings[random];
        }
    }
}
