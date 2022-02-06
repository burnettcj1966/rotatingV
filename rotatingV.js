"use strict";

var canvas;
var gl;

var theta = 0.0;
var thetaLoc;

var colorChange;

var swap = 1;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = canvas.getContext('webgl2');
    if (!gl) alert( "WebGL 2.0 isn't available" );


    //
    //  Configure WebGL
    //
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    //  Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    var vertices = [
        vec2(.5,.3),
        vec2(0, -1),
        vec2(-.5, .3),
    ];


    // Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    // Associate out shader variables with our data bufferData

    var positionLoc = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    thetaLoc = gl.getUniformLocation(program, "uTheta");

    colorChange = gl.getUniformLocation(program, "color");


    render();
};


function render() {
    //set timeout to 1 FPS
    var slider = document.getElementById("myRange"); //user specified FPS
    var FPS = slider.value;
    setTimeout(function() {
        requestAnimationFrame(render);
        gl.clear(gl.COLOR_BUFFER_BIT);

        theta += (2*Math.PI) / ((60)*(FPS)); 
        gl.uniform1f(thetaLoc, theta);

        //color swap
        if (swap == 0) 
        {   
            gl.uniform4f(colorChange, 0.0, 0.0, 1.0, 1.0);
            swap = 1;
        }
        else {
            gl.uniform4f(colorChange, 1.0, 0.5, 0.0, 1.0);
            swap = 0;
        }
        
        gl.drawArrays(gl.LINE_STRIP, 0, 3);
    }, (1000/FPS));
}