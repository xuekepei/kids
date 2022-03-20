const kidsBaseUrl = import.meta.env.VITE_API_BASE_URL+'/kids'
const dicBaseUrl = import.meta.env.VITE_API_BASE_URL+'/dic'

export default function (api) {
    return {
        letters() {
            return api.get(kidsBaseUrl + "/letters")
        },
        search(word) {
            return api.get(dicBaseUrl + "/search?word=" + word);
        },
        letterWords(letter) {
            return api.get(kidsBaseUrl + "/letters/" + letter + "/words")
        },
        allWords() {
            return api.get(kidsBaseUrl + "/words")
        },
        add(letter, data) {
            return api.post(kidsBaseUrl + "/letters/" + letter + "/words", data)
        }
    }
}