const prefix = "ac3343-";

function getStoredData(key){
    return JSON.parse(localStorage.getItem(prefix + key));
}

function storeData(key, data){
    localStorage.setItem(prefix + key, JSON.stringify(data));
}
function clearStorage(){
    localStorage.clear();
}
export {getStoredData, storeData,clearStorage}