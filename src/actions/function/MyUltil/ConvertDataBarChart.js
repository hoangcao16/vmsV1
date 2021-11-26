import { isEmpty } from "lodash";

export default function convertDataBarChart(arrObj) {
    if (!isEmpty(arrObj)) {
        let arr = [];
        arrObj.map((d) => {
            let object = {};
            let temp = Object.values(d);
            if (!arr.includes(temp[0])) {
                object.time = temp[0];
                object[temp[1]] = d.totalEvent1;
                arr.push(object);
            } else {
                object[temp[1]] = d.totalEvent1;
            }
        });

        const result = arr.reduce((acc, o) => {
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
        return result
    }
}
