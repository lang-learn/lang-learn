const apiKey = "AIzaSyD9OreuZNrNyDAqQBeKgzsDfLPA18IPdDc";
const gTranslate = require('google-translate')(apiKey);
const data = require('../data/phrases');
const langs = require('../data/langs')

let logReq = (r) => {
    let method = r.method;
    let url = r.url;
    //optional printout of requests
    //console.log(` - ${method} - ${url}`);
}

const constructorMethod = (app) => {
    app.get("/", (req, res) => {
        logReq(req);
        res.render('layouts/index');
    });
    app.get("/learn/:tLangCode/:word", (req, res) => {
        logReq(req);
        let bLangCode = 'en';
        let tLangCode = req.params.tLangCode;
        let phrase = req.params.word;
        res.redirect(`/learn/${bLangCode}/${tLangCode}/${phrase}`)
    });
    app.get("/learn/:bLangCode/:tLangCode/:word", (req, res) => {
        logReq(req);
        let bLangCode = req.params.bLangCode;
        let tLangCode = req.params.tLangCode;
        let phrase = req.params.word;
        gTranslate.translate(phrase, bLangCode, tLangCode, (err, apiRes) => {
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
    app.get("/newWord/:bLangCode/:tLangCode", (req, res) => {
        logReq(req);
        let bLangCode = req.params.bLangCode;
        let tLangCode = req.params.tLangCode;
        let phrase = data.allInquiries[Math.floor(Math.random() * data.allInquiries.length)]
        if(bLangCode != 'en'){
            //all source phrases are english, translate to base if not english
            gTranslate.translate(phrase, 'en', bLangCode, (err, apiRes) => {
                if(err){
                    res.sendStatus(500);
                    console.error(err);
                }else{
                    res.redirect(`/learn/${bLangCode}/${tLangCode}/${apiRes.translatedText}`);
                }
            })
        }else{
            res.redirect(`/learn/${bLangCode}/${tLangCode}/${phrase}`);
        }
    })
    app.get("/newWord/:phraseType/:bLangCode/:tLangCode", (req, res) => {
        logReq(req);
        let phraseType = req.params.phraseType;
        let bLangCode = req.params.bLangCode;
        let tLangCode = req.params.tLangCode;
        let phraseList = data[phraseType];
        if(!phraseList){
            res.sendStatus(404);
        }
        let randomIndex = Math.floor(Math.random()*phraseList.length);
        let phrase = phraseList[randomIndex];
        if(bLangCode != 'en'){
            //all source phrases are english, translate to base if not english
            gTranslate.translate(phrase, 'en', bLangCode, (err, apiRes) => {
                if(err){
                    res.sendStatus(500);
                    console.error(err);
                }else{
                    res.redirect(`/learn/${bLangCode}/${tLangCode}/${apiRes.translatedText}`);
                }
            })
        }else{
            res.redirect(`/learn/${bLangCode}/${tLangCode}/${phrase}`);
        }
    });

    app.use("*", (req, res) => {
        logReq(req);
        res.sendStatus(404);
    });
};

module.exports = constructorMethod;
