var budgetController = (function(){

    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var allExpenses = [];
    var allIncomes = [];
    var totalExpenses = 0;

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    };


    return {
        addItem: function(type, des, val){

            var newItem, ID;

            // create new id
            if(data.allItems[type].lenght > 0){
            ID = data.allItems[type][data.allItems[type].lenght - 1].id + 1;
            } else {
                ID = 0;
            }
            //create new item based on inc or exp

            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if(type === 'inc'){
                newItem = new Income(ID, des, val);
            }

            //push into data structure
            data.allItems[type].push(newItem);


            //return new element
            return newItem;
        }
    }
   
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

    
    var setupEventListeners = function() {
        var dom = uiCtrl.getDomStrings();
        document.querySelector(dom.inputBtn).addEventListener('click', ctrlAddItem);


    document.addEventListener('keypress', function(event){
        if(event.keyCode === 13 || event.which === 13){
            ctrlAddItem();
        }
    });
    }

    var ctrlAddItem = function(){
        var input, newItem;

        // get from field data
        input = uiCtrl.getInput();

        //add item to budget controller
        newItem = budgetCtrl.addItem(input.type,input.description, input.value);

    };

    return {
        init: function(){
            console.log('App has started!');
            setupEventListeners();
        }
    }

    

})(budgetController, UiController);

controller.init();