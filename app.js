/*********************************************************************************
//using models as software architecture. Makes the code modular and creates public & private access to specific data.
// Simple in breaking down the major componenets of an app into its logical factors [UI, data storage, controller events]
// Module pattern uses the closure and IIFE to have data privacy

var budgetController =(function () {

    var x = 23;                     /// this variable is private to the budgetController fn only

    var add = function (a) {       /// this variable is private to the budgetController fn only
        return x + a;
    }

    return {                    // returning an object to be public or 'exposed'
        publicTest: function (b) {
            return add (b);    //  we call this fn that uses the inputs from the private fn above
                                    // the end of the fn will only return this object 'publicTest' [execution order of 'returns']
        }
    }

})();                       /// Wrapped in paranthesis means that its a IIFE and has private data access


//Really simple. Basically bc of the paranthesis that makes it an IIFE it also means that fn within are enclosed or have closure.
//so the fn will run all the logic in the fn [declare a variable & fn]. However bc in the execution chain the last return valuue is what can be used, it
//essentiaally hides all previous data. In this case 'publicTest' is logged to console which is what we want. really just paranthesis and last exposed thing


var UIcontroller = (function () {

        // some code for later

})();



//By creating stanalone fns thhat are IIFE it makes all the componenets as independent strong parts of the design
//this also means that they are modular and can be manipulted without breaking other things
//That means tho that they dont interact unless we connect them


var controller = (function (budgtCTRL, UIcNTRL) {             // this is going to be our connective fn [budgetController & UIcontroller]
                                                            // bc this fn is takign arguments means we need to pass arguments when we call fn
    var z = budgtCTRL.publicTest(5);                        // important since we are taking 'inputs' for this fn. whereas before they are stanalone

    return {
        anotherPublic: function (z) {
            console.log(z);
        }

    }

    Essentuay tho the program needs to do the following
    // Breakdown of logic steps to achieve :

                // 1. Get the fields input data
                // 2. Add the item to the Budget CONTROLLER
                // 3. Add the itemt to the UI CONTROLLER
                // 4. Calculate the Budget
                // 5. Display the Budget to UI

})(budgetController , UIcontroller);                 // tho we call the stanalone fn above, we can change the inout arguments in the fn. This allows
                                                    // for modular changes withiout again breaking the code base ['seperation of conerns']

********************************************************************************/

// BUDGET CONTROLLER!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
var budgetController =(function () {


    // fn constructor for handling data input 'expense'
    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }
    // fn constructor for handling data input 'income'
    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    // data object structure to store data types in an organized manner
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    }


    return {
        addItem: function(type, des, val) {
            var newItem, ID;

            //[1 2 3 4 5], next ID = 6
            //[1 2 4 6 8], next ID = 9
            // ID = last ID + 1

            // Create new ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            // Create new item based on 'inc' or 'exp' and label as the 'type' of data input
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }

            // Pushing to data structure above. basically storing the defined items into the data object array. based on the type logic in the 'if' statement.
            data.allItems[type].push(newItem);

            // Display the item
            return newItem;
        },
        testing : function (){                  // testing methods to see the data stored. so that we are doing it right ;)
            console.log(data);
        }
    }

})();


// UI CONTROLLER!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
var UIcontroller = (function () {

    var domStrings = {          // create a ctrl panel to make edits easier w one variable to change. reflected in fn below
        inputType : '.add__type',
        inputDescription : '.add__description',
        inputValue : '.add__value',
        inputAddButton : '.add__btn',
        incomeContainer : '.income__list',   // where we house the list of elements related to income from the inputs
        expenseContainer : '.expenses__list',

    }
        return {
            getInputs: function () {            // logic to pull user input from DOM to be processed in later fns
                return {
                    type: document.querySelector(domStrings.inputType).value,  // remember it has 2 options [income or expense]
                    description: document.querySelector(domStrings.inputDescription).value,
                    value: document.querySelector(domStrings.inputValue).value,
                };
            },

            addListItem: function (obj, type) {
                    var html, newHtml, element;

                // create some html with some placeholder text
                    if (type === 'inc') {               // detemine the type of [income or exp] also had to put the html in a string. Had to be catious of the quotation mark type used [single vs. double]
                    element = domStrings.incomeContainer;    // way to identify the type to map to the correct element on the DOM
                    html ='<div class="item clearfix" id="income-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
                                                // note that the '%' is key in identifying where to replace text in the html. its a mapping marker
                    } else if (type === 'exp') {
                    element = domStrings.expenseContainer;
                    html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
                    }

                // replace the placeholder test with actual data
                    newHtml = html.replace('%id%', obj.id);  // since html is a string we can use string related methods! in this case 'replace' finds text using the '%' as a marker and will replace w what you choose. since we are using a constructor for our input objects makes sense to use the (object that we will pass features in this case new item) fields
                    newHtml = newHtml.replace('%description%', obj.description);
                    newHtml = newHtml.replace('%value%', obj.value);      // note that we have to set 'newHtml' to the updated text bc otherwise we are just changing the html string

                // insert HTML to DOM
                    document.querySelector(element).insertAdjacentHtml('beforeend', newHtml);   // using the 'insertAdjacentHtml' to paste a large portion of text to DOM. In addition must specify where to place it using the methods placement types. we used 'beforeend' bc we want to build down after prior

            },
                                         // note the comma that is outside of the fn, making it a seperate object
            getDomStrings: function (){        // BC the domStrings is private so we need to expose in order to pull to App controller
                return domStrings;
            }
        }

})();


// GLOBAL APP CONTROLLER !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
var controller = (function (budgtCTRL, UIcNTRL) {
    var setUpEventListeners = function () {               // housing all the event listeners since there will be many more

        var DOM = UIcontroller.getDomStrings();             // new scope var that retrievs data from UI var

        //DOM manipulation on action to display data to UI
            document.querySelector(DOM.inputAddButton).addEventListener ('click', cntrlAddItem); // since its calling fn, can set into event listener arguments

            document.addEventListener('keypress', function (event) {            // kkeypress method passes an argument to trigger
                if (event.keyCode === 13) {                     // when the 'enter' key is pressed
                    cntrlAddItem();
                }                             // when any button is clicked. Key is the 'keyCode' number which refernce a key on the board. Just need to assign
            });
    }

    var cntrlAddItem = function () {  // fn will run this code .. 'DRY'prinicpal
    // Breakdown of logic steps to achieve :       !!!!!!!!!!!!!!!!!!!!!!!!!
        var input, newItem;

        // 1. Get the fields input data
            input = UIcontroller.getInputs();
            console.log(input);

        // 2. Add the item to the Budget CONTROLLER
            newItem = budgetController.addItem(input.type, input.description, input.value);
            return newItem;

        // 3. Add the item to the UI CONTROLLER
            UIcontroller.addListItem(newItem, input.type);       // amazing how this 'master' controller is waterfalling each logic made to make the code run. Really important to understand the fn arguments since they determine the type of data being read. Be vigilant and make sure to call the right one

                // 4. Calculate the Budget
                // 5. Display the Budget to UI

    }

    // need to run  a fn immediately when the program starts || common to write 'innit'
    return {
        init: function (){
            console.log('Appllication has started');
            setUpEventListeners();
        }
    };

})(budgetController , UIcontroller);

controller.init();
