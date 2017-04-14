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
