class Person {
    constructor(name) {
        this.name = String(name);
        this._start = null;
        this._end = null;
    }

    get startDate () {this._start} 
    // This verifies value is a date, and end is a date with a higher value than this
    set startDate(value) {
        const dateValue = new Date(value);
        if (Number.isNaN(value.valueOf())) throw new Error("Person start date must be a Date object or Date object constructor argument");
        if (!this._start || !this._end) this._start = dateValue;
        else if (this._end.valueOf() - dateValue.valueOf() > 0) this._start = dateValue;
    }

    get endDate () {this._end}
    // This verifies value is a date, and start is a date with a lower value than this
    set endDate(value) {
        const dateValue = new Date(value);
        if (Number.isNaN(value.valueOf())) throw new Error("Person start date must be a Date object or Date object constructor argument");
        if (!this._start || !this._end) this._end = dateValue;
        else if (dateValue.valueOf() - this._start.valueOf() > 0) this._end = dateValue;
    }

    getDaysAway = () => {
        if (!this._start && !this._end) return 0;
        else if (this._start || this._end) return NaN;
        else return this._end.getDate() - (this._start.getDate() - 1)
    }

    get isValid() {!Number.isNaN(this.getDaysAway())}
}

class Bills {
    get wifiCost() {this._wifiCost}
    set wifiCost(value) {if (!Number.isNaN(Number.parseFloat(value))) this._wifiCost = Number.parseFloat(value)}

    get utilitiesCost() {this._utilitiesCost}
    set utilitiesCost(value) {if (!Number.isNaN(Number.parseFloat(value))) this._utilitiesCost = Number.parseFloat(value)}


    constructor(names, days) {
        if (!Array.isArray(names)) throw new TypeError("Bills must be constructed with an array of names");
        this.people = names.map(name => new Person(name));
        this._wifiCost = null;
        if (Number.isNaN(this.wifi_cost)) throw new TypeError("wifi cost must be a float");
        this._utilitiesCost = null;
        this.days = Number.parseInt(days);
        if (Number.isNaN(this.utilities_cost)) throw new Error("days must be an integer")
    }

    getPayingDays(person) {
        return this.days - person.getDaysAway()
    }

    getSplitDenominator() {
        return this.people.reduce((total, person) => total + this.getPayingDays(person))
    }

    individualBillSplit(person) {
        return priceValue * (this.getPayingDays(person) / this.getSplitDenominator(person))
    }

    getOwed(person) {
        return (this.wifi_cost / this.people.length) + this.individualBillSplit(person)
    }

    get isValid() {
        return this.wifiCost && this.utilitiesCost && this.people.every(person => person.isValid)
    }

    getMessage() {
        if (!this.isValid) throw new Error("getMessage called on invalid Bills object")
        return "";
    }
}

export const floatToPriceString = (float) => {
    return `£${float.toFixed(2)}`
}

export const billsObjectToMessage = (billsObject) => {
    let message = "BILLS\n";
    message += `Utilities total: ${floatToPriceString(billsObject.bills)}\n`;
    message += `Wifi total: ${floatToPriceString(billsObject.wifi)}\n`;
    message += "\n";
    let awayAdded = false;

    ["Luke", "Bea", "Amelia", "Gary"].forEach((name) => {
        if (billsObject[name.toLowerCase()].daysAway > 0) {
            message += `${name} was away for ${billsObject[name.toLowerCase()].daysAway} days\n`
            awayAdded = true;
        }
    })

    if (awayAdded) message += "\n";
    message += "TOTALS TO PAY\n";

    ["Luke", "Bea", "Amelia", "Gary"].forEach((name) => {
        message += `${name}: ${floatToPriceString(billsObject[name.toLowerCase()].owes)}\n`
    })

    message += "\nPlease send a message when you have paid, thanks!"

    return message;
}



export const getDaysInMonth = (dateIndex) => {
    if ([0, 2, 4, 7, 9, 11].includes(dateIndex)) {
        return 31;
    }

    if ([3, 5, 8, 10].includes(dateIndex)) {
        return 30;
    }

    if (dateIndex === 1) {
        // Does not currently support leap years
        return 28;
    }

    throw new Error('Date index is out of range')
}

export const formatMonth = (month) => {
    const monthStr = month.toString();
    if (monthStr.length === 1) return `0${monthStr}`
    else return monthStr
}