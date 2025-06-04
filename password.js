const inputSlider=document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const upperCaseCheck = document.querySelector("#uppercase");
const lowerCaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsChecks = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generator = document.querySelector(".generate");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols ='~`!@#$%^&*()_-+={}[]|\:;"<>,.?';


//password is not generated initially it is empty
let password="";
//initial password length is 10
let passwordLength=10;
//checkbox first tick
let checkCount=0;
//set strength circle to gray
setIndicator("#ccc");
//------------------------------------------------------------------

handleSlider();
//function1-> handling slider :- Setting the length of password
function handleSlider()
{
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;

    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength-min)*100/(max-min)) + "% 100%";
}

//function2-> setIndicator function this sets the color as per the strength of password
function setIndicator(color)
{
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;  
}

//function3->getRandomInteger integer from min->max
function getRndInteger(min,max)
{
    //with Math.random() you will get answer in between 0 to 1 
    //So you added -> (max-min) this will give from 0 to (max-min)
    //possibility is we will get floating point so we rounded off with Math.floor()
    //Now range is from 0 -->(max-min) we want from min -->(max-min)
    return Math.floor(Math.random()*(max-min)) + min;  
}

//function4-> creating a random no.
function generateRandomNumber()
{
    return getRndInteger(0,9);
}

//function5-> generating a lowercase letters
function generateLowercase()
{
    return  String.fromCharCode(getRndInteger(97,123));  //String.fromCharCode() this method converts ascii value into characters
}

//function6->generating uppercase letters
function generateUppercase()
{
    return  String.fromCharCode(getRndInteger(65,90));  //String.fromCharCode() this method converts ascii value into characters
}

//function7->generating symbols
function generateSymbols()
{
    const randNum= getRndInteger(0,symbols.length);
    return symbols.charAt(randNum);
}

//function8->calculating strength of password
function calcStrength()
{
    let hasUpper = false;
    let hasLower = false;
    let hasNumbers = false;
    let hasSymbols = false;

    if(upperCaseCheck.checked) hasUpper = true;
    if(lowerCaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNumbers = true;
    if(symbolsChecks.checked) hasSymbols = true;

    if(hasUpper && hasLower && (hasNumbers || hasSymbols) && passwordLength>=8)
        setIndicator("#0f0");
    else if((hasLower || hasUpper) && (hasNumbers || hasSymbols) && passwordLength>=6)
        setIndicator("#ff0");
    else
        setIndicator("#f00");
}

//function9-> copying the password 
async function copyContent()
{
    //navigator.clipboard.writeText this is the method available.
    //with this method i can copy any text onto the clipboard. this method return the promise 
    //promise can be resolve or rejected. so i will show copied text only when promise is resolved
    //with the help of await keyword i will get if the method has been resolved. 

    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText ="copied";
    }
    catch(e)
    {
        copyMsg.innerText="Failed";
    }

    //to make copy wala span visible
    copyMsg.classList.add("active");

    setTimeout(() =>{
        copyMsg.classList.remove("active");
    },2000);
   
}

//function10-> counting the no. of checkbox checked  to generate password accordingly
function handleCheckBoxChange()
{
    checkCount =0;
    allCheckBox.forEach((checkbox) => {
        if(checkbox.checked)
            checkCount++;
    });

    //special condition: if passwordLength is smaller than check box count then make the password length as that of check box count
    if(passwordLength < checkCount)
    {
        passwordLength =checkCount;
        handleSlider();
    }

}

//function11-> shuffle the password for randomization
function shufflePassword(array)
{
    //Fisher Yates Method
    for(let i=array.length-1;i>0;i--)
    {
        const j=Math.floor(Math.random()*(i+1));
        const temp = array[i];
        array[i]=array[j];
        array[j]=temp;
    }
    let str = "";
    array.forEach((element) => (str +=element));
    return str;

}




//---------------------------------------------------------------------


//Adding event listner for checkbox . inorder to check how may checkboxes are checked to generate passord 
allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change',handleCheckBoxChange);
})

//Adding event listner on slider to display the value as that of slider
inputSlider.addEventListener('input',(e) => {
    passwordLength =e.target.value;
    handleSlider();
});

//Adding event listner on copy button so that if the value is present 
copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value)
        copyContent();
});

//adding event listner on generate button
generator.addEventListener('click', () => {
    //none of the checkbox are selected
    if(checkCount==0)
        return;

    if(passwordLength< checkCount){
        passwordLength=checkCount;
        handleSlider();
    }

    //lets start the journey to find new password
    

    //remove old password
    password="";
    //lets put the stuff mentioned by checkboxes
    // if(upperCaseCheck.checked)
    //     password+=generateUppercase();

    // if(lowerCaseCheck.checked)
    //     password+=generateLowercase();

    // if(numbersCheck.checked)
    //     password+=generateRandomNumber();

    // if(symbolsChecks.checked)
    //     password+=generateSymbols();

    let funArr = [];
    
    if(upperCaseCheck.checked)
        funArr.push(generateUppercase);

    if(lowerCaseCheck.checked)
        funArr.push(generateLowercase);

    if(numbersCheck.checked)
        funArr.push(generateRandomNumber);

    if(symbolsChecks.checked)
        funArr.push(generateSymbols);


    //compulsory addition
    for(let i=0;i<funArr.length;i++)
    {
        password+=funArr[i]();
    }

    //remaining addition
    for(let i=0;i<passwordLength-funArr.length;i++)
    {
        let randIndex = getRndInteger(0,funArr.length);
        password+=funArr[randIndex]();
    }

    //shuffle the password
    password = shufflePassword(Array.from(password));

    //show in UI
    passwordDisplay.value = password;

    //calculate strength
    calcStrength();

});



