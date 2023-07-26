# Crossword Puzzle Generator

Crossword Puzzle Generator is a Node.js application that generates a printable crossword puzzle in PDF format, along with clues and answers, from a simple JSON input.

The application leverages the 'crossword-layout-generator' and 'pdfkit' libraries to create crossword layouts and PDF documents, respectively.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine.

### Prerequisites

Before you can run the application, make sure you have the following installed:

- Node.js: The runtime environment that executes JavaScript on the server side. Download it [here](https://nodejs.org/).
- npm: The default package manager for Node.js. It gets installed when you install Node.js.

You can check if they're installed on your machine by running:

```bash
node --version
npm --version
```

### Installing

To install the application, clone the repository:

```bash
git clone https://github.com/<your_username>/crossword-puzzle-generator.git
```

Open a terminal in the project directory and run:

```bash
npm install
```

This will install 'crossword-layout-generator' and 'pdfkit' libraries, which are necessary for the application to run.

## Usage

1. Define your crossword clues and answers in the `key.json` file. The file should contain an array of objects, where each object has two properties: `clue` and `answer`. Upon cloning the repository, the file will contain the following sample data:
    ```json
    [
        {
            "clue": "The simplest, fundamental data types in JavaScript",
            "answer": "primitive",
        },
        {
            "clue": "Represents logical entities and can be either true or false",
            "answer": "boolean",
        },
        {
            "clue": "Represents sequence of characters",
            "answer": "string",
        },
        {
            "clue": "Represents a variable that has not been assigned a value",
            "answer": "undefined",
        },
        {
            "clue": "Represents the intentional absence of any object value",
            "answer": "null",
        }
    ]
    ```
    > **Warning**
    > Remember it's a JSON file, so make sure you don't have trailing commas and your property names are enclosed in double quotes.
1. Run the application by executing the following command in the project directory:
    ```bash
    node index.js
    ```

This will generate a crossword puzzle as a PDF file. The PDF will contain the crossword grid, clues, and solution on separate pages.

If a file with the name "crossword.pdf" already exists in your project directory, the script will append a number to the filename of the new PDF (e.g., "crossword1.pdf", "crossword2.pdf", etc.) to avoid overwriting existing files.

## Contributing

Feel free to submit pull requests to contribute to this project. If you find any bugs, please create an issue detailing the problem.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

Thanks to the creators of 'crossword-layout-generator' and 'pdfkit' for their wonderful libraries.
