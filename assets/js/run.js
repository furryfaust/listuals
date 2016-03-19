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

var Parser = function(sequence) {
    this.sequence = sequence;
};

Parser.prototype.itemExpr = /[A-z0-9]/;

Parser.prototype.handle = function(list) {
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

var offsetY, offsetX = 0;

window.onload = function() {

    var canvas = document.querySelector("canvas");

    var expr   = document.getElementById("expression");
    var submit = document.querySelector("button");

    submit.onclick = function() {
        if (expr.value == "") {
            return;
        }

        var list  = new List();
        var parser = new Parser(expr.value);
        parser.handle(list);
        list = list.head;

        var ctx = canvas.getContext("2d");
        canvas.width = canvas.width;
        ctx.fillStyle = "#000";
        ctx.font = "30px Arial";
        ctx.textAlign = "center";
        offsetY = 50, offsetX = 0;
        generate(list, ctx, 50, 50);

        resize(canvas, 150 + offsetX, 100 + offsetY);

        offsetY = 50;
        ctx = canvas.getContext("2d");
        ctx.fillStyle = "#000";
        ctx.font = "30px Arial";
        ctx.textAlign = "center";
        generate(list, ctx, 50, 50);
    }

};

var NODE_WIDTH = 100, NODE_HEIGHT = NODE_WIDTH / 2;

function resize(canvas, width, height) {
    var ratio = (function () {
        var ctx = canvas.getContext("2d"),
        dpr = window.devicePixelRatio || 1,
        bsr = ctx.webkitBackingStorePixelRatio ||
            ctx.mozBackingStorePixelRatio ||
            ctx.msBackingStorePixelRatio ||
            ctx.oBackingStorePixelRatio ||
            ctx.backingStorePixelRatio || 1;
        return dpr / bsr;
    })();

    canvas.width = width * ratio;
    canvas.height = height  * ratio;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    canvas.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
}

function generate(list, canvas, x, y) {
    var node = list.head;
    while (node != null) {
        if (x > offsetX) {
            offsetX = x;
            console.log(offsetX);
        }


        canvas.strokeRect(x, y, NODE_WIDTH, NODE_HEIGHT);
        canvas.moveTo(x + NODE_WIDTH / 2, y);
        canvas.lineTo(x + NODE_WIDTH / 2, y + NODE_WIDTH / 2);
        canvas.stroke();

        if (node.next != null) {
            canvas.moveTo(x + NODE_WIDTH, y + NODE_HEIGHT / 2);
            canvas.lineTo(x + NODE_WIDTH + NODE_WIDTH / 2, y + NODE_HEIGHT / 2);
            canvas.stroke();
        } else {
            canvas.moveTo(x + NODE_WIDTH / 2, y + NODE_HEIGHT);
            canvas.lineTo(x + NODE_WIDTH, y);     
            canvas.stroke();
        }

        switch (node.type) {
            case "node":
                canvas.fillText(node.value, x + NODE_HEIGHT / 2, y + (NODE_HEIGHT * 7 / 10));
                canvas.stroke();
                break;
            case "list":
                if (node.head != null) {
                    canvas.moveTo(x + NODE_HEIGHT / 2, y + NODE_HEIGHT);
                    canvas.lineTo(x + NODE_HEIGHT / 2, offsetY + NODE_WIDTH);
                    offsetY += NODE_WIDTH;
                    generate(node, canvas, x, offsetY);
                }
                break;
        }

        x += (NODE_HEIGHT * 3);
        node = node.next;
    }
}

