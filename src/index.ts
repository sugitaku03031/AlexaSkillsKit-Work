import express from 'express';
import { ExpressAdapter } from 'ask-sdk-express-adapter';
import {
    HandlerInput,
    RequestHandler,
} from 'ask-sdk-core';
import { Response } from 'ask-sdk-model';
const Alexa = require('ask-sdk-core');
const app = express();

/**
 * 実行ログにアクセスログを表示する
 */
var morgan = require('morgan');
app.use(morgan('combined'));

/**
 * 一番始めに呼び出さされる
 * Alexa developer consoleで決めた`スキルの呼び出し名`をAlexaに入力されると呼び出される
 */
const LaunchRequestHandler: RequestHandler = {
    canHandle(handlerInput: HandlerInput): boolean {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput: HandlerInput): Response {
        const speakOutput = '起動完了...!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

/**
 * 勉強: 名前を入力するとAlexaが「こんにちは、<入力した名前>さん。」と返してくれる
 * イメージ: Alexaに「<商品名>を追加して」など
 */
const HelloWorldWithNameIntentHandler: RequestHandler = {
    canHandle(handlerInput: HandlerInput): boolean {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'HelloWorldWithNameIntent';
    },
    handle(handlerInput: HandlerInput): Response {
        const firstNameValue = Alexa.getSlotValue(handlerInput.requestEnvelope, 'firstName');
        const speechText = firstNameValue
            ? `こんにちは、${firstNameValue}さん。`
            : `こんにちは、 すみません、まだお名前を聞いていませんでした。`;

        return handlerInput.responseBuilder
            .speak(speechText)
            .getResponse();
    }
};

/**
 * デフォルト
 * 詳しくは「AMAZON.HelpIntent」
 */
const HelpIntentHandler: RequestHandler = {
    canHandle(handlerInput: HandlerInput): boolean {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput): Response {
        const speakOutput = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

/**
 * デフォルト
 * 詳しくは「AMAZON.StopIntent」
 */
const CancelAndStopIntentHandler: RequestHandler = {
    canHandle(handlerInput: HandlerInput): boolean {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput): Response {
        const speakOutput = 'Goodbye!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

/**
 * 上記で定義したものを読み込む
 */
const skillBuilder = Alexa.SkillBuilders.custom().addRequestHandlers(
    LaunchRequestHandler,
    HelloWorldWithNameIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler);
const skill = skillBuilder.create();
const adapter = new ExpressAdapter(skill, true, true);

/**
 * Express.jsの定義
 */
app.post('/', adapter.getRequestHandlers());
app.listen(3000, () => {
    console.log('Application started');
});