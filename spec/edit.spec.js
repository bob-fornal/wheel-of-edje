
const editing = require('../public/js/edit');

describe('editing', () => {
    it('expects structure to exist', () => {
        expect(editing).toBeDefined();
        expect(editing.setHref).toEqual(jasmine.any(Function));
        expect(editing.editPanels).toEqual(jasmine.any(Function));
        expect(editing.editGroupMode).toEqual(jasmine.any(Function));
    });

    it('expects "editPanels" to pass url with type=panels', () => {
        let response = null;
        spyOn(editing, 'setHref').and.callFake((url) => {
            response = url;
        });

        editing.editPanels();
        expect(response).toEqual('edit.html?type=panels');
    });

    it('expects "editGroupMode" to pass url with type=group', () => {
        let response = null;
        spyOn(editing, 'setHref').and.callFake((url) => {
            response = url;
        });

        editing.editGroupMode();
        expect(response).toEqual('edit.html?type=group');
    });
});