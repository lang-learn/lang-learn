const apiKey = "AIzaSyD9OreuZNrNyDAqQBeKgzsDfLPA18IPdDc";
const gTranslate = require('google-translate')(apiKey);
const data = require('../data/phrases');
const langs = require('../data/langs')

const constructorMethod = (app) => {
    app.get("/", (req, res) => {
        res.render('layouts/index');
    });

    app.get("/learn/:tLangCode/:word", (req, res) => {
        let tLangCode = req.params.tLangCode;
        let mainWord = req.params.word;
        gTranslate.translate(mainWord, tLangCode, (err, apiRes) => {
            if(err){
                res.sendStatus(500);
                console.error(err);
            }else{
                res.render('layouts/quizzer', {
                    bLang: 'english',
                    tLang: langs[tLangCode],
                    tLangCode: tLangCode,
                    mainWord: mainWord,
                    translatedWord: apiRes.translatedText
                });
            }
        });
    });

    app.get("/newWord/:tLangCode", (req, res) => {
        let tLangCode = req.params.tLangCode;
        let phrase = data.allInquiries[Math.floor(Math.random() * data.allInquiries.length)]
        res.redirect(`/learn/${tLangCode}/${phrase}`);
    })

    app.get("/newWord/:phraseType/:tLangCode", (req, res) => {
    let tLangCode = req.params.tLangCode;
    let phraseType = req.params.phraseType;
    let phraseList = data[phraseType];
    let randomIndex = Math.floor(Math.random()*phraseList.length);
    let phrase = phraseList[randomIndex];


    switch(phraseType) {
        case "greeting":
            phrase = data.greeting[Math.floor(Math.random() * data.greeting.length)]
            break;
        case "directions":
            phrase = data.directions[Math.floor(Math.random() * data.directions.length)]
            break;
        case "emergency":
            phrase = data.emergency[Math.floor(Math.random() * data.emergency.length)]
            break;
        case "atHotel":
            phrase = data.atHotel[Math.floor(Math.random() * data.atHotel.length)]
            break;
        case "atRestaurant":
            phrase = data.atRestaurant[Math.floor(Math.random() * data.atRestaurant.length)]
            break;
        case "atAirport":
            phrase = data.atAirport[Math.floor(Math.random() * data.atAirport.length)]
            break;
        case "transportation":
            phrase = data.transportation[Math.floor(Math.random() * data.transportation.length)]
            break;
        case "sightSeeing":
            phrase = data.sightSeeing[Math.floor(Math.random() * data.sightSeeing.length)]
            break;
        case "shoppingAndMoney":
            phrase = data.shoppingAndMoney[Math.floor(Math.random() * data.shoppingAndMoney.length)]
            break;
    }
    res.redirect(`/learn/${tLangCode}/${phrase}`);
});

    app.use("*", (req, res) => {
        res.sendStatus(404);
    });
};

module.exports = constructorMethod;
