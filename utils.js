exports.forEach = function(array, action) {
    for (var i = 0; i < array.length; i++)
        action(array[i]);
};

exports.forIn = function(obj, action) {
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            action(key, obj[key]);
        }
    }
}
