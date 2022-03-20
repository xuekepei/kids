const kidsBaseUrl = import.meta.env.VITE_API_BASE_URL+'/kids'
const dicBaseUrl = import.meta.env.VITE_API_BASE_URL+'/dic'
const authBaseUrl = import.meta.env.VITE_API_BASE_URL+'/account'

export default function (api) {
    return {
        login(data) {
            return api.post(authBaseUrl + "/login", data)
        },
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
            return api.post(kidsBaseUrl + "/letters/" + letter + "/words", data, { needAuth: true })
        },
    }
}