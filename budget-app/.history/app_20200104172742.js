var budgetController = (function(){

    // var x = 23;
    // var add = function(a){
    //     return x + a;
    // }

    // return{
    //     publicTest: function(b) {
    //         return add(b);
    //     }
    // }
})();

var UiController = (function(){

    var domStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'
    };

    return {
        getInput: function(){
            return{
                type: document.querySelector(domStrings.inputType).value,
                description: document.querySelector(domStrings.inputDescription).value,
                value: document.querySelector(domStrings.inputValue).value
            };

        },
        getDomStrings: function(){
            return domStrings;
        }

    }


})();

var controller = (function(budgetCtrl, uiCtrl){

    var dom = uiCtrl.getDomStrings();

    var ctrlAddItem = function(){
        var input = uiCtrl.getInput();

        console.log(input);
    };


    document.querySelector(dom.inputBtn).addEventListener('click', ctrlAddItem);


    document.addEventListener('keypress', function(event){
        if(event.keyCode === 13 || event.which === 13){
            ctrlAddItem();
        }
    });

})(budgetController, UiController);