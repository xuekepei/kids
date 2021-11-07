const apiBaseUrl = process.env.VUE_APP_API_BASE_URL

export default function(api) {
    return {
        letter(){
            return api.get(apiBaseUrl + "/letter")
        },
        search(word) {
            return api.get(apiBaseUrl + "/search?word=" + word);
        },
        add(letter,data) {
            return api.post(apiBaseUrl + "/letter/" + letter + "/words",data)
        }
        
    }
}