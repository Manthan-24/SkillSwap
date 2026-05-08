export function storeToken(token){
    localStorage.setItem("token", token);
}


export function removeToken() {
    localStorage.removeItem("token");
}

export function getToken(){
    const token = localStorage.getItem("token");

    if (!token || token === "null" || token === "undefined") {
        return null;
    }

    return token;
}