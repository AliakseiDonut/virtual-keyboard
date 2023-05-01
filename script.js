const textArea = document.createElement("textarea");
document.body.append(textArea);

const englishSymbols = "`1234567890-=qwertyuiop[]\\asdfghjkl;'zxcvbnm,./";
const englishSymbolsShift = '~!@#$%^&*()_+QWERTYUIOP{}|ASDFGHJKL:"ZXCVBNM<>?';

const russianSymbols = "ё1234567890-=йцукенгшщзхъ\\фывапролджэячсмитьбю.";
const russianSymbolsShift = 'Ё!"№;%:?*()_+ЙЦУКЕНГШЩЗХЪ/ФЫВАПРОЛДЖЭЯЧСМИТЬБЮ,'

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
            leftArr.classList.add("rotate-arr"); 
            rightArr.classList.add("rotate-arr"); 

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
                genEventKey(" ", "size6"), 
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
}
genKeyboard("english");

function keyboardHandler (){
    const keyboard = document.querySelector(".keyboard");    

    let cursorPos = textArea.selectionStart;
    let textBeforeCursor = textArea.value.substring(0, cursorPos);
    let textAfterCursor = textArea.value.substring(cursorPos);
    let element = event.target;
    
    if(element.classList.contains("key_symbol") || element.textContent == " "){
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
    }else if(element.textContent == "CapsLock"){
        
        if(element.classList.contains("key_active")){
            keyboard.remove();
            genKeyboard("english", false, false);
        }else{
            keyboard.remove();
            genKeyboard("english", false, true);
        }
    
    }else if(element.textContent == "Shift"){
        if(element.classList.contains("key_active")){
            keyboard.remove();
            genKeyboard("english", false);
        }else{
            keyboard.remove();
            genKeyboard("english", true);
        }
    }
}