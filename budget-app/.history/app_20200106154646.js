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
            if(data.allItems[type].length > 0){
            ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
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
        },
        testing: function(){
            console.log(data);
        }
    }
   
})();

var UiController = (function(){

    var domStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list'
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
        },
        addListItem: function(obj, type){
            var html, newHtml, element;

            //Create html string with placeholder
            if(type === 'inc'){
                element = domStrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if(type === 'exp'){
                element = domStrings.expensesContainer;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            //replace text with data
            newHtml = html.replace('%id%',obj.id);
            newHtml = newHtml.replace('%description%',obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            //instert html into the DOM
            document.querySelector(element).insertAdjacentHTML("beforeend",newHtml);


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