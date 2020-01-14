var budgetController = (function(){

    var x = 23;
    var add = function(a){
        return x + a;
    }

    return{
        publicTest: function(b) {
            return add(b);
        }
    }
})();

var UiController = (function(){

})();

var controller = (function(budgetCtrl, uiCtrl){

   var z = budgetCtrl.publicTest(5);
   
   return {
       anotherPublicFunction: function(){
           console.log(z);
       }
   }

})(budgetController, UiController);