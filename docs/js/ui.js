
export class UI {
    
    constructor() {

        this.scoreElm = document.createElement("div");
        this.scoreElm.className = 'score-holder';
        document.body.appendChild(this.scoreElm);

        

    }

    // messeage
    setScore(score) {
        this.scoreElm.innerHTML = "<span>◆</span> " + score;
    }

    // dialog
    showDialog(message, buttonLabel, buttonClick) {
        this.dialogElm = document.createElement("div");
        this.dialogElm.className = 'dialog-holder';
        document.body.appendChild(this.dialogElm);

        let leftpos = document.body.clientWidth/2 - this.dialogElm.clientWidth/2;
        this.dialogElm.style.left = leftpos + 'px';

        
        let messageElm = document.createElement("p");
        messageElm.className = 'dialog-message';
        messageElm.innerHTML = "" + message + "";
        this.dialogElm.appendChild(messageElm);
        
        
        let button = document.createElement("button");
        button.className = 'dialog-button';
        button.innerText = buttonLabel;
        button.addEventListener('click', buttonClick);
        this.dialogElm.appendChild(button);
        
        this.maskElm = document.createElement("div");
        this.maskElm.className = 'mask';
        document.body.prepend(this.maskElm);
    }


}