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

    var calculateTotal = function(type){
        var sum = 0;
        data.allItems[type].forEach(function(current){
            sum += current.value;
        });

        data.totals[type] = sum;
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
        },
        budget: 0,
        percentage: -1
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

        calculateBudget: function(){
            calculateTotal('exp');
            calculateTotal('inc');

            // budget = income - expenses

            data.budget = data.totals.inc - data.totals.exp;

            //percentage
            if(data.totals.inc > 0){
                data.percentage = Math.round(data.totals.exp / data.totals.inc * 100);
            }else{
                data.percentage = -1;
            }
        },
        getBudget: function(){
            return{
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
            
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
        expensesContainer: '.expenses__list',
        budgetLabel: 'budget__value',
        incomeLabel: 'budget__income--value',
        percentageLabel: 'budget__expenses--percentage',
        expensesLabel: 'budget__expenses--value'
    };

    return {
        getInput: function(){
            return{
                type: document.querySelector(domStrings.inputType).value,
                description: document.querySelector(domStrings.inputDescription).value,
                value: parseFloat(document.querySelector(domStrings.inputValue).value)
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


        },
        clearFields: function(){
            var fields, arrayFields;

            fields = document.querySelectorAll(domStrings.inputDescription + ', ' + domStrings.inputValue);
            arrayFields = Array.prototype.slice.call(fields);

            arrayFields.forEach(function(current, index, array){
                current.value = "";
            });

            arrayFields[0].focus();
        },
        displayBudget: function(obj){

            document.querySelector(domStrings.budgetLabel).textContent = obj.budget;
            document.querySelector(domStrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(domStrings.percentageLabel).textContent = obj.percentage;
            document.querySelector(domStrings.expensesLabel).textContent = obj.totalExp;
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

    var updateBudget = function(){
        // calculate the budget
       budgetCtrl.calculateBudget();

        //return the budget
        var budget = budgetCtrl.getBudget();
        //display budget on ui
        console.log(budget);
        uiCtrl.displayBudget(budget);

    };

    var ctrlAddItem = function(){
        var input, newItem;

        // get from field data
        input = uiCtrl.getInput();
        
        if(input.description !== "" && !isNaN(input.value) && input.value > 0){

         //add item to budget controller
        newItem = budgetCtrl.addItem(input.type,input.description, input.value);

        //add item to the ui
        uiCtrl.addListItem(newItem, input.type);

        //clear fields
        uiCtrl.clearFields();

        //calculate and update budget
        updateBudget();
        }
       

    };

    return {
        init: function(){
            console.log('App has started!');
            setupEventListeners();
        }
    }

    

})(budgetController, UiController);

controller.init();