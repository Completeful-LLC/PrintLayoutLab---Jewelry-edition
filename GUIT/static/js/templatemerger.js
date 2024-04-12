
// Array to store the loaded PNGs
const loadedPNGs = [];

const fileInput = document.getElementById('file-input');
const previewArea = document.getElementById('preview-area');
const exportButton = document.getElementById('export-button');

// Add event listeners to the file input and export button
fileInput.addEventListener('change', handleFileInputChange);
exportButton.addEventListener('click', handleExportButtonClick);



// Function to change through formats
document.querySelector("#rings").addEventListener("click", function () {
  const dropdown = document.querySelector("#format-btn");
  dropdown.innerText = "Rings";
});

document.querySelector("#one-name-necklace").addEventListener("click", function () {
  const dropdown = document.querySelector("#format-btn");
  dropdown.innerText = "One Name Necklace";
});

document.querySelector("#two-name-necklace").addEventListener("click", function () {
  const dropdown = document.querySelector("#format-btn");
  dropdown.innerText = "Two Name Necklace";
});

document.querySelector("#three-name-necklace").addEventListener("click", function () {
  const dropdown = document.querySelector("#format-btn");
  dropdown.innerText = "Three Name Necklace";
});

document.querySelector("#four-name-necklace").addEventListener("click", function () {
  const dropdown = document.querySelector("#format-btn");
  dropdown.innerText = "Four Name Necklace";
});

// Handle file input change event
function handleFileInputChange(event) {
  previewArea.innerHTML = '';
  loadedPNGs.length = 0;
  const files = event.target.files;
  let counter = 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    const reader = new FileReader();

    reader.onload = function (e) {
      const img = new Image();

      img.onload = function () {
        loadedPNGs.push(img);
        counter++;
        if (counter === files.length) {
          generatePreview();
        }
      };

      img.src = e.target.result;
      previewArea.appendChild(img);
    };
    reader.readAsDataURL(file);
  }
}

function handleExportButtonClick() {

  // DESK PLATES

  if (document.querySelector("#format-btn").innerText === "Desk Plates") {

    const files = document.getElementById('file-input').files;
    if (files.length > 28) {
      alert('Error: You can only select up to 28 images.');
      return;
    }
    generatePreview();
    setTimeout(() => {

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const canvasWidthInches = 24;
      const canvasHeightinches = 36;
      const dpi72 = 72.01558002 * 5;
      const canvasWidth = canvasWidthInches * dpi72;
      const canvasHeight = canvasHeightinches * dpi72;
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      for (let i = 0; i < loadedPNGs.length; i++) {
        const loadedPNG = loadedPNGs[i];

        const positions = [ // [x, y]
            [1.03, 0.93],   [15.38, 0.93],  [1.03, 3.446],  [15.38, 3.446],
           [1.03, 5.962],  [15.38, 5.962],  [1.03, 8.478],  [15.38, 8.478],
          [1.03, 10.994], [15.38, 10.994],  [1.03, 13.51],  [15.38, 13.51],
          [1.03, 16.026], [15.38, 16.026], [1.03, 18.542], [15.38, 18.542],
          [1.03, 21.058], [15.38, 21.058], [1.03, 23.574], [15.38, 23.574],
           [1.03, 26.09],  [15.38, 26.09], [1.03, 28.606], [15.38, 28.606],
          [1.03, 31.122], [15.38, 31.122], [1.03, 33.638], [15.38, 33.638],
          [1.03, 36.154], [15.38, 36.154]
        ];

        let x, y, width, height;
        if (i < positions.length) {
          x = positions[i][0] * dpi72;
          y = positions[i][1] * dpi72;
          width = 8.08 * dpi72;
          height = 2 * dpi72;
        } else {
          x = i % 2 === 0 ? canvasWidth - (8 * dpi72) : canvasWidth / 24;
          y = Math.floor((i - 1) / 2) * (2 * dpi72) + canvasHeight / 36;
          width = 8.08 * dpi72;
          height = 2 * dpi72;
        }


        if (i < 28) {
          ctx.save();
          ctx.translate(x + width / 2, y + height / 2);
          ctx.rotate(Math.PI);
          ctx.scale(-1, 1);
          ctx.drawImage(loadedPNG, -width / 2, -height / 2, width, height);
          ctx.restore();
        } else {
          ctx.drawImage(loadedPNG, x, y, width, height);
        }
      }
      const dataURL = canvas.toDataURL('image/png', 1);
      const blob = dataURLToBlob(dataURL);
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'desk_plates.png';
      link.click();
    }, 100);
  }


  // FLUTES

  else if (document.querySelector("#format-btn").innerText === "Flutes") {

    const files = document.getElementById('file-input').files;
    if (files.length > 10) {
      alert('Error: You can only select up to 10 images.');
      return;
    }
    generatePreview();
    setTimeout(() => {

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const canvasWidthInches = 18.504;
      const canvasHeightinches = 18.504;
      const dpi72 = 70.05406617 * 10;
      const canvasWidth = canvasWidthInches * dpi72;
      const canvasHeight = canvasHeightinches * dpi72;
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      for (let i = 0; i < loadedPNGs.length; i++) {
        const loadedPNG = loadedPNGs[i];

        const positions = [ // [x, y]
           [2.25, 0.95],  [11.35, 0.95], [2.25, 4.75], [11.35, 4.75],
           [2.25, 8.55],  [11.35, 8.55], [2.25, 12.35], [11.35, 12.35],
          [2.25, 16.15], [11.35, 16.15],
        ];

        let x, y, width, height;
        if (i < positions.length) {
          x = positions[i][0] * dpi72;
          y = positions[i][1] * dpi72;
          width = 4.5 * dpi72;
          height = 1.5 * dpi72;
        } else {
          x = i % 2 === 0 ? canvasWidth - (8 * dpi72) : canvasWidth / 18.504;
          y = Math.floor((i - 1) / 2) * (2 * dpi72) + canvasHeight / 18.504;
          width = 4.5 * dpi72;
          height = 1.5 * dpi72;
        }

        if (i < 10) {
          ctx.save();
          ctx.translate(x + width / 2, y + height / 2);
          ctx.rotate(Math.PI);
          ctx.drawImage(loadedPNG, -width / 2, -height / 2, width, height);
          ctx.restore();
        } else {
          ctx.drawImage(loadedPNG, x, y, width, height);
        }
      }

      const dataURL = canvas.toDataURL('image/png', 1);
      const blob = dataURLToBlob(dataURL);
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'flutes.png';
      link.click();
    }, 100);
  }

  // STANLY TAGS

  else if (document.querySelector("#format-btn").innerText === "Stanly Tags") {

    const files = document.getElementById('file-input').files;
    if (files.length > 44) {
      alert('Error: You can only select up to 44 images.');
      return;
    }
    generatePreview();
    setTimeout(() => {

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const canvasWidthInches = 18.504;
      const canvasHeightinches = 18.504;
      const dpi72 = 70.05406617 * 10;
      const canvasWidth = canvasWidthInches * dpi72;
      const canvasHeight = canvasHeightinches * dpi72;
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      for (let i = 0; i < loadedPNGs.length; i++) {
        const loadedPNG = loadedPNGs[i];

        const positions = [ // [x, y]
            [0.95, 0.41],   [5.6, 0.41],  [10.25, 0.41],  [14.9, 0.41],
            [0.95, 1.71],   [5.6, 1.71],  [10.25, 1.71],  [14.9, 1.71],
            [0.95, 3.01],   [5.6, 3.01],  [10.25, 3.01],  [14.9, 3.01],
            [0.95, 4.31],   [5.6, 4.31],  [10.25, 4.31],  [14.9, 4.31],
            [0.95, 5.61],   [5.6, 5.61],  [10.25, 5.61],  [14.9, 5.61],
            [0.95, 6.91],   [5.6, 6.91],  [10.25, 6.91],  [14.9, 6.91],
            [0.95, 8.21],   [5.6, 8.21],  [10.25, 8.21],  [14.9, 8.21],
           [0.95, 9.51],  [5.6, 9.51], [10.25, 9.51], [14.9, 9.51],
           [0.95, 10.81],  [5.6, 10.81], [10.25, 10.81], [14.9, 10.81],
           [0.95, 12.11],  [5.6, 12.11], [10.25, 12.11], [14.9, 12.11],
           [0.95, 13.41],  [5.6, 13.41], [10.25, 13.41], [14.9, 13.41],
        ];

        let x, y, width, height;
        if (i < positions.length) {
          x = positions[i][0] * dpi72;
          y = positions[i][1] * dpi72;
          width = 2.4 * dpi72;
          height = 1.3 * dpi72;
        } else {
          x = i % 2 === 0 ? canvasWidth - (8 * dpi72) : canvasWidth / 18.504;
          y = Math.floor((i - 1) / 2) * (2 * dpi72) + canvasHeight / 18.504;
          width = 2.4 * dpi72;
          height = 1.3 * dpi72;
        }

        if (i < 44) {
          ctx.save();
          ctx.translate(x + width / 2, y + height / 2);
          ctx.rotate(Math.PI);
          ctx.scale(-1, 1);
          ctx.drawImage(loadedPNG, -width / 2, -height / 2, width, height);
          ctx.restore();
        } else {
          ctx.drawImage(loadedPNG, x, y, width, height);
        }
      }

      const dataURL = canvas.toDataURL('image/png', 1);
      const blob = dataURLToBlob(dataURL);
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'stanly-tags.png';
      link.click();
    }, 100);
  }

  // GOLFBALLS

  else if (document.querySelector("#format-btn").innerText === "Golfballs") {

    const files = document.getElementById('file-input').files;
    if (files.length > 260) {
      alert('Error: You can only select up to 260 images.');
      return;
    }
    generatePreview();
    setTimeout(() => {

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const canvasWidthInches = 24;
      const canvasHeightinches = 36;
      const dpi72 = 72.01558002 * 5;
      const canvasWidth = canvasWidthInches * dpi72;
      const canvasHeight = canvasHeightinches * dpi72;
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      for (let i = 0; i < loadedPNGs.length; i++) {
        const loadedPNG = loadedPNGs[i];


        const positions = [ // [x, y]
           [0.58, 0.88],  [2.40, 0.88],  [4.21, 0.88],  [6.03, 0.88],  [7.84, 0.88],  [9.67, 0.88],  [11.47, 0.88],  [13.29, 0.88],  [15.10, 0.88],  [16.92, 0.88],  [18.73, 0.88],  [20.55, 0.88] , [22.36, 0.88],
           [0.58, 2.66],  [2.40, 2.66],  [4.21, 2.66],  [6.03, 2.66],  [7.84, 2.66],  [9.67, 2.66],  [11.47, 2.66],  [13.29, 2.66],  [15.10, 2.66],  [16.92, 2.66],  [18.73, 2.66],  [20.55, 2.66],  [22.36, 2.66],
           [0.58, 4.43],  [2.40, 4.43],  [4.21, 4.43],  [6.03, 4.43],  [7.84, 4.43],  [9.67, 4.43],  [11.47, 4.43],  [13.29, 4.43],  [15.10, 4.43],  [16.92, 4.43],  [18.73, 4.43],  [20.55, 4.43],  [22.36, 4.43],
           [0.58, 6.21],  [2.40, 6.21],  [4.21, 6.21],  [6.03, 6.21],  [7.84, 6.21],  [9.67, 6.21],  [11.47, 6.21],  [13.29, 6.21],  [15.10, 6.21],  [16.92, 6.21],  [18.73, 6.21],  [20.55, 6.21],  [22.36, 6.21],
           [0.58, 7.98],  [2.40, 7.98],  [4.21, 7.98],  [6.03, 7.98],  [7.84, 7.98],  [9.67, 7.98],  [11.47, 7.98],  [13.29, 7.98],  [15.10, 7.98],  [16.92, 7.98],  [18.73, 7.98],  [20.55, 7.98],  [22.36, 7.98],
           [0.58, 9.76],  [2.40, 9.76],  [4.21, 9.76],  [6.03, 9.76],  [7.84, 9.76],  [9.67, 9.76],  [11.47, 9.76],  [13.29, 9.76],  [15.10, 9.76],  [16.92, 9.76],  [18.73, 9.76],  [20.55, 9.76],  [22.36, 9.76],
           [0.58, 11.53], [2.40, 11.53], [4.21, 11.53], [6.03, 11.53], [7.84, 11.53], [9.67, 11.53], [11.47, 11.53], [13.29, 11.53], [15.10, 11.53], [16.92, 11.53], [18.73, 11.53], [20.55, 11.53], [22.36, 11.53],
           [0.58, 13.31], [2.40, 13.31], [4.21, 13.31], [6.03, 13.31], [7.84, 13.31]  [9.67, 13.31], [11.47, 13.31], [13.29, 13.31], [15.10, 13.31], [16.92, 13.31], [18.73, 13.31], [20.55, 13.31], [22.36, 13.31],
           [0.58, 15.08], [2.40, 15.08], [4.21, 15.08], [6.03, 15.08], [7.84, 15.08], [9.67, 15.08], [11.47, 15.08], [13.29, 15.08], [15.10, 15.08], [16.92, 15.08], [18.73, 15.08], [20.55, 15.08], [22.36, 15.08],
           [0.58, 16.86], [2.40, 16.86], [4.21, 16.86], [6.03, 16.86], [7.84, 16.86], [9.67, 16.86], [11.47, 16.86], [13.29, 16.86], [15.10, 16.86], [16.92, 16.86], [18.73, 16.86], [20.55, 16.86], [22.36, 16.86],
           [0.58, 18.63], [2.40, 18.63], [4.21, 18.63], [6.03, 18.63], [7.84, 18.63], [9.67, 18.63], [11.47, 18.63], [13.29, 18.63], [15.10, 18.63]  [16.92, 18.63], [18.73, 18.63], [20.55, 18.63], [22.36, 18.63],
           [0.58, 20.41], [2.40, 20.41], [4.21, 20.41], [6.03, 20.41], [7.84, 20.41], [9.67, 20.41], [11.47, 20.41], [13.29, 20.41], [15.10, 20.41], [16.92, 20.41], [18.73, 20.41], [20.55, 20.41], [22.36, 20.41],
           [0.58, 22.18], [2.40, 22.18], [4.21, 22.18], [6.03, 22.18], [7.84, 22.18], [9.67, 22.18], [11.47, 22.18], [13.29, 22.18], [15.10, 22.18], [16.92, 22.18], [18.73, 22.18], [20.55, 22.18], [22.36, 22.18],
           [0.58, 23.96], [2.40, 23.96], [4.21, 23.96], [6.03, 23.96], [7.84, 23.96], [9.67, 23.96], [11.47, 23.96], [13.29, 23.96], [15.10, 23.96], [16.92, 23.96], [18.73, 23.96], [20.55, 23.96], [22.36, 23.96],
           [0.58, 25.73], [2.40, 25.73], [4.21, 25.73], [6.03, 25.73], [7.84, 25.73], [9.67, 25.73], [11.47, 25.73], [13.29, 25.73], [15.10, 25.73], [16.92, 25.73]  [18.73, 25.73], [20.55, 25.73], [22.36, 25.73],
           [0.58, 27.51], [2.40, 27.51], [4.21, 27.51], [6.03, 27.51], [7.84, 27.51], [9.67, 27.51], [11.47, 27.51], [13.29, 27.51], [15.10, 27.51], [16.92, 27.51], [18.73, 27.51], [20.55, 27.51], [22.36, 27.51],
           [0.58, 29.28], [2.40, 29.28], [4.21, 29.28], [6.03, 29.28], [7.84, 29.28], [9.67, 29.28], [11.47, 29.28], [13.29, 29.28], [15.10, 29.28], [16.92, 29.28], [18.73, 29.28], [20.55, 29.28], [22.36, 29.28],
           [0.58, 31.06], [2.40, 31.06], [4.21, 31.06], [6.03, 31.06], [7.84, 31.06], [9.67, 31.06], [11.47, 31.06], [13.29, 31.06], [15.10, 31.06], [16.92, 31.06], [18.73, 31.06], [20.55, 31.06], [22.36, 31.06],
           [0.58, 32.83], [2.40, 32.83]  [4.21, 32.83], [6.03, 32.83], [7.84, 32.83], [9.67, 32.83], [11.47, 32.83], [13.29, 32.83], [15.10, 32.83], [16.92, 32.83], [18.73, 32.83], [20.55, 32.83], [22.36, 32.83],
           [0.58, 34.61], [2.40, 34.61], [4.21, 34.61], [6.03, 34.61], [7.84, 34.61], [9.67, 34.61], [11.47, 34.61], [13.29, 34.61], [15.10, 34.61], [16.92, 34.61], [18.73, 34.61], [20.55, 34.61], [22.36, 34.61],
        ];

        let x, y, width, height;
        if (i < positions.length) {
          x = positions[i][0] * dpi72;
          y = positions[i][1] * dpi72;
          width = .94 * dpi72;
          height = .94 * dpi72;
        } else {
          x = i % 2 === 0 ? canvasWidth - (8 * dpi72) : canvasWidth / 24;
          y = Math.floor((i - 1) / 2) * (2 * dpi72) + canvasHeight / 36;
          width = .94 * dpi72;
          height = .94 * dpi72;
        }

        if (i < 260) {
          ctx.drawImage(loadedPNG, x, y, width, height);
        }
      }

      const dataURL = canvas.toDataURL('image/png', 1);
      const blob = dataURLToBlob(dataURL);
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'golfballs.png';
      link.click();
    }, 100);
  }

  // BOOKMARKS

  else if (document.querySelector("#format-btn").innerText === "Bookmarks") {

    const files = document.getElementById('file-input').files;
    if (files.length > 14) {
      alert('Error: You can only select up to 14 images.');
      return;
    }
    generatePreview();
    setTimeout(() => {

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const canvasWidthInches = 18.504;
      const canvasHeightinches = 18.504;
      const dpi72 = 70.05406617 * 10;
      const canvasWidth = canvasWidthInches * dpi72;
      const canvasHeight = canvasHeightinches * dpi72;
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      for (let i = 0; i < loadedPNGs.length; i++) {
        const loadedPNG = loadedPNGs[i];

        const positions = [ // [x, y]
        [1.1, 0.45],  [12.4, 0.45],
        [1.1, 2.98],  [12.4, 2.98],
        [1.1, 5.51],  [12.4, 5.51],
        [1.1, 8.04],  [12.4, 8.04],
        [1.1, 10.57], [12.4, 10.57],
        [1.1, 13.1],  [12.4, 13.1],
        [1.1, 15.63], [12.4, 15.63],
        ];

        let x, y, width, height;
        if (i < positions.length) {
          x = positions[i][0] * dpi72;
          y = positions[i][1] * dpi72;
          width = 5.3 * dpi72;
          height = 2 * dpi72;
        } else {
          x = i % 2 === 0 ? canvasWidth - (8 * dpi72) : canvasWidth / 18.504;
          y = Math.floor((i - 1) / 2) * (2 * dpi72) + canvasHeight / 18.504;
          width = 5.3 * dpi72;
          height = 2 * dpi72;
        }

        if (i < 14) {
          ctx.save();
          ctx.translate(x + width / 2, y + height / 2);
          ctx.rotate(Math.PI);
          ctx.scale(-1, 1);
          ctx.drawImage(loadedPNG, -width / 2, -height / 2, width, height);
          ctx.restore();
        } else {
          ctx.drawImage(loadedPNG, x, y, width, height);
        }
      }
      const dataURL = canvas.toDataURL('image/png', 1);
      const blob = dataURLToBlob(dataURL);
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'bookmarks.png';
      link.click();
    }, 100);
  }

  // MUGS

 else if (document.querySelector("#format-btn").innerText === "Mugs") {

  const files = document.getElementById('file-input').files;
  if (files.length > 30) {
    alert('Error: You can only select up to 30 images.');
    return;
  }
  generatePreview();
  setTimeout(() => {

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const canvasWidthInches = 49.606;
    const canvasHeightinches = 23.425;
    const dpi72 = 70.05406617 * 5;
    const canvasWidth = canvasWidthInches * dpi72;
    const canvasHeight = canvasHeightinches * dpi72;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // set background to white  
    ctx.fillStyle = "white";  
    ctx.fillRect(0, 0, canvas.width, canvas.height); 

    for (let i = 0; i < loadedPNGs.length; i++) {
      const loadedPNG = loadedPNGs[i];

      const positions = [ // [x, y]
      [4.9, 18.752], [13.168, 18.752], [21.436, 18.752], [29.704, 18.752], [37.972, 18.752], [46.24, 18.752],
      [4.9, 14.064], [13.168, 14.064], [21.436, 14.064], [29.704, 14.064], [37.972, 14.064], [46.24, 14.064],
      [4.9, 9.376],  [13.168, 9.376],  [21.436, 9.376],  [29.704, 9.376],  [37.972, 9.376],  [46.24, 9.376],
      [4.9, 4.688],  [13.168, 4.688],  [21.436, 4.688],  [29.704, 4.688],  [37.972, 4.688],  [46.24, 4.688],
      [4.9, 0],      [13.168, 0],      [21.436, 0],      [29.704, 0],      [37.972, 0],      [46.24, 0],
    ];

      let x, y, width, height;
      if (i < positions.length) {
        x = positions[i][0] * dpi72;
        y = positions[i][1] * dpi72;
        width = 3 * dpi72;
        height = 4.688 * dpi72;
      } else {
        x = i % 2 === 0 ? canvasWidth - (8 * dpi72) : canvasWidth / 49.606;
        y = Math.floor((i - 1) / 2) * (2 * dpi72) + canvasHeight / 23.425;
        width = 3 * dpi72;
        height = 4.688 * dpi72;
      }

      if (i < 30) {
        ctx.save();
        ctx.translate(x + width / 2, y + height / 2);
        // ctx.rotate(Math.PI);
        ctx.drawImage(loadedPNG, -width / 2, -height / 2, width, height);
        ctx.restore();
      } else {
        ctx.drawImage(loadedPNG, x, y, width, height);
      }
    }
    canvas.toBlob((blob) => {  
    const link = document.createElement('a');  
    link.href = URL.createObjectURL(blob);  
    link.download = 'mugs.jpg';  
    link.click();  
    }, 'image/jpeg', 1);  
  }, 100);
}

  
  // JEWELRY
  function generateJewelryCanvas(numFilesLimit, fileName) {
    const files = document.getElementById('file-input').files;
    if (files.length > numFilesLimit) {
      alert(`Error: You can only select up to ${numFilesLimit} images.`);
      return;
    }
    generatePreview();
    setTimeout(() => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const canvasWidthInches = 24;
      const dpi72 = 72.01558002 * 5;
      const canvasWidth = canvasWidthInches * dpi72;

      const numRows = Math.ceil(loadedPNGs.length / 2);

      const paddingY = 100;
      const canvasHeight = numRows * (loadedPNGs[0].height + paddingY) + paddingY;
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      for (let i = 0; i < loadedPNGs.length; i++) {
        const loadedPNG = loadedPNGs[i];
        const col = i % 2;
        const row = Math.floor(i / 2);
        const x = col * (canvasWidth / 2);
        const y = row * (loadedPNG.height + paddingY) + paddingY;
        ctx.drawImage(loadedPNG, x, y, loadedPNG.width, loadedPNG.height);
      }
      const dataURL = canvas.toDataURL('image/png', 1);
      const blob = dataURLToBlob(dataURL);

      // Create a download link for the Blob  
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
    }, 100);
  }

  // RINGS

  if (document.querySelector("#format-btn").innerText === "Rings") {
    generateJewelryCanvas(50, 'rings.png');
  }

  // NCK01 

  else if (document.querySelector("#format-btn").innerText === "One Name Necklace") {
    generateJewelryCanvas(50, 'NCK01.png');
  }

  // NCK02 

  else if (document.querySelector("#format-btn").innerText === "Two Name Necklace") {
    generateJewelryCanvas(35, 'NCK02.png');
  }

  // NCK03  

  else if (document.querySelector("#format-btn").innerText === "Three Name Necklace") {
    generateJewelryCanvas(20, 'NCK03.png');
  }

  // NCK04 

  else if (document.querySelector("#format-btn").innerText === "Four Name Necklace") {
    generateJewelryCanvas(20, 'NCK04.png');
  }

  // Planks
  // 6X6

  if (document.querySelector("#format-btn").innerText === "Planks 6X6") {
    const files = document.getElementById('file-input').files;
    if (files.length > 56) {
      alert('Error: You can only select up to 56 images.');
      return;
    }
    generatePreview();
    setTimeout(() => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const canvasWidthInches = 54.37;
      const canvasHeightinches = 48.503;
      const dpi = 300; // 300 DPI for print resolution  
      const canvasWidth = canvasWidthInches * dpi;
      const canvasHeight = canvasHeightinches * dpi;
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      for (let i = 0; i < loadedPNGs.length; i++) {
        const loadedPNG = loadedPNGs[i];

        const positions = [
          [2.18, 0.41], [8.48, 0.41], [14.78, 0.41], [21.08, 0.41],
          [27.38, 0.41], [33.68, 0.41], [39.98, 0.41], [46.28, 0.41],
          [2.18, 6.67], [8.48, 6.67], [14.705, 6.67], [21.08, 6.67],
          [27.38, 6.67], [33.68, 6.67], [39.98, 6.67], [46.28, 6.67],
          [2.18, 12.93], [8.48, 12.93], [14.705, 12.93], [21.08, 12.93],
          [27.38, 12.93], [33.68, 12.93], [39.98, 12.93], [46.28, 12.93],
          [2.18, 19.19], [8.48, 19.19], [14.705, 19.19], [21.08, 19.19],
          [27.38, 19.19], [33.68, 19.19], [39.98, 19.19], [46.28, 19.19],
          [2.18, 25.45], [8.48, 25.45], [14.705, 25.45], [21.08, 25.45],
          [27.38, 25.45], [33.68, 25.45], [39.98, 25.45], [46.28, 25.45],
          [2.18, 31.71], [8.48, 31.71], [14.705, 31.71], [21.08, 31.71],
          [27.38, 31.71], [33.68, 31.71], [39.98, 31.71], [46.28, 31.71],
          [2.18, 37.97], [8.48, 37.97], [14.705, 37.97], [21.08, 37.97],
          [27.38, 37.97], [33.68, 37.97], [39.98, 37.97], [46.28, 37.97],
        ];

        let x, y, width, height;
        if (i < positions.length) {
          x = positions[i][0] * dpi;
          y = positions[i][1] * dpi;
          width = 6.15 * dpi;
          height = 6.15 * dpi;
        } else {
          x = i % 2 === 0 ? canvasWidth - (6.15 * dpi) : canvasWidth / 54.37;
          y = Math.floor((i - 1) / 2) * (6.15 * dpi) + canvasHeight / 48.503;
          width = 6.15 * dpi;
          height = 6.15 * dpi;
        }

        if (i < 56) {
          ctx.drawImage(loadedPNG, x, y, width, height);
        }
      }
      const dataURL = canvas.toDataURL('image/png', 1);
      const blob = dataURLToBlob(dataURL);
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'planks_(6X6).png';
      link.click();
    }, 100);
  }

  // 8X8  

  if (document.querySelector("#format-btn").innerText === "Planks 8X8") {
    const files = document.getElementById('file-input').files;
    if (files.length > 55) {
      alert('Error: You can only select up to 55 images.');
      return;
    }
    generatePreview();
    setTimeout(() => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const canvasWidthInches = 54.37;
      const canvasHeightinches = 48.503;
      const dpi = 300; // 300 DPI for print resolution  
      const canvasWidth = canvasWidthInches * dpi;
      const canvasHeight = canvasHeightinches * dpi;
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      for (let i = 0; i < loadedPNGs.length; i++) {
        const loadedPNG = loadedPNGs[i];

        const positions = [
          [.71, .6],    [9.33, .6],    [17.95, .6],    [26.57, .6],    [35.19, .6],    [43.81, .6],
          [.71, 9.22],  [9.33, 9.22],  [17.95, 9.22],  [26.57, 9.22],  [35.19, 9.22],  [43.81, 9.22],
          [.71, 17.84], [9.33, 17.84], [17.95, 17.84], [26.57, 17.84], [35.19, 17.84], [43.81, 17.84],
          [.71, 26.46], [9.33, 26.46], [17.95, 26.46], [26.57, 26.46], [35.19, 26.46], [43.81, 26.46],
          [.71, 35.08], [9.33, 35.08], [17.95, 35.08], [26.57, 35.08], [35.19, 35.08], [43.81, 35.08],

          [52.43, .6],     [61.05, .6],    [69.67, .6],    [78.29, .6],    [86.91, .6], 
          [52.43, 9.22],   [61.05, 9.22],  [69.67, 9.22],  [78.29, 9.22],  [86.91, 9.22], 
          [52.43, 17.84],  [61.05, 17.84], [69.67, 17.84], [78.29, 17.84], [86.91, 17.84],
          [52.43, 26.46],  [61.05, 26.46], [69.67, 26.46], [78.29, 26.46], [86.91, 26.46],
          [52.43, 35.08],  [61.05, 35.08], [69.67, 35.08], [78.29, 35.08], [86.91, 35.08],
        ];

        let x, y, width, height;
        if (i < positions.length) {
          x = positions[i][0] * dpi;
          y = positions[i][1] * dpi;
          width = 8.15 * dpi;
          height = 8.15 * dpi;
        } else {
          x = i % 2 === 0 ? canvasWidth - (8.15 * dpi) : canvasWidth / 54.37;
          y = Math.floor((i - 1) / 2) * (8.15 * dpi) + canvasHeight / 48.503;
          width = 8.15 * dpi;
          height = 8.15 * dpi;
        }

        if (i < 55) {
          ctx.drawImage(loadedPNG, x, y, width, height);
        }
      }
      const dataURL = canvas.toDataURL('image/png', 1);
      const blob = dataURLToBlob(dataURL);
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'planks_(8X8).png';
      link.click();
    }, 100);
  }

  // 10x10

  if (document.querySelector("#format-btn").innerText === "Planks 10X10") {
    const files = document.getElementById('file-input').files;
    if (files.length > 36) {
      alert('Error: You can only select up to 36 images.');
      return;
    }
    generatePreview();
    setTimeout(() => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const canvasWidthInches = 95.99;
      const canvasHeightinches = 48.503;
      const dpi = 300; // 300 DPI for print resolution  
      const canvasWidth = canvasWidthInches * dpi;
      const canvasHeight = canvasHeightinches * dpi;
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      for (let i = 0; i < loadedPNGs.length; i++) {
        const loadedPNG = loadedPNGs[i];

        const positions = [
          [.54, .78],  [11.12, .78],  [21.7, .78],  [32.28, .78],  [42.86, .78],
          [.54, 11.37], [11.12, 11.37], [21.7, 11.37], [32.28, 11.37], [42.86, 11.37],
          [.54, 21.95], [11.12, 21.95], [21.7, 21.95], [32.28, 21.95], [42.86, 21.95],
          [.54, 32.53], [11.12, 32.53], [21.7, 32.53], [32.28, 32.53], [42.86, 32.53],
          
          [53.44, .78],  [64.02, .78],  [74.6, .78],  [85.18, .78],  
          [53.44, 11.37], [64.02, 11.37], [74.6, 11.37], [85.18, 11.37],
          [53.44, 21.95], [64.02, 21.95], [74.6, 21.95], [85.18, 21.95],
          [53.44, 32.53], [64.02, 32.53], [74.6, 32.53], [85.18, 32.53]
          ];

        let x, y, width, height;
        if (i < positions.length) {
          x = positions[i][0] * dpi;
          y = positions[i][1] * dpi;
          width = 10.15 * dpi;
          height = 10.15 * dpi;
        } else {
          x = i % 2 === 0 ? canvasWidth - (10.15 * dpi) : canvasWidth / 95.99;
          y = Math.floor((i - 1) / 2) * (10.15 * dpi) + canvasHeight / 48.503;
          width = 10.15 * dpi;
          height = 10.15 * dpi;
        }

        if (i < 36) {  
          ctx.drawImage(loadedPNG, x, y, width, height);  
        }  
      }  
      const dataURL = canvas.toDataURL('image/png', 1);  
      const blob = dataURLToBlob(dataURL);  
      const link = document.createElement('a');  
      link.href = URL.createObjectURL(blob);  
      link.download = 'planks_(10X10).png';  
      link.setAttribute('download', 'planks_(10X10).png');  
      document.body.appendChild(link); 
      link.click();  
      document.body.removeChild(link); 
    }, 100);  
  }  

  // 12x12 

  if (document.querySelector("#format-btn").innerText === "Planks 12X12") {
    const files = document.getElementById('file-input').files;
    if (files.length > 21) {
      alert('Error: You can only select up to 21 images.');
      return;
    }
    generatePreview();
    setTimeout(() => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const canvasWidthInches = 95.99;
      const canvasHeightinches = 48.503;
      const dpi = 300; // 300 DPI for print resolution  
      const canvasWidth = canvasWidthInches * dpi;
      const canvasHeight = canvasHeightinches * dpi;
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      for (let i = 0; i < loadedPNGs.length; i++) {
        const loadedPNG = loadedPNGs[i];

        const positions = [
          [.70, .89],    [13.2, .89],   [25.7, .89],   [38.2, .89],
          [.70, 13.39],  [13.2, 13.39], [25.7, 13.39], [38.2, 13.39],
          [.70, 25.89],  [13.2, 25.89], [25.7, 25.89], [38.2, 25.89],
          
          [50.7, .89],   [63.2, .89],   [75.7, .89],
          [50.7, 13.39], [63.2, 13.39], [75.7, 13.39],
          [50.7, 25.89], [63.2, 25.89], [75.7, 25.89]
          ];

        let x, y, width, height;
        if (i < positions.length) {
          x = positions[i][0] * dpi;
          y = positions[i][1] * dpi;
          width = 12.15 * dpi;
          height = 12.15 * dpi;
        } else {
          x = i % 2 === 0 ? canvasWidth - (12.15 * dpi) : canvasWidth / 95.99;
          y = Math.floor((i - 1) / 2) * (12.15 * dpi) + canvasHeight / 48.503;
          width = 12.15 * dpi;
          height = 12.15 * dpi;
        }

        if (i < 21) {
          ctx.drawImage(loadedPNG, x, y, width, height);
        }
      }
      const dataURL = canvas.toDataURL('image/png', 1);
      const blob = dataURLToBlob(dataURL);
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'planks_(12X12).png';
      link.click();
    }, 100);
  }

  // 18X6

  if (document.querySelector("#format-btn").innerText === "Planks 18X6") {
    const files = document.getElementById('file-input').files;
    if (files.length > 24) {
      alert('Error: You can only select up to 24 images.');
      return;
    }
    generatePreview();
    setTimeout(() => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const canvasWidthInches = 95.99;
      const canvasHeightinches = 48.503;
      const dpi = 300; // 300 DPI for print resolution  
      const canvasWidth = canvasWidthInches * dpi;
      const canvasHeight = canvasHeightinches * dpi;
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      for (let i = 0; i < loadedPNGs.length; i++) {
        const loadedPNG = loadedPNGs[i];

        const positions = [
          [1, 6.5],  [8, 6.5],  [15, 6.5], [22, 6.5], [29, 6.5], [36, 6.5], [43, 6.5],
          [1, 25],   [8, 25],   [15, 25],  [22, 25],  [29, 25],  [36, 25], [43, 25],
          
          [50, 6.5], [57, 6.5], [64, 6.5], [71, 6.5], [78, 6.5], 
          [50, 25],  [57, 25],  [64, 25],  [71, 25],  [78, 25],
          ];

        let x, y, width, height;
        if (i < positions.length) {
          x = positions[i][0] * dpi;
          y = positions[i][1] * dpi;
          width = 18.15 * dpi;
          height = 6.15 * dpi;
        } else {
          x = i % 2 === 0 ? canvasWidth - (18.15 * dpi) : canvasWidth / 95.99;
          y = Math.floor((i - 1) / 2) * (6.15 * dpi) + canvasHeight / 48.503;
          width = 18.15 * dpi;
          height = 6.15 * dpi;
        }

        if (i < 24) {  
          ctx.save();  
          ctx.translate(x + width / 2, y + height / 2);  
          ctx.rotate(Math.PI / 2); // Rotate by 90 degrees  
          ctx.drawImage(loadedPNG, -width / 2, -height / 2, width, height);  
          ctx.restore();  
        } else {  
          ctx.drawImage(loadedPNG, x, y, width, height);  
        } 
      }
      const dataURL = canvas.toDataURL('image/png', 1);
      const blob = dataURLToBlob(dataURL);
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'planks_(18X6).png';
      link.click();
    }, 100);
  }

  // 24x12

  if (document.querySelector("#format-btn").innerText === "Planks 24X12") {
    const files = document.getElementById('file-input').files;
    if (files.length > 12) {
      alert('Error: You can only select up to 12 images.');
      return;
    }
    generatePreview();
    setTimeout(() => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const canvasWidthInches = 95.99;
      const canvasHeightinches = 48.503;
      const dpi = 300; // 300 DPI for print resolution  
      const canvasWidth = canvasWidthInches * dpi;
      const canvasHeight = canvasHeightinches * dpi;
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      for (let i = 0; i < loadedPNGs.length; i++) {
        const loadedPNG = loadedPNGs[i];

        const positions = [
          [1, 6.5], [13, 6.5], [25, 6.5], [37, 6.5],
          [1, 30], [13, 30], [25, 30], [37, 30],
          
          [49, 6.5], [61, 6.5],
          [49, 30], [61, 30],
          ];

        let x, y, width, height;
        if (i < positions.length) {
          x = positions[i][0] * dpi;
          y = positions[i][1] * dpi;
          width = 23 * dpi;
          height = 11 * dpi;
        } else {
          x = i % 2 === 0 ? canvasWidth - (23 * dpi) : canvasWidth / 95.99;
          y = Math.floor((i - 1) / 2) * (11 * dpi) + canvasHeight / 48.503;
          width = 23 * dpi;
          height = 11 * dpi;
        }

        if (i < 12) {  
          ctx.save();  
          ctx.translate(x + width / 2, y + height / 2);  
          ctx.rotate(Math.PI / 2); // Rotate by 90 degrees  
          ctx.drawImage(loadedPNG, -width / 2, -height / 2, width, height);  
          ctx.restore();  
        } else {  
          ctx.drawImage(loadedPNG, x, y, width, height);  
        } 
      }
      const dataURL = canvas.toDataURL('image/png', 1);
      const blob = dataURLToBlob(dataURL);
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'planks_(24X12).png';
      link.click();
    }, 100);
  }
  // add more here

}




// Function to generate and display the preview of the final image
function generatePreview() {

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const exportButton = document.getElementById('export-button');
  exportButton.addEventListener('click', handleExportButtonClick);

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  const canvasWidth = 800;
  const canvasHeight = 1200;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  const scaleFactor = Math.min(canvasWidth / 2400, canvasHeight / (loadedPNGs.length * 200));

  for (let i = 0; i < loadedPNGs.length; i++) {
    const loadedPNG = loadedPNGs[i];

    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 20 + col * (400 + 20);
    const y = 20 + row * (200 * scaleFactor + 20);

    ctx.drawImage(loadedPNG, x, y, 400 * scaleFactor, 200 * scaleFactor);
  }

  // Convert the canvas to a data URL
  const dataURL = canvas.toDataURL('image/png');

  // Create an <img> element for previewing the final image
  const previewImage = document.createElement('img');
  previewImage.src = dataURL;
  previewImage.classList.add('preview-pdf');

  // Clear the preview area and append the preview image
  previewArea.innerHTML = '';
  previewArea.appendChild(previewImage);
}

// Function to convert data URL to Blob
function dataURLToBlob(dataURL) {
  const binaryString = atob(dataURL.split(',')[1]);
  const arrayBuffer = new ArrayBuffer(binaryString.length);
  const view = new Uint8Array(arrayBuffer);
  for (let i = 0; i < binaryString.length; i++) {
    view[i] = binaryString.charCodeAt(i);
  }
  const blob = new Blob([arrayBuffer], { type: 'image/png' });

  return blob;
}  
