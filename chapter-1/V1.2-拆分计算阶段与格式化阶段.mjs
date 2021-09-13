import {plays, invoice} from './data.mjs'

function statement(invoice, plays) {
    return renderPlainText(createStatementData(invoice, plays));

    function createStatementData(invoice, plays) {
        const statementData = {};
        statementData.customer = invoice.customer;
        //返回一个新数组，不会改变原始数组。同时新数组中的元素为原始数组元素调用函数处理后的值
        statementData.performances = invoice.performances.map(enrichPerformance);
        statementData.totalAmount = totalAmount(statementData);
        statementData.totalVolumeCredits = totalVolumeCredits(statementData);
        return statementData;
    }

    function enrichPerformance(aPerformance) {
        const result = Object.assign({}, aPerformance);
        result.play = playFor(result);
        result.amount = amountFor(result);
        result.volumeCredits = volumeCreditsFor(result);
        return result;
    }

    /**
     * 让renderPlainText只操作通过data参数传进来的数据
     * @param data
     * @param plays
     * @returns {string}
     */
    function renderPlainText(data) {
        let result = `Statement for ${data.customer}\n`;
        for (let perf of data.performances) {
            //print line for this order
            result += `  ${perf.play.name}: ${usd(perf.amount)} (${perf.audience} seats)\n`;
        }
        result += `Amount owed is ${usd(data.totalAmount)}\n`;
        result += `You earned ${data.totalVolumeCredits} credits\n`;
        return result;
    }

    /**
     * 5.拆分循环 移除观众量积分总和
     * @returns {number}
     */
    function totalVolumeCredits(data) {
        /*let result = 0;
        for (let perf of data.performances) {
            result += perf.volumeCredits;
        }
        return result;*/

        //以管道取代循环
        return data.performances
            .reduce((total, p) => total + p.volumeCredits, 0);
    }

    function totalAmount(data) {
        /*let result = 0;
        for (let perf of data.performances) {
            result += perf.amount;
        }
        return result;*/

        //以管道取代循环
        return data.performances
            .reduce((total, p) => total + p.amount, 0)
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
        }).format(aNumber / 100);
    }


    /**
     * 1.提炼函数
     * @param aPerformance
     * @returns {number}
     */
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
        if ("comedy" == aPerformance.play.type) result += Math.floor(aPerformance.audience / 5);
        return result;
    }
}


console.log(statement(invoice, plays))