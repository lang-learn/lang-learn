const apiKey = "AIzaSyD9OreuZNrNyDAqQBeKgzsDfLPA18IPdDc";
const gTranslate = require('google-translate')(apiKey);
const data = require('../data/phrases');
const langs = require('../data/langs')

const constructorMethod = (app) => {
    app.get("/", (req, res) => {
        res.render('layouts/index');
    });

    app.get("/learn/:tLangCode/:word", (req, res) => {
        let bLangCode = 'en';
        let tLangCode = req.params.tLangCode;
        let phrase = req.params.word;
        gTranslate.translate(phrase, tLangCode, (err, apiRes) => {
            if(err){
                res.sendStatus(500);
                console.error(err);
            }else{
                res.render('layouts/quizzer', {
                    bLangCode: bLangCode,
                    tLangCode: tLangCode,
                    bLang: langs[bLangCode],
                    tLang: langs[tLangCode],
                    mainWord: phrase,
                    langList: langs,
                    translatedWord: apiRes.translatedText
                });
            }
        });
    });
    app.get("/learn/:bLangCode/:tLangCode/:word", (req, res) => {
        let bLangCode = req.params.bLangCode;
        let tLangCode = req.params.tLangCode;
        let phrase = req.params.word;
        gTranslate.translate(phrase, tLangCode, (err, apiRes) => {
            if(err){
                res.sendStatus(500);
                console.error(err);
            }else{
                res.render('layouts/quizzer', {
                    bLangCode: bLangCode,
                    tLangCode: tLangCode,
                    bLang: langs[bLangCode],
                    tLang: langs[tLangCode],
                    mainWord: phrase,
                    langList: langs,
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
    if(!phraseList){
        res.sendStatus(404);
    }
    let randomIndex = Math.floor(Math.random()*phraseList.length);
    let phrase = phraseList[randomIndex];
    res.redirect(`/learn/${tLangCode}/${phrase}`);
});

    app.use("*", (req, res) => {
        res.sendStatus(404);
    });
};

module.exports = constructorMethod;
