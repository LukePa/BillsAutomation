function throwErrorIfCantParseFloat(inputToParse) {
    const value = Number.parseFloat(inputToParse);
    if (!Number.isNaN(value)) return value;
    throw new TypeError('input which is not a float or string representing a float given');
}

function floatToPriceString (float) {
    if (Number.isNaN(float)) throw new TypeError("floatToPriceString input must not be NaN");
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
        return this._to.valueOf() > this._from.valueOf();
    }

    _isOnlyOneDateSet() {
        if (this._from && this._to) return false;
        else if (this._from || this._to) return true;
        return false;
    }

    getNumberOfDaysAway = () => {
        if (this._isNeitherDatesSet()) return 0;
        else if (this._isOnlyOneDateSet()) return NaN;
        else if (!this._isFromDateGreaterThanToDate()) return NaN;
        else return this._to.getDate() - this._from.getDate() + 1;
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
        this._utilitiesCost = null;

        // This is 1 indexed month number of last month
        this._month = new Date().getMonth();
    }

    get utilitiesCost() {
        return this._utilitiesCost;
    }
    set utilitiesCost(value) {
        if (value === null || value === undefined || value === "") this._utilitiesCost = null;
        else if (Number.isNaN(Number.parseFloat(value))) throw new Error("Bills object must be a float or null");
        else this._utilitiesCost = Number.parseFloat(value);
    }

    get month() {return this._month}
    set month(value) {
        if (Number.isNaN(Number.parseInt(value))) return;
        else {
            this._month = Number.parseInt(value);
        }
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
        if (!Number.isNaN(person.getNumberOfDaysAway())) return this.daysInMonth - person.getNumberOfDaysAway();
        else {
            return this.daysInMonth;
        }
    }

    getSplitDenominator() {
        return this.people.reduce((total, person) => total + this.getAmountOfDaysPersonPayingFor(person), 0)
    }

    getIndividualUtilityBillTotal(person) {
        console.log(this.utilitiesCost)
        console.log(this.getAmountOfDaysPersonPayingFor(person))
        console.log(this.getSplitDenominator(person))
        if (Number.isNaN(this.utilitiesCost)) return NaN;
        return this.utilitiesCost * (this.getAmountOfDaysPersonPayingFor(person) / this.getSplitDenominator(person))
    }

    getIndividualTotalCost(person) {
        return (this.wifiCost / this.people.length) + this.getIndividualUtilityBillTotal(person)
    }

    get isValid() {
        return this.wifiCost && this.utilitiesCost && this.people.every(person => person.isValid)
    }

    getMessage() {
        if (!this.isValid) throw new Error("getMessage called on invalid Bills object")


        let message = `Bills for ${getMonthStringFromInt(this.month)}\n`;
        message += `Utilities total: ${floatToPriceString(this.utilitiesCost)}\n`;
        message += `Wifi total: ${floatToPriceString(this.wifiCost)}\n`;
        message += "\n";
        let awayAdded = false;

        this.people.forEach((person) => {
            if (Number.isNaN(person.getNumberOfDaysAway())) {
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

export const getMonthStringFromInt = (monthInt) => {
    switch (monthInt) {
        case 1: return "January";
        case 2: return "February";
        case 3: return "March";
        case 4: return "April";
        case 5: return "May";
        case 6: return "June";
        case 7: return "July";
        case 8: return "August";
        case 9: return "September";
        case 10: return "October";
        case 11: return "November";
        case 12: return "December";
        default:
            throw new Error("Invalid month int given to getMonthStringFromInt")
    }
}