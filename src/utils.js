function trim(str){
    var maxLen = 45;
    if(str.length > maxLen){
        return str.substr(0,maxLen-3)+"...";
    }
    return str;
}

function removeTrail(old){
	var index = 0;
	var res = old;
	index = old.indexOf('?');
	if(index == -1){
		index = old.indexOf('#');
	}
	if(index != -1){
		res = old.substring(0, index);
	}
	index = res.indexOf("//");
	res = res.substring(index+2);
	return res;
}
