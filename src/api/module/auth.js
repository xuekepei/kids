const kidsBaseUrl = process.env.VUE_APP_API_BASE_URL +'/kids'
const dicBaseUrl = process.env.VUE_APP_API_BASE_URL +'/dic'
const authBaseUrl = process.env.VUE_APP_API_BASE_URL+'/account'

export default function (api) {
    return {
        login(data) {
            return api.post(authBaseUrl + '/login', data)
        },
        letters() {
            return api.get(kidsBaseUrl + '/letters')
        },
        search(word) {
            return api.get(dicBaseUrl + '/search?word=' + word)
        },
        letterWords(letter) {
            return api.get(kidsBaseUrl + '/letters/' + letter + '/words')
        },
        allWords() {
            return api.get(kidsBaseUrl + '/words')
        },
        add(letter, data) {
            return api.post(kidsBaseUrl + '/letters/' + letter + '/words', data, { needToken: true })
        },
        update(letter, data) {
            return api.patch(kidsBaseUrl + '/letters/' + letter + '/words', data, { needToken: true})
        }
    }
}