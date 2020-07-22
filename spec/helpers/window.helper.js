
let win = {};

win.init = () => {};

win.mock = {
    returnFn: null,

    location: {
        search: '~~~NONE~~~'
    },
    history: {
        back: () => {}
    },
    Audio: function(url) {
        this.url = url;
    },
    URLSearchParams: function(search) {
        this.search = search;
        return {
            get: () => {
                return win.mock.returnFn();
            }
        };
    }
};

if (typeof module !== 'undefined' && module.hasOwnProperty('exports')) {
    module.exports = win;
}
