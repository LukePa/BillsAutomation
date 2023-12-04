function throwErrorIfCantParseFloat(inputToParse) {
    const value = Number.parseFloat(inputToParse);
    if (!Number.isNaN(value)) return value;
    throw new TypeError('input which is not a float or string representing a float given');
}

function floatToPriceString (float) {
    if (Number.isNaN(float)) throw new TypeError("float must be a float");
    return `£${float.toFixed(2)}`
}


export class Person {
    constructor(name) {
        this.name = String(name);
        this._from = null;
        this._to = null;
    }

    get fromDate () {this._from} 
    //** verifies value is a date */ 
    set fromDate(value) {
        const dateValue = new Date(value);
        if (Number.isNaN(dateValue.valueOf())) this._from = null;
        else this._from = dateValue;
    }

    get toDate () {this._to}
    //** This verifies value is a date */
    set toDate(value) {
        const dateValue = new Date(value);
        if (Number.isNaN(dateValue.valueOf())) this._to = null;
        else this._to = dateValue;
    }

    _areBothOrNeitherDatesSet() {
        if (this._from && this._to) return true;
        if (this._from || this._go) return false;
        return true;
    }

    _areBothDatesSet() {
        return this._to && this._from;
    }

    _isNeitherDatesSet() {
        return !(this._from && this._to)
    }

    _isFromDateGreaterThanToDate() {
        if (!this._areBothDatesSet()) return false;
        return this._from.valueOf() > this._to.valueOf();
    }

    getNumberOfDaysAway = () => {
        if (this._isNeitherDatesSet()) return 0;
        else if (!this._areBothOrNeitherDatesSet()) return NaN;
        else if (!this._isFromDateGreaterThanToDate()) return NaN;
        else return this._to.getDate() - this._from.getDate() - 1
    }

    get isValid() {
        if (this._areBothDatesSet()) return true;
        if (this._isNeitherDatesSet()) return true;
        return false;
    }
}

export class Bills {
    /**
     * @constructor
     * @param {Array<Person>} people
     * @param {Number} wifiCost
    */
    constructor(people, wifiCost) {
        this.people = people
        this.wifiCost = throwErrorIfCantParseFloat(wifiCost);
        this.utilitiesCost = null;

        // This is 1 indexed month number of last month
        this.month = new Date().getMonth();
    }

    get daysInMonth() {
        if (!Number.isInteger(this.month) 
            || this.month < 1
            || this.month > 12
        ) return NaN;

        const lastOfThisMonth = new Date(new Date().getFullYear(), this.month, 0);
        return lastOfThisMonth.getDate();
    }

    get priceTotal() {
        if (Number.isNaN(this.utilitiesCost)) return NaN;
        return this.utilitiesCost + this.wifiCost;
    }

    getAmountOfDaysPersonPayingFor(person) {
        return this.daysInMonth - person.getNumberOfDaysAway()
    }

    getSplitDenominator() {
        return this.people.reduce((total, person) => total + this.getAmountOfDaysPersonPayingFor(person))
    }

    getIndividualUtilityBillTotal(person) {
        if (Number.isNaN(this.utilitiesCost)) return NaN;
        return this.utilitiesCost * (this.getAmountOfDaysPersonPayingFor(person) / this.getSplitDenominator(person))
    }

    getIndividualTotalCost(person) {
        return (this.wifi_cost / this.people.length) + this.getIndividualUtilityBillTotal(person)
    }

    get isValid() {
        return this.wifiCost && this.utilitiesCost && this.people.every(person => person.isValid)
    }

    getMessage() {
        if (!this.isValid) throw new Error("getMessage called on invalid Bills object")


        let message = "BILLS\n";
        message += `Utilities total: ${floatToPriceString(billsObject.utilitiesCost)}\n`;
        message += `Wifi total: ${floatToPriceString(billsObject.wifiCost)}\n`;
        message += "\n";
        let awayAdded = false;

        this.people.forEach((person) => {
            if (Number.isNan(person.getNumberOfDaysAway())) {
                throw new Error(`${person.name}'s number of days away is NaN`) 
            } else if (person.getNumberOfDaysAway() > 0) {
                message += `${person.name} was away for ${person.getNumberOfDaysAway()} days\n`;
                awayAdded = true;
            }
        });

        if (awayAdded) message += "\n";
        message += "TOTALS TO PAY\n";

        this.people.forEach((person) => {
            message += `${person.name}: ${floatToPriceString(this.getIndividualTotalCost(person))}\n`
        })

        message += "\nPlease send a message when you have paid, thanks!"

        return message;
    }

    async getMessageAndOpenMessenger() {
        try {
            const message = this.getMessage();
            await navigator.clipboard.writeText(message);
            window.open("https://www.messenger.com/t/5397372580384173");
        } catch (e) {
            alert(e.message);
        }
    }
}


export const formatMonth = (month) => {
    const monthStr = month.toString();
    if (monthStr.length === 1) return `0${monthStr}`
    else return monthStr
}