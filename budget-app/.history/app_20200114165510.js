var budgetController = (function(){

    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    }
    Expense.prototype.calcPercentage = function(totalIncome){
        if(totalIncome > 0){
        this.percentage = Math.round((this.value/ totalIncome) * 100);
        }else{
            this.percentage = -1;
        }
    };

    Expense.prototype.getPerecentage = function(){
        return this.percentage;
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

        deleteItem: function(type, id){
            var ids, index;

            ids = data.allItems[type].map(function(current){
                return current.id;
            });

            index = ids.indexOf(id);
            if(index !== -1){
                data.allItems[type].splice(index,1);
            }
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
        calculatePercentage: function(){

            data.allItems.exp.forEach(function(cur){
                cur.calcPercentage(data.totals.inc);
            });

        },
        getPerecentage: function(){
            var allPerc = data.allItems.exp.map(function(cur){
                return cur.getPerecentage();
            });
            return allPerc;

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
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        percentageLabel: '.budget__expenses--percentage',
        expensesLabel: '.budget__expenses--value',
        container: '.container',
        expensesPercentageLabel: '.item__percentage'
    };
    var formatNumber = function(num,type){
        var numSplit, int, dec, type;

        num = Math.abs(num);
        num = num.toFixed(2);
        numSplit = num.split('.');
        int = numSplit[0];
        dec = numSplit[1];

        if(int.length > 3){
            int = int.substr(0, int.length - 3)+ ',' + int.substr(int.length - 3, 3);

        }
        return (type === 'exp' ? '-' : '+') + ' '+ int + '.' + dec;
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
            newHtml = newHtml.replace('%value%',formatNumber(obj.value,type));

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
            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';

            document.querySelector(domStrings.budgetLabel).textContent =formatNumber(obj.budget, type);
            document.querySelector(domStrings.incomeLabel).textContent =formatNumber(obj.totalInc, 'inc');
            document.querySelector(domStrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');

            if(obj.percentage > 0){
                document.querySelector(domStrings.percentageLabel).textContent = obj.percentage + '%';
            }else {
                document.querySelector(domStrings.percentageLabel).textContent = '---';
            }
        },
        deleteListItem: function(selectorId){
            var el = document.getElementById(selectorId);
            el.parentNode.removeChild(el);

        },
        displayPercentages: function(percentages){
            var fields = document.querySelectorAll(domStrings.expensesPercentageLabel);

            var nodeListForEach = function(list, callback){
                for (let i = 0; i < list.length; i++) {
                    callback(list[i], i);
                    
                }
            };

            nodeListForEach(fields, function(current, index){
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                    
                } else {
                    current.textContent = '---';
                }
            });
        }  

    }


})();

var controller = (function(budgetCtrl, uiCtrl){

    
    var setupEventListeners = function() {
        var dom = uiCtrl.getDomStrings();
        document.querySelector(dom.inputBtn).addEventListener('click', ctrlAddItem);
        document.querySelector(dom.container).addEventListener('click', ctrlDeleteItem);

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
        uiCtrl.displayBudget(budget);

    };

    var updatePercentage = function(){

        //calc percentage
        budgetCtrl.calculatePercentage();

        //read percentage from budget controller
        var percentages = budgetCtrl.getPerecentage();
        // update ui
        uiCtrl.displayPercentages(percentages);

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

        // update percentage
        updatePercentage();
        }
       

    };

    var ctrlDeleteItem = function(event){
        var itemID, splitID, id, type;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if(itemID){
            splitID = itemID.split('-');
            type = splitID[0];
            var type2 = type.substr(0,3);
            
            id = parseInt(splitID[1]);
            
            //delete item from data
            budgetCtrl.deleteItem(type2,id);
            //delete item from ui
            uiCtrl.deleteListItem(itemID);
            //update budget
            updateBudget();
            // update percentage
            updatePercentage();
        }

    }

    return {
        init: function(){
            console.log('App has started!');
            uiCtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    }

    

})(budgetController, UiController);

controller.init();
