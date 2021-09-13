import {plays, invoice} from './data.mjs'

function statement(invoice, plays) {
    let totalAmount = 0;
    let volumeCredits = 0;
    let result = `Statement for ${invoice.customer}\n`;
    //4.移除format变量
    const format = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2
    }).format;

    for (let perf of invoice.performances) {
        //2.移除play变量
        const play = plays[perf.playID];
        //1.提炼函数
        let thisAmount = 0;
        switch (play.type) {
            case "tragedy":
                thisAmount = 40000;
                if (perf.audience > 30) {
                    thisAmount += 1000 * (perf.audience - 30);
                }
                break;
            case "comedy":
                thisAmount = 30000;
                if (perf.audience > 20) {
                    thisAmount += 10000 + 500 * (perf.audience - 20);
                }
                thisAmount += 300 * perf.audience;
                break;
            default:
                throw new Error(`unknown type: ${play.type}`);
        }

        //3.提炼计算volumeCredits的逻辑
        //5.拆分循环 移除观众量积分总和 移除totalAmount
        //add volume credits
        volumeCredits += Math.max(perf.audience - 30, 0);

        //add extra credit for every ten comedy attendees
        if ("comedy" == play.type) volumeCredits += Math.floor(perf.audience / 5);

        //print line for this order
        result += `  ${play.name}: ${format(thisAmount / 100)} (${perf.audience} seats)\n`;
        totalAmount += thisAmount;
    }
    result += `Amount owed is ${format(totalAmount / 100)}\n`;
    result += `You earned ${volumeCredits} credits\n`;
    return result;
}



console.log(statement(invoice, plays))