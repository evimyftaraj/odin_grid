const defaultColor = '#333333'
const defaultMode = 'colormode' 
const defaultSize = 16

let currentColor = defaultColor
let currentMode = defaultMode 
let currentSize = defaultSize

function setCurrentColor(newColor) {
    currentColor = newColor
}

function setCurrentMode(newMode) {
    activateButton(newMode) 
    currentMode = newMode
}

function setCurrentSize(newSize) {
    currentSize = newSize
}


const colorPicker = document.getElementById('colorPicker')
const colorBtn = document.getElementById('colormode')
const rainbowBtn = document.getElementById('rainbowmode')
const eraserBtn = document.getElementById('eraser')
const clearBtn = document.getElementById('clear')
const sizeValue = document.getElementById('sliderValue')
const sizeSlider = document.getElementById('slider')
const grid = document.getElementById('gridbox')
const bgColor = document.getElementById('bgPicker')
const shadingBtn = document.getElementById('shading')

colorPicker.oninput = (e) => setCurrentColor(e.target.value)
colorBtn.onclick = () => setCurrentMode('colormode')
rainbowBtn.onclick = () => setCurrentMode('rainbowmode')
eraserBtn.onclick = () => setCurrentMode('eraser')
clearBtn.onclick = () => reloadGrid() 
sizeSlider.onmousemove = (e) => updateSizeValue(e.target.value)
sizeSlider.onchange = (e) => changeSize(e.target.value)
bgColor.oninput = (e) => changeBackground(e.target.value); 
shadingBtn.onclick = () => setCurrentMode('shading')

let mouseDown = false
document.body.onmousedown = () => (mouseDown = true)
document.body.onmouseup = () => (mouseDown = false)

function changeBackground(newColor) {
    const color = bgColor.value;

    const gridElements = document.querySelectorAll('.grid-element');
    gridElements.forEach(element => {
        element.style.backgroundColor = color;
    });

    grid.style.backgroundColor = bgColor;
}

function changeSize(value) {
    setCurrentSize(value)
    updateSizeValue(value)
    reloadGrid()
}

function updateSizeValue(value) {
    sizeValue.innerHTML = `${value} x ${value}`
}

function reloadGrid() {
    clearGrid()
    setupGrid(currentSize)
}

function clearGrid() {
    grid.innerHTML = ''
    bgColor.value = '#ededed'
}

function setupGrid(size) {
    grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`
    grid.style.gridTemplateRows = `repeat(${size}, 1fr)`

    for (let i = 0; i < size * size; i++) {
        const gridElement = document.createElement('div')
        gridElement.classList.add('grid-element')
        gridElement.addEventListener('mouseover', changeColor)
        gridElement.addEventListener('mousedown', changeColor)
        grid.appendChild(gridElement)
    }
}

function shadeColor(color) {
    return {
        r: Math.floor(color.r * 0.9),
        g: Math.floor(color.g * 0.9),
        b: Math.floor(color.b * 0.9)
    };
}

function hexToRgb(hex) {
    // take index starting at 1 and before 3 (i.e., FF) and parse to radix of 16 - convert to int
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);
    return `rgb(${r}, ${g}, ${b})`;
}

function rgbToRgbObj(rgbString) {
    const matches = rgbString.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    // note that (\d+) makes it a captured group, so you can index it using [1], [2]...
    if (matches) {
        return {
            r: parseInt(matches[1]), 
            g: parseInt(matches[2]),
            b: parseInt(matches[3])
        };
    }
    return null;
}

function changeColor(e) {
    if (e.type === 'mouseover' && !mouseDown) return
    if (currentMode === 'rainbowmode') {
        const randomR = Math.floor(Math.random() * 256)
        const randomG = Math.floor(Math.random() * 256)
        const randomB = Math.floor(Math.random() * 256)
        e.target.style.backgroundColor = `rgb(${randomR}, ${randomG}, ${randomB})`
    } else if (currentMode === 'colormode') {
        e.target.style.backgroundColor = currentColor
    } else if (currentMode === 'shading') {
        const bgColorValue = hexToRgb(bgColor.value);
        if ((e.type === 'mousedown' && e.target.style.backgroundColor !== bgColorValue) || (e.type === 'mouseover' && e.target.style.backgroundColor !== bgColorValue)) {
            const currentColorObj = typeof e.target.style.backgroundColor === 'string' ? rgbToRgbObj(e.target.style.backgroundColor) : e.target.style.backgroundColor;
            const shadedColor = shadeColor(currentColorObj);
            e.target.style.backgroundColor = `rgb(${shadedColor.r}, ${shadedColor.g}, ${shadedColor.b})`;
        }        
    } else if (currentMode === 'eraser') {
        e.target.style.backgroundColor = bgColor.value
    }
}


function activateButton(newMode) {
    if (currentMode === 'rainbowmode') {
        rainbowBtn.classList.remove('active')
    } else if (currentMode === 'colormode') {
        colorBtn.classList.remove('active')
    } else if (currentMode === 'shading') {
        shadingBtn.classList.remove('active')
    } else if (currentMode === 'eraser') {
        eraserBtn.classList.remove('active') 
    }
    
    if (newMode === 'rainbowmode') {
        rainbowBtn.classList.add('active')
    } else if (newMode === 'colormode') {
        colorBtn.classList.add('active')
    } else if (newMode === 'shading') {
        shadingBtn.classList.add('active')
    } else if (newMode === 'eraser') {
        eraserBtn.classList.add('active')
    }
}


window.onload = () => {
    setupGrid(defaultSize)
    activateButton(defaultMode)
}