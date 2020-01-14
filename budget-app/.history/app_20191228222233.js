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

})();

var controller = (function(budgetCtrl, uiCtrl){

//    var z = budgetCtrl.publicTest(5);
   
//    return {
//        anotherPublicFunction: function(){
//            console.log(z);
//        }
//    }

    var ctrlAddItem = function(){

    };


    document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);


    document.addEventListener('keypress', function(event){
        if(event.keyCode === 13 || event.which === 13){
            ctrlAddItem();
        }
    });

})(budgetController, UiController);