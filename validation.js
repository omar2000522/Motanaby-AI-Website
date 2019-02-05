function validInput(txt) {
    if(txt.length<30) return false;

    for(var i=0; i<txt.length; i++){
        if(!characters.includes(txt.charAt(i))) return false;
    }

    return true;
}