const apiBaseUrl = process.env.VUE_APP_API_BASE_URL

export default function(api) {
    return {
        letter(){
            return api.get(apiBaseUrl + "/letter")
        },
        search(word) {
            return api.get(apiBaseUrl + "/search?word=" + word);
        },
        letterWords(letter) {
            return api.get(apiBaseUrl + "/letter/" + letter + "/words")
        },
        allWords() {
            return api.get(apiBaseUrl + "/words")
        },
        add(letter,data) {
            return api.post(apiBaseUrl + "/letter/" + letter + "/words",data)
        }
        
        
    }
}