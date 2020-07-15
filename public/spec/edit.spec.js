
const editing = require('../js/edit.js');

describe('editing', () => {
    it('structure exists', () => {
        expect(editing).toBeDefined();
        expect(editing.setHref).toEqual(jasmine.any(Function));
        expect(editing.editPanels).toEqual(jasmine.any(Function));
        expect(editing.editGroupMode).toEqual(jasmine.any(Function));
    });

    it('editPanels passes url with type=panels', () => {
        let response = null;
        spyOn(editing, 'setHref').and.callFake((url) => {
            response = url;
        });

        editing.editPanels();
        expect(response).toEqual('edit.html?type=panels');
    });

    it('editGroupMode passes url with type=group', () => {
        let response = null;
        spyOn(editing, 'setHref').and.callFake((url) => {
            response = url;
        });

        editing.editGroupMode();
        expect(response).toEqual('edit.html?type=group');
    });
});