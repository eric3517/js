

//// BEGIN SCOPE CLOSURE
/*var LS =*/ (function () {
    var paper;
    var WIDTH = 400;
    var HEIGHT = 400;
    var grammars = [
        { id:"Example1.6",
            value:"Example 1.6 - Quadratic Koch Island",
            x:"F-F-F-F",
            f:"F-F+F+FF-F-F+F",
            phi:90
        },
        { id:"Example1.7B",
            value:"Example 1.7 B - Quadratic Snowflake Curve",
            x:"-F",
            f:"F+F-F-F+F",
            phi:90
        },
        { id:"Example1.9A",
            value:"Example 1.9A",
            x:"F-F-F-F",
            f:"FF-F-F-F-F-F+F",
            phi:90
        },
        { id:"Example1.9B",
            value:"Example 1.9B",
            x:"F-F-F-F",
            f:"FF-F-F-F-FF",
            phi:90
        }
    ];
    var onGrammarSelect = function () {
        var selected = $("#selectGrammar option:selected");
        var val = selected.val();
        var g = { x:"", f:"" };
        var i;
        if (val != 0) {
            for (i = 0; i < grammars.length; i++) {
                if (grammars[i].id === val)
                    g = grammars[i];
            }
            $("#grammarTextX").val(g.x);
            $("#grammarTextF").val(g.f);
            $("#grammarTextPhi").val(g.phi);
        }
        $("#drawingDepth").val(2);
        onRedraw();
    };
    var drawShape = function (txt, phi) {
        var x = 0;
        var y = 0;
        var c;
        var theta = 0.0;
        var i;
        var n = txt.length;
        var dx = 10;
        var maxX = x;
        var minX = x;
        var maxY = y;
        var minY = y;
        var scale;
        var path = "M" + x + " " + y;
        var tmp;
        paper.clear();
        //console.log("drawShape: phi=" + phi + " " + typeof(phi) );
        for (i = 0; i < n; i++) {
            c = txt.charAt(i);
            switch (c) {
                case '+':
                    theta += phi;
                    //console.log( "+: theta = " + phi);
                    break;
                case '-':
                    theta -= phi;
                    //console.log( "-: theta = " + phi);
                    break;
                case 'F':
                    x = x + dx * Math.cos(theta * Math.PI / 180);
                    y = y + dx * Math.sin(theta * Math.PI / 180);
                    //console.log( "f: x = " + x + ", y = " + y);
                    path = path + " L" + x + " " + y;
                    maxX = Math.max(maxX, x);
                    maxY = Math.max(maxY, y);
                    minX = Math.min(minX, x);
                    minY = Math.min(minY, y);
                    break;
            }
        }
        tmp = paper.path(path);
        //console.log( "minX = " + minX + ", minY = " + minY);
        scale = Math.max(maxX - minX, maxY - minY);
        //console.log( "scale= " + scale);
        scale = 0.95 * (WIDTH / scale);
        //console.log( "scale= " + scale);
        tmp.scale(scale, scale, 0, 0);
        tmp.translate(-minX * scale + 5, -minY * scale + 5);
        tmp.show();
    };
    var onRedraw = function () {
        var x = $('#grammarTextX').val();
        var f = $('#grammarTextF').val();
        var n = $('#drawingDepth').val();
        var phi = parseFloat($('#grammarTextPhi').val());
        var txt;
        var i;
        txt = x;
        for (i = 0; i < n; i++) {
            txt = txt.replace(/F/g, f);
        }
        //$('#expandedText').val( txt );
        drawShape(txt, phi);
    };
    var setupPage = function () {
        paper = Raphael("TheCanvas", WIDTH, HEIGHT);
        var circle = paper.circle(50, 40, 10);
        var value = "ITEMVALUE";
        var i, g;
        circle.attr("fill", "#0ff");
        for (i = 0; i < grammars.length; i++) {
            g = grammars[i];
            $('#selectGrammar').append('<option value="' + g.id + '">' + g.value + '</option>');
        }
        $('#drawingDepth').change(onRedraw);
        $('#grammarTextX').change(onRedraw);
        $('#grammarTextF').change(onRedraw);
        $('#grammarTextPhi').change(onRedraw);
        $('#selectGrammar').change(onGrammarSelect);
        onGrammarSelect();
    };
    // *****************************************************
    // page initialization
    $(document).ready(function () {
        setupPage();
    });
//// END SCOPE CLOSURE
})();


