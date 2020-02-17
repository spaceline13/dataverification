const ANNOTATION_ENDPOINT =
    window.location.protocol === 'http:'
        ? 'http://148.251.22.254:8080/nlp-api-1.0/ner/annotate?smart-stopwords=true&vocabulary=fdk_'
        : 'https://148.251.22.254:8080/nlp-api-1.0/ner/annotate?smart-stopwords=true&vocabulary=fdk_';

export const fetchAnnotationTerms = async (term, vocabulary) => {
    const response = await fetch(ANNOTATION_ENDPOINT + vocabulary, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(term),
    });
    const json = await response.json();

    return json;
};

export const fetchAnnotationTermsWithCallback = (term, vocabulary, cb) => {
    fetchAnnotationTerms(term, vocabulary).then(res => {
        if (cb) {
            cb(res);
        }
    });
};
