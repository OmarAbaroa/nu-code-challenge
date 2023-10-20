#! /usr/bin/env node

// Function to print the instructions
const printInstructions = () => {
  console.log("Please add an array or a blank link to finish.");
};

// Function to get the inputs, calculate taxes and print the results
const getTaxes = () => {
  const inputArrays = new Array();
  const readline = require("readline");

  // Creating readline
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });

  printInstructions();

  // Read the inputs
  rl.on("line", (line) => {
    if (line === "") {
      // If the input is a blank line, then we can calculate the taxes
      const taxes = calculateTaxes(inputArrays);

      // Print the results
      taxes.forEach((taxResult) => {
        process.stdout.write(JSON.stringify(taxResult) + "\n");
      });
      process.exit(0);
    } else {
      // Add input to an array and ask for more inputs
      inputArrays.push(JSON.parse(line));
      printInstructions();
    }
  });
};

// Calculte the taxes
const calculateTaxes = (inputArray) => {
  // Array to handle the array of results
  const result = new Array();

  // Array of inputs to be iterated
  inputArray.forEach((operations) => {
    // Setting the Array of taxes as result for an imput
    const arrayOutput = new Array();
    // Init of some variables
    let stock = 0;
    let loss = 0;
    let weightedAverage = 0;

    // Iterate the array of operations
    operations.forEach((operation) => {
      // Retrieve operation, quantity and unit cost
      const { operation: type, quantity } = operation;
      const unitCost = operation["unit-cost"];
      // Getting the total of the operation
      const operationCost = unitCost * quantity;

      if (type === "buy") {
        // If the operation is buy, then I need to calculate the weighted average price
        weightedAverage = calculateWeightedAveragePrice(
          stock,
          weightedAverage,
          quantity,
          unitCost,
        );
        // Increase the stock
        stock = stock + quantity;
        // No taxes for buy opeartions
        arrayOutput.push({ tax: 0.0 });
      } else {
        // Calculte the profit of a sell operation
        const realCost = weightedAverage * quantity;
        const profit = operationCost - realCost;

        if (profit < 0) {
          // If the profit is a negative number, then we have a loss
          loss = loss + profit * -1;
        }

        if (operationCost > 20000) {
          // Calculate the taxes and substract the loss
          if (loss >= profit) {
            arrayOutput.push({ tax: 0.0 });
            if (profit > 0) {
              loss = loss - profit;
            }
          } else {
            const tax = (profit - loss) * 0.2;
            arrayOutput.push({ tax: parseFloat(tax) });
            loss = 0;
          }
        } else {
          // If the total of the operation is less or equal than 20,000 then the taxes is 0
          arrayOutput.push({ tax: 0.0 });
        }
        // Decrease the stock
        stock = stock - quantity;
      }
    });

    result.push(arrayOutput);
  });

  return result;
};

// Function to calculate the weighted average price
const calculateWeightedAveragePrice = (
  stock,
  weightedAverage,
  quantity,
  unitCost,
) => {
  return (stock * weightedAverage + quantity * unitCost) / (stock + quantity);
};

// Welcome message
console.log("Welcome to the code challenge, by Omar Abaroa");
// Calling main function
getTaxes();
