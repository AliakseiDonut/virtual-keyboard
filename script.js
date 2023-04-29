const textArea = document.createElement("textarea");
document.body.append(textArea);

const englishSymbols = "`1234567890-=qwertyuiop[]\\asdfghjkl;'zxcvbnm,./";
const englishSymbolShift = '~!@#$%^&*()_+QWERTYUIOP{}|ASDFGHJKL:"ZXCVBNM<>?';

const russianSymbols = "ё1234567890-=йцукенгшщзхъ\фывапролджэячсмитьбю.";
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

function genKeyboard(){
    const keyboard = document.createElement("div");
    keyboard.className = "keyboard";

    englishSymbols.split("").forEach((el, i) => {
        keyboard.append(genSymbolKey(el));
        if(i == 12){
            keyboard.append(genEventKey("Backspace", "size5"), genEventKey("Tab", "size3"));
        }else if(i == 25){
            keyboard.append(genEventKey("Del", "size2"), genEventKey("CapsLock", "size5"));
        }else if(i == 36){
            keyboard.append(genEventKey("Enter", "size4"), genEventKey("Shift", "size5"));
        }else if(i == 46){
            const leftArr = genEventKey("▲", "size1");
            const rightArr = genEventKey("▼", "size1");
            leftArr.classList.add("rotate-arr"); 
            rightArr.classList.add("rotate-arr"); 

            keyboard.append(
                genEventKey("▲", "size1"), 
                genEventKey("Shift", "size4"), 
                genEventKey("Ctrl", "size1"), 
                genEventKey("Win", "size1"), 
                genEventKey("Alt", "size1"), 
                genEventKey("", "size6"), 
                genEventKey("Alt", "size1"),
                leftArr,                
                genEventKey("▼", "size1"), 
                rightArr,
                genEventKey("Ctrl", "size1")
            );
        }    
    });
    document.body.append(keyboard);
}

genKeyboard();

const keyboard = document.querySelector(".keyboard");

keyboard.addEventListener('click', event => {
    if(event.target.classList.contains("key_symbol")){
        textArea.value += event.target.textContent;
    }
})