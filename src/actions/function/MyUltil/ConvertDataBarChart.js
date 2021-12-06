import { isEmpty } from "lodash";

export default function convertDataBarChart(arrObj) {
    if (!isEmpty(arrObj)) {
        let arr1 = [];
        arrObj.map((d) => {
            let object = {};
            let temp = Object.values(d);
            if (!arr1.includes(temp[0])) {
                object.time = temp[0];
                object[temp[1]] = d.totalEvent1;
                arr1.push(object);
            } else {
                object[temp[1]] = d.totalEvent1;
            }
        });

        const result1 = arr1.reduce((acc, o) => {
            const queryResult = acc.find((qr) => qr.time == o.time);
            if (queryResult) {
                queryResult[Object.keys(o)[1]] = Object.values(o)[1]
            } else {
                let newQR = {
                    time: o.time,
                    [Object.keys(o)[1]]: Object.values(o)[1]
                };
                acc.push(newQR);
            }
            return acc;
        }, []);

        let arr2 = [];
        arrObj.map((d) => {
            let object = {};
            let temp = Object.values(d);
            if (!arr2.includes(temp[0])) {
                object.time = temp[0];
                object[temp[1]] = d.totalEvent2;
                arr2.push(object);
            } else {
                object[temp[1]] = d.totalEvent2;
            }
        });

        const result2 = arr2.reduce((acc, o) => {
            const queryResult = acc.find((qr) => qr.time == o.time);
            if (queryResult) {
                queryResult[Object.keys(o)[1]] = Object.values(o)[1]
            } else {
                let newQR = {
                    time: o.time,
                    [Object.keys(o)[1]]: Object.values(o)[1]
                };
                acc.push(newQR);
            }
            return acc;
        }, []);

        let object = {};
        if (!isEmpty(arrObj[0].event1)) {
            object[arrObj[0].event1] = result1
        }
        if (!isEmpty(arrObj[0].event2)) {
            object[arrObj[0].event2] = result2 
        }
        return object;
    }
}
