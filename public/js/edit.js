
const editing = {
    setHref: (url) => {
        window.location.href = url;
    },

    editPanels: () => {
        editing.setHref('edit.html?type=panels');
    },
    editGroupMode: () => {
        editing.setHref('edit.html?type=group');
    }
};

// For Unit Testing
if (typeof module !== 'undefined' && module.hasOwnProperty('exports')) {
    module.exports = editing;
}