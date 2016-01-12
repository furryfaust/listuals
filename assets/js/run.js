var Node = function(value) {
    this.type  = "node";
    this.value = value;    
    this.next  = null;
};

var List = function() {
    this.type  = "list";
    this.head  = null;
    this.len   = 0;
};

List.prototype.attach = function(n) {
    if (this.head == null) {
        this.head = n; 
    } else {
        this.getLast().next = n;
    }
    this.len++;
};

List.prototype.getLast = function() {
    var node = this.head;
    while (node.next != null) {
        node = node.next;
    }
    return node;
};

var Lexer = function(sequence) {
    this.sequence = sequence;
};

Lexer.prototype.itemExpr = new RegExp(/^[a-z0-9]+$/i);

Lexer.prototype.handle = function(list) {
    var listLevel = 0;

    function getCurr() {
        var listNode = list; 
        for (var i = 0; i != listLevel; i++) {
            listNode = listNode.getLast();
        }
        return listNode;
    }

    for (var i = 0; i != this.sequence.length; i++) {

        if (this.sequence[i] == "(") {
            getCurr().attach(new List());
            listLevel++;
        }

        if (this.sequence[i] == ")") {
            listLevel--;
        } 

        if (this.itemExpr.test(this.sequence[i])) {
            var item = this.sequence[i];
            while (this.itemExpr.test(this.sequence[i + 1])) {
                item += this.sequence[i + 1];
                i++;
            } 
            getCurr().attach(new Node(item)); 
        }
    }
};

var offsetY;

window.onload = function() {

    var canvas = document.getElementById("draw");

    var expr   = document.getElementById("expression");
    var submit = document.getElementById("submit");

    submit.onclick = function() {
        var list  = new List();
        var lexer = new Lexer(expr.value);
        lexer.handle(list);
        list = list.head;

        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#000";
        ctx.font = "30px Arial";
        ctx.textAlign = "center";
        offsetY = 50;
        generate(list, ctx, 50, 50);
    }

};

var NODE_WIDTH = 100, NODE_HEIGHT = 50;

function generate(list, canvas, x, y) {
    var node = list.head;
    while (node != null) {
        switch (node.type) {
            case "node":
                canvas.strokeRect(x, y, NODE_WIDTH, NODE_HEIGHT);
                canvas.moveTo(x + 50, y);
                canvas.lineTo(x + 50, y + 50);
                canvas.fillText(node.value, x + 25, y + 35);
                canvas.stroke();

                if (node.next != null) {
                    canvas.moveTo(x + NODE_WIDTH, y + NODE_HEIGHT/2);
                    canvas.lineTo(x + NODE_WIDTH + 50, y + NODE_HEIGHT/2);
                    canvas.stroke();
                } else {
                    canvas.moveTo(x + NODE_WIDTH/2, y + NODE_HEIGHT);
                    canvas.lineTo(x + NODE_WIDTH, y);     
                    canvas.stroke();
                }

                x += 150;
                break;
            case "list":
                canvas.strokeRect(x, y, NODE_WIDTH, NODE_HEIGHT);
                canvas.moveTo(x + 50, y);
                canvas.lineTo(x + 50, y + 50);
                canvas.stroke();

                if (node.next != null) {
                    canvas.moveTo(x + NODE_WIDTH, y + NODE_HEIGHT/2);
                    canvas.lineTo(x + NODE_WIDTH + 50, y + NODE_HEIGHT/2);
                    canvas.stroke();
                } else {
                    canvas.moveTo(x + NODE_WIDTH/2, y + NODE_HEIGHT);
                    canvas.lineTo(x + NODE_WIDTH, y);     
                    canvas.stroke();
                }

                if (node.head != null) {
                    canvas.moveTo(x + 25, y + NODE_HEIGHT);
                    canvas.lineTo(x + 25, offsetY + 100);
                    offsetY += 100;
                    generate(node, canvas, x, offsetY);
                }
                x += 150;
                break;
        }
        node = node.next;
    }
}

