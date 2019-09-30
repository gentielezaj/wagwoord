wwapp.controller("DemoController", function ($scope, $compile, $proxy, $password, $notification, $encryption) {
    let vm = this;
    vm.title = "Demo";
    vm.selectmodelinput = '';
    let passwords = ['11111', '222222'];
    var passwordDialog;

    vm.saveSettings = function () {
        console.log(sav());
    };

    function sav() {
        let theresult = '';
        let item = {id: 50};
        let resolve = 'ghfh';
        chrome.storage.local.set(item, () => {
            resolve = item;
        });
        return resolve;
    }

    vm.openpopUp = function() {
        chrome.browserAction.getPopup();
    };

    vm.addbutton = function(event) {
        // let button = document.createElement('button');
        // button.setAttribute('ng-click', 'vm.addbutton($event)');
        // button.classList.add('info');
        // button.innerHTML = 'button 1';
        // event.target.parentNode.appendChild(button);
        // $compile(event.target.parentNode)($scope);
        addSelectToInput();
    };

    function addSelectToInput() {
        passwordDialog = document.getElementById('password-dialog');
        if(passwordDialog) {
            passwordDialog.style.display = '';
            console.log(passwordDialog);
            return;
        }
        let wrapperdiv = document.createElement('span');
        let input = document.getElementById('input-wrapper-input');
        input.parentNode.insertBefore(wrapperdiv, input);
        input.parentNode.insertBefore(wrapperdiv, input);
        wrapperdiv.appendChild(input);
        
        passwordDialog = document.createElement('div');
        passwordDialog.setAttribute('id', 'password-dialog');
        passwordDialog.style.position = 'absolute';
        passwordDialog.style.width = input.offsetWidth - 10 + 'px';
        passwordDialog.style.backgroundColor = 'red';
        passwordDialog.innerHTML = 'gdfsgfsdfgsdf';
        passwordDialog.style.padding = '5px';

        passwordDialog.open = true;
        wrapperdiv.appendChild(passwordDialog);

        window.addEventListener('click', e => {
            if(e.target.id == 'input-wrapper-input' || e.target.id == 'open-opup') 
                console.log('clicked');
            else 
                passwordDialog.style.display = 'none';
        });
    }

    vm.setPassword = async function() {
        //let item = await $proxy.get('passwords', 5);
        await $password.update();
        $notification.success('synched');
    };

    vm.encriptMessage = async function(e, ecript) {
        var s = await $encryption.encrypt('blabla');
        console.log('e ' + s);
        var d = await $encryption.decrypt(s);
        console.log(d);
    };
});