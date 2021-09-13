import createStatementData from "./createStatementData.mjs";
import {plays, invoice} from '../data.mjs'

function statement(invoice, plays) {
    return renderPlainText(createStatementData(invoice, plays));
}

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

function renderHtml(data) {
    //TODO 将data拼接为HTML格式
    return undefined;
}

function htmlStatement(invoice, plays){
    return renderHtml(createStatementData(invoice, plays));
}

function usd(aNumber) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2
    }).format(aNumber / 100);
}

console.log(statement(invoice, plays))