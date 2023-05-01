const textArea = document.createElement("textarea");
document.body.append(textArea);

const keysCodes = [192, 49, 50, 51, 52, 53, 54, 55, 56, 57, 48, 189, 187, 81, 87, 69, 82, 84, 89, 85, 73, 79, 80, 219, 221, 220, 65, 83, 68, 70, 71, 72, 74, 75, 76, 186, 222, 90, 88, 67, 86, 66, 78, 77, 188, 190, 191];

const englishSymbols = "`1234567890-=qwertyuiop[]\\asdfghjkl;'zxcvbnm,./";
const englishSymbolsShift = '~!@#$%^&*()_+QWERTYUIOP{}|ASDFGHJKL:"ZXCVBNM<>?';

const russianSymbols = "ё1234567890-=йцукенгшщзхъ\\фывапролджэячсмитьбю.";
const russianSymbolsShift = 'Ё!"№;%:?*()_+ЙЦУКЕНГШЩЗХЪ/ФЫВАПРОЛДЖЭЯЧСМИТЬБЮ,';

let symbolKeys;

localStorage.setItem("language", "english");

function genSymbolKey(symbol){
    const key = document.createElement("div");
    key.textContent = symbol;
    key.classList.add("key", "key_symbol", "size1");
    return key;
}

function genEventKey(text, size){
    const key = document.createElement("div");
    key.textContent = text;
    key.classList.add("key", "key_event", size);
    return key;
}

function genKeyboard(language, shift = false, caps = false){
    let symbols;

    if(language == "english" && shift){
        symbols = englishSymbolsShift;
    }else if(language == "english" && !shift){
        symbols = englishSymbols;
    }else if(language == "russian" && shift){
        symbols = russianSymbolsShift;
    }else if(language == "russian" && !shift){
        symbols = russianSymbols;
    }
    
    const keyboard = document.createElement("div");
    keyboard.className = "keyboard";

    symbols.split("").forEach((el, i) => {
        
        if(!caps){
            keyboard.append(genSymbolKey(el));
        }else{
            keyboard.append(genSymbolKey(el.toUpperCase()));
        }

        if(i == 12){
            keyboard.append(genEventKey("Backspace", "size5"), genEventKey("Tab", "size3"));
        }else if(i == 25){
            const capsLock = genEventKey("CapsLock", "size5");
            
            if(caps){
                capsLock.classList.add("key_active");
            }else{
                capsLock.classList.remove("key_active");
            }
            
            keyboard.append(genEventKey("Del", "size2"), capsLock);
        }else if(i == 36){
            const shiftKey = genEventKey("Shift", "size5");
            
            if(shift){
                shiftKey.classList.add("key_active");
            }else{
                shiftKey.classList.remove("key_active");
            }
            
            keyboard.append(genEventKey("Enter", "size4"), shiftKey);
        }else if(i == 46){
            const leftArr = genEventKey("▲", "size1");
            const rightArr = genEventKey("▼", "size1");
            leftArr.classList.add("rotate-arr", "left-arr"); 
            rightArr.classList.add("rotate-arr", "right-arr"); 

            const shiftKey = genEventKey("Shift", "size4");
            
            if(shift){
                shiftKey.classList.add("key_active");
            }else{
                shiftKey.classList.remove("key_active");
            }

            keyboard.append(
                genEventKey("▲", "size1"), 
                shiftKey, 
                genEventKey("Ctrl", "size1"), 
                genEventKey("Win", "size1"), 
                genEventKey("Alt", "size1"), 
                genEventKey("Space", "size6"), 
                genEventKey("Alt", "size1"),
                leftArr,                
                genEventKey("▼", "size1"), 
                rightArr,
                genEventKey("Ctrl", "size1")
            );
        }    
    });
    keyboard.addEventListener('click', event => {
        keyboardHandler();
    })
    document.body.append(keyboard);
    symbolKeys = document.querySelectorAll(".key_symbol");   
    document.querySelectorAll(".key_event").forEach(el => {
        el.classList.add(el.textContent);
    })
}
genKeyboard(localStorage.getItem("language"));

function keyboardHandler (){
    const keyboard = document.querySelector(".keyboard");    

    let cursorPos = textArea.selectionStart;
    let textBeforeCursor = textArea.value.substring(0, cursorPos);
    let textAfterCursor = textArea.value.substring(cursorPos);
    let element = event.target;
    
    if(element.classList.contains("key") && !element.classList.contains("CapsLock") && !element.classList.contains("Shift")){
        element.classList.add("key_active");
        setTimeout(() => {
            element.classList.remove("key_active");
        }, 100)
    }

    if(element.classList.contains("key_symbol")){
        textArea.value = textBeforeCursor + element.textContent + textAfterCursor;
        textArea.selectionEnd = cursorPos + 1;
    }else if(element.textContent == "Backspace"){
        textBeforeCursor = textArea.value.substring(0, cursorPos - 1);
        textArea.value = textBeforeCursor + textAfterCursor;
        textArea.selectionEnd = cursorPos - 1;
    }else if(element.textContent == "Del"){
        textAfterCursor = textArea.value.substring(cursorPos + 1);
        textArea.value = textBeforeCursor + textAfterCursor;
        textArea.selectionEnd = cursorPos;
    }else if(element.textContent == "Tab"){
        textArea.value = textBeforeCursor + "    " + textAfterCursor;
        textArea.selectionEnd = cursorPos + 1;
    }else if(element.textContent == "Enter"){
        textArea.value = textBeforeCursor + "\n" + textAfterCursor;
        textArea.selectionEnd = cursorPos + 1;
    }else if(element.textContent == "Space"){
        textArea.value = textBeforeCursor + " " + textAfterCursor;
        textArea.selectionEnd = cursorPos + 1;
    }else if(element.textContent == "CapsLock"){
        
        if(element.classList.contains("key_active")){
            keyboard.remove();
            genKeyboard(localStorage.getItem("language"), false, false);
        }else{
            keyboard.remove();
            genKeyboard(localStorage.getItem("language"), false, true);
        }
    
    }else if(element.textContent == "Shift"){
        if(element.classList.contains("key_active")){
            keyboard.remove();
            genKeyboard(localStorage.getItem("language"), false);
        }else{
            keyboard.remove();
            genKeyboard(localStorage.getItem("language"), true);
        }
    }else if(element.classList.contains("left-arr")){
        textArea.selectionEnd = cursorPos - 1;
    }else if(element.classList.contains("right-arr")){
        textArea.selectionStart = cursorPos + 1;
    }
}




window.addEventListener('keydown', event => {
    if(keysCodes.includes(event.keyCode)){
        i = keysCodes.indexOf(event.keyCode);
        symbolKeys[i].classList.add("key_active");
    }else{
        if(event.key == "Backspace"){
            document.querySelector(".Backspace").classList.add("key_active");
        }else if(event.key == "Enter"){
            document.querySelector(".Enter").classList.add("key_active");
        }else if(event.key == "Delete"){
            document.querySelector(".Del").classList.add("key_active");
        }else if(event.key == "Shift"){
            const keyboard = document.querySelector(".keyboard");  
            let element = document.querySelectorAll(".Shift")[0];

            if(element.classList.contains("key_active")){
                keyboard.remove();
                genKeyboard(localStorage.getItem("language"), false);
            }else{
                keyboard.remove();
                genKeyboard(localStorage.getItem("language"), true);
            }
        
        }else if(event.key == "Tab"){
            document.querySelector(".Tab").classList.add("key_active");
        }else if(event.key == "CapsLock"){
            const keyboard = document.querySelector(".keyboard");  
            let element = document.querySelector(".CapsLock");
            if(element.classList.contains("key_active")){
                keyboard.remove();
                genKeyboard(localStorage.getItem("language"), false, false);
            }else{
                keyboard.remove();
                genKeyboard(localStorage.getItem("language"), false, true);
            }
        }else if(event.key == "Alt"){
            document.querySelectorAll(".Alt")[0].classList.add("key_active");
            document.querySelectorAll(".Alt")[1].classList.add("key_active");
            if(document.querySelector(".Ctrl").classList.contains("key_active")){
                const keyboard = document.querySelector(".keyboard");
                if(localStorage.language == "english"){
                    localStorage.setItem("language","russian");
                }else{
                    localStorage.setItem("language","english");
                }
                keyboard.remove();
                genKeyboard(localStorage.getItem("language"));
            }
        }else if(event.key == "Control"){
            document.querySelectorAll(".Ctrl")[0].classList.add("key_active");
            document.querySelectorAll(".Ctrl")[1].classList.add("key_active");
        }else if(event.key == " "){
            document.querySelector(".Space").classList.add("key_active");
        }else if(event.key == "Meta"){
            document.querySelector(".Win").classList.add("key_active");
        }else if(event.key == "ArrowLeft"){
            document.querySelector(".left-arr").classList.add("key_active");
        }else if(event.key == "ArrowRight"){
            document.querySelector(".right-arr").classList.add("key_active");
        }else if(event.key == "ArrowUp"){
            document.querySelector(".▲").classList.add("key_active");
        }else if(event.key == "ArrowDown"){
            document.querySelector(".▼").classList.add("key_active");
        }
    }
});

window.addEventListener('keyup', event => {
    if(keysCodes.includes(event.keyCode)){
        i = keysCodes.indexOf(event.keyCode);
        symbolKeys[i].classList.remove("key_active");
    }else{
        if(event.key == "Backspace"){
            document.querySelector(".Backspace").classList.remove("key_active");
        }else if(event.key == "Enter"){
            document.querySelector(".Enter").classList.remove("key_active");
        }else if(event.key == "Delete"){
            document.querySelector(".Del").classList.remove("key_active");
        }else if(event.key == "Tab"){
            document.querySelector(".Tab").classList.remove("key_active");
        }else if(event.key == "Control"){
            document.querySelectorAll(".Ctrl")[0].classList.remove("key_active");
            document.querySelectorAll(".Ctrl")[1].classList.remove("key_active");
        }else if(event.key == " "){
            document.querySelector(".Space").classList.remove("key_active");
        }else if(event.key == "Meta"){
            document.querySelector(".Win").classList.remove("key_active");
        }else if(event.key == "Alt"){
            document.querySelectorAll(".Alt")[0].classList.remove("key_active");
            document.querySelectorAll(".Alt")[1].classList.remove("key_active");
        }else if(event.key == "ArrowLeft"){
            document.querySelector(".left-arr").classList.remove("key_active");
        }else if(event.key == "ArrowRight"){
            document.querySelector(".right-arr").classList.remove("key_active");
        }else if(event.key == "ArrowUp"){
            document.querySelector(".▲").classList.remove("key_active");
        }else if(event.key == "ArrowDown"){
            document.querySelector(".▼").classList.remove("key_active");
        }
    }   
});

const text = document.createElement("p");
text.innerHTML = "Клавиатура создана в операционной системе Windows<br>Для переключения языка комбинация: левыe ctrl + alt";
document.body.prepend(text);