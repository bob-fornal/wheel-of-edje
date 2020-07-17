
let win = {};

win.init = () => {};

win.mock = {
    Audio: function(url) {
        this.url = url;
    }
};

if (typeof module !== 'undefined' && module.hasOwnProperty('exports')) {
    module.exports = win;
}
