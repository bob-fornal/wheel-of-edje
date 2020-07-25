
let wnr = {};

wnr.init = () => {};

wnr.mock = {
  close: () => {}
};

if (typeof module !== 'undefined' && module.hasOwnProperty('exports')) {
    module.exports = wnr;
}
