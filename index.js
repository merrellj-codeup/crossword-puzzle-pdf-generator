const clg = require("crossword-layout-generator");
const PDFDocument = require("pdfkit");
const fs = require("fs");

const input_json = require("./key.json");

var layout = clg.generateLayout(input_json);
var rows = layout.rows;
var cols = layout.cols;
var table = layout.table; // table as two-dimensional array
var output_html = layout.table_string; // table as plain text (with HTML line breaks)
var output_json = layout.result; // words along with orientation, position, startx, and starty

// Sort the clues by their start position
output_json.sort((a, b) => {
    if (a.starty !== b.starty) {
        return a.starty - b.starty;
    } else {
        return a.startx - b.startx;
    }
});

// Assign clue numbers to the clues
output_json.forEach((clue, index) => {
    clue.number = index + 1;
});

// Create a new PDF document
const doc = new PDFDocument();

let duplicate = 1;
// Check if "crossword.pdf" already exists
if (fs.existsSync("crossword.pdf")) {
    // loop until a filename is found that doesn't exist
    while (fs.existsSync(`crossword${duplicate}.pdf`)) {
        duplicate++;
    }
    doc.pipe(fs.createWriteStream(`crossword${duplicate}.pdf`));
} else {
    doc.pipe(fs.createWriteStream("crossword.pdf"));
}


// PDF document size
let docWidth = 595.28; // A4 width
let docHeight = 841.89; // A4 height

// Margins
let margin = 50;

// Grid size
let gridSizeWidth = (docWidth - 2 * margin) / cols;
let gridSizeHeight = (docWidth - 2 * margin) / rows;

// font sizes
let titleFontSize = 20;
let clueNumberSize = 8;

// Draw the empty crossword
for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
        // Draw the clue number if this cell is the start of a word
        let clue = output_json.find(clue => clue.startx === x && clue.starty === y);
        if (clue) {
            doc
                .fillColor("black")
                .fontSize(clueNumberSize) // Adjust the font size as needed
                .text(
                    clue.number.toString(),
                    (margin + x * gridSizeWidth + 2) - gridSizeWidth,
                    (margin + y * gridSizeHeight + 2) - gridSizeHeight // Adjust the position as needed
                );
        }

        // Draw the rest of the cell as before
        if (table[y][x] === "-") {
            // Draw gray background for empty cells
            doc
                .fontSize(titleFontSize)
                .rect(
                    margin + x * gridSizeWidth,
                    margin + y * gridSizeHeight,
                    gridSizeWidth,
                    gridSizeHeight
                )
                .fill("#ddd")
                .stroke("#ddd");
        } else {
            // Draw black letter for non-empty cells
            doc
                .fontSize(titleFontSize)
                .rect(
                    margin + x * gridSizeWidth,
                    margin + y * gridSizeHeight,
                    gridSizeWidth,
                    gridSizeHeight
                )
                .stroke("#ddd");
            doc
                .fillColor("black")
                .text(
                    " ",
                    margin + x * gridSizeWidth + gridSizeWidth / 2 - 8,
                    margin + y * gridSizeHeight + gridSizeHeight / 2 - 8
                );
        }
    }
}

// Calculate the middle of the page
let middle = docWidth / 2;

// Set the starting point for the clues
let clueStart = margin + rows * gridSizeHeight + 20;

// Draw the clues
const clueFontSize = 10;
const rowClues = output_json.filter((clue) => clue.orientation === "across");
const colClues = output_json.filter((clue) => clue.orientation === "down");
let clueY = clueStart;
rowClues.forEach((clue) => {
    let clueText = `${clue.number}. ${clue.clue}`;
    let lines = Math.ceil(doc.fontSize(clueFontSize).widthOfString(clueText, { width: middle - margin }) / (middle - margin));
    // Draw the number
    let widthOfNumber = doc.fontSize(clueFontSize).widthOfString(`${clue.number}. `, { width: middle - margin });
    doc
        .fillColor("black")
        .font("Helvetica-Bold")
        .fontSize(clueFontSize)
        .text(`${clue.number}. `, margin, clueY, { 
            width: middle - margin
        });
    // Draw the clue
    doc
        .fillColor("black")
        .font("Helvetica")
        .fontSize(clueFontSize)
        .text(clue.clue, margin + widthOfNumber, clueY, {
            width: middle - margin - widthOfNumber
        });
    clueY += lines * (clueFontSize * 1.5); // 20 is the line height
});
clueY = clueStart;
colClues.forEach((clue) => {
    let clueText = `${clue.number}. ${clue.clue}`;
    let lines = Math.ceil(doc.fontSize(clueFontSize).widthOfString(clueText, { width: middle - margin }) / (middle - margin));
    let widthOfNumber = doc.fontSize(clueFontSize).widthOfString(`${clue.number}. `, { width: middle - margin });
    // Draw the number
    doc
        .fillColor("black")
        .font("Helvetica-Bold")
        .fontSize(clueFontSize)
        .text(`${clue.number}. `, middle, clueY, { 
            width: docWidth - middle - margin
        });
    // Draw the clue
    doc
        .fillColor("black")
        .font("Helvetica")
        .fontSize(clueFontSize)
        .text(clue.clue, middle + widthOfNumber, clueY, {
            width: docWidth - middle - margin - widthOfNumber
        });
    clueY += lines * (clueFontSize * 1.5); // 20 is the line height
});

// go to next page
doc.addPage();

// Draw the answers
for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
        // Draw the clue number if this cell is the start of a word
        let clue = output_json.find(clue => clue.startx === x && clue.starty === y);
        if (clue) {
            doc
                .fillColor("black")
                .fontSize(clueNumberSize) // Adjust the font size as needed
                .text(
                    clue.number.toString(),
                    (margin + x * gridSizeWidth + 2) - gridSizeWidth,
                    (margin + y * gridSizeHeight + 2) - gridSizeHeight // Adjust the position as needed
                );
        }

        // Draw the rest of the cell as before
        if (table[y][x] === "-") {
            // Draw gray background for empty cells
            doc
                .fontSize(titleFontSize)
                .rect(
                    margin + x * gridSizeWidth,
                    margin + y * gridSizeHeight,
                    gridSizeWidth,
                    gridSizeHeight
                )
                .fill("#ddd")
                .stroke("#ddd");
        } else {
            // Draw black letter for non-empty cells
            doc
                .fontSize(titleFontSize)
                .rect(
                    margin + x * gridSizeWidth,
                    margin + y * gridSizeHeight,
                    gridSizeWidth,
                    gridSizeHeight
                )
                .stroke("#ddd");
            doc
                .fillColor("black")
                .text(
                    table[y][x].toUpperCase(),
                    margin + x * gridSizeWidth + gridSizeWidth / 2 - 8,
                    margin + y * gridSizeHeight + gridSizeHeight / 2 - 8
                );
        }
    }
}

// Finalize the PDF and end the stream
doc.end();