export default function createStatementData(invoice, plays) {
    const result = {};
    result.customer = invoice.customer;
    //返回一个新数组，不会改变原始数组。同时新数组中的元素为原始数组元素调用函数处理后的值
    result.performances = invoice.performances.map(enrichPerformance);
    result.totalAmount = totalAmount(result);
    result.totalVolumeCredits = totalVolumeCredits(result);
    return result;

    function enrichPerformance(aPerformance) {
        const result = Object.assign({}, aPerformance);
        result.play = playFor(result);
        result.amount = amountFor(result);
        result.volumeCredits = volumeCreditsFor(result);
        return result;
    }

    function totalVolumeCredits(data) {
        //以管道取代循环
        return data.performances
            .reduce((total, p) => total + p.volumeCredits, 0);
    }

    function totalAmount(data) {
        //以管道取代循环
        return data.performances
            .reduce((total, p) => total + p.amount, 0)
    }

    function amountFor(aPerformance) {
        let result = 0;
        switch (aPerformance.play.type) {
            case "tragedy":
                result = 40000;
                if (aPerformance.audience > 30) {
                    result += 1000 * (aPerformance.audience - 30);
                }
                break;
            case "comedy":
                result = 30000;
                if (aPerformance.audience > 20) {
                    result += 10000 + 500 * (aPerformance.audience - 20);
                }
                result += 300 * aPerformance.audience;
                break;
            default:
                throw new Error(`unknown type: ${aPerformance.play.type}`);
        }
        return result;
    }

    function playFor(aPerformance) {
        return plays[aPerformance.playID];
    }

    function volumeCreditsFor(aPerformance) {
        let result = 0;
        //add volume credits
        result += Math.max(aPerformance.audience - 30, 0);
        //add extra credit for every ten comedy attendees
        //使用内联变量 内联play变量
        if ("comedy" == aPerformance.play.type) result += Math.floor(aPerformance.audience / 5);
        return result;
    }
}

