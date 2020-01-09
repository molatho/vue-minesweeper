const VOCABULARY = require('./grammar.js');

class SentenceGenerator {
    constructor() {
        this.vocabulary = VOCABULARY;
    }
    getRandomSentence() {
        var articles = ['the', 'a'];
        var punctuations = ['.', '!', '?'];
        var noun = this.vocabulary.nouns[parseInt(Math.random() * this.vocabulary.nouns.length)];
        var verb = this.vocabulary.verbs[parseInt(Math.random() * this.vocabulary.verbs.length)];
        var object = this.vocabulary.nouns[parseInt(Math.random() * this.vocabulary.nouns.length)];
        var articleA = articles[parseInt(Math.random() * articles.length)];
        var articleB = articles[parseInt(Math.random() * articles.length)];
        var punctuation = punctuations[parseInt(Math.random() * punctuations.length)];
        if (punctuation == '?')
            return `Did ${articleA} ${noun} ${verb} ${articleB} ${object}${punctuation}`;

        articleA = articleA.charAt(0).toUpperCase() + articleA.substr(1, articleA.length - 1);
        return `${articleA} ${noun} ${verb} ${articleB} ${object}${punctuation}`;
    }
}

module.exports = SentenceGenerator;