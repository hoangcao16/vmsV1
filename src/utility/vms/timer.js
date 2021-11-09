import moment from "moment";

export function WithoutTime(dateTime) {
    var date = new Date(dateTime.getTime());
    date.setHours(0, 0, 0, 0);
    return date;
}

export function WithoutTimeSecond(dateTime) {
    var date = new Date(dateTime.getTime());
    date.setSeconds(0, 0);
    date.setMinutes(0);
    return date;
}

export function WithoutTimeSecond2(dateTime) {
    var date = new Date(dateTime*1000);
    date.setSeconds(0, 0);
    date.setMinutes(0);
    return date;
}
