import {plays, invoice} from './data.mjs'

function statement(invoice, plays) {
    let result = `Statement for ${invoice.customer}\n`;
    for (let perf of invoice.performances) {
        //print line for this order
        result += `  ${playFor(perf).name}: ${usd(amountFor(perf) / 100)} (${perf.audience} seats)\n`;
    }
    result += `Amount owed is ${usd(totalAmount() / 100)}\n`;
    result += `You earned ${totalVolumeCredits()} credits\n`;
    return result;

    /**
     * 5.拆分循环 移除观众量积分总和
     * @returns {number}
     */
    function totalVolumeCredits() {
        let result = 0;
        for (let perf of invoice.performances) {
            result += volumeCreditsFor(perf);
        }
        return result;
    }

    function totalAmount() {
        let result = 0;
        for (let perf of invoice.performances) {
            result += amountFor(perf);
        }
        return result;
    }

    /**
     * 4.移除format变量
     * @param aNumber
     * @returns {string}
     */
    function usd(aNumber) {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2
        }).format(aNumber);
    }


    /**
     * 1.提炼函数
     * @param aPerformance
     * @returns {number}
     */
    function amountFor(aPerformance) {
        let result = 0;
        switch (playFor(aPerformance).type) {
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
                throw new Error(`unknown type: ${playFor(aPerformance).type}`);
        }
        return result;
    }

    /**
     * 2.移除play变量
     * 以查询取代临时变量
     * @param aPerformance
     * @returns {*}
     */
    function playFor(aPerformance) {
        return plays[aPerformance.playID];
    }

    /**
     * 3.提炼计算volumeCredits的逻辑
     * @param aPerformance
     * @returns {number}
     */
    function volumeCreditsFor(aPerformance) {
        let result = 0;
        //add volume credits
        result += Math.max(aPerformance.audience - 30, 0);
        //add extra credit for every ten comedy attendees
        //使用内联变量 内联play变量
        if ("comedy" == playFor(aPerformance).type) result += Math.floor(aPerformance.audience / 5);
        return result;
    }
}



console.log(statement(invoice, plays))