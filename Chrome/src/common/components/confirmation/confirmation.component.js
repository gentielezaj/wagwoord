wwapp.component('confirmationDialog', {
    template: `<dialog id="{{vm.dialogId}}">
                    <span class="message">{{vm.message}}</span>
                    <div class="dialog-actions">
                        <input ng-click="vm.response(true)" type="button" class="success dialog-action" value="Yes">
                        <input ng-click="vm.response(false)" type="button" class="error dialog-action" value="No">
                    </div>
                </dialog>`,
    transclude: true,
    controllerAs: 'vm',
    bindings: {
        message: "@",
        dialogId: "@",
        onResponse: "&",
        leaveDialogOpen: '<',
        params: '=?'
    },
    controller: function ($scope) {
        let vm = this;
        vm.dialogId = vm.dialogId || 'confirmation-dialog-' + new Date().getTime();

        vm.response = function (response) {
            if (response) {
                let callBack = {
                    response: response
                };

                if(vm.params) {
                    callBack.params = vm.params;
                }

                vm.onResponse(callBack);
            }
            if (!vm.leaveDialogOpen) document.getElementById(vm.dialogId).open = false;
            params = undefined;
        };
    }
});