import { Component, OnInit } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";

export interface CreatingCustomDelimiterObject {
  inputValue: string;
  singleCharTestMatches: boolean;
  multiCharTestMatches: boolean;
  multiSetCharTestMatches: boolean;
}

@Component({
  selector: "app-calc-form",
  templateUrl: "./calc-form.component.html",
  styleUrls: ["./calc-form.component.css"]
})
export class CalcFormComponent implements OnInit {
  calculationResult: number; // End result for calculation
  deniedNegativeNumbers = []; // Array of denied negative numbers
  customTokenDelimiter: string;
  customSetTokenDelimiter: string[];
  unParsedCalculationString: string;
  regexString: string = `^((\\d|\\w)*(((,|\\n)?)(\\d|\\w)*)*)?$`; // Default form validator
  newCustomDelimiterRegex: RegExp = null;
  customDelimiterMarker: boolean;

  // Creating reactive form and validators
  calcFormControl = new FormControl("", [Validators.required, Validators.pattern(this.regexString)]);

  constructor() {}

  ngOnInit() {
    this.onChanges();
  }

  onChanges() {
    this.calcFormControl.valueChanges.subscribe((val: string) => {
      const singleCharCustomDelimiter: RegExp = new RegExp(/^\/\/.\n/); // Single Char Custom Delimiter
      const multiCharCustomDelimiter: RegExp = new RegExp(/^\/\/\[.*\]\n/); // {N} Char Custom Delimiter
      const multiSetCharCustomDelimter: RegExp = new RegExp(/\/\/\[(.*)\]\n+/); // [M] sets of {N} Chars Custom Delimiters

      const singleCharMatches = val.match(singleCharCustomDelimiter);
      const multiCharMatches = val.match(multiCharCustomDelimiter);
      const multiSetCharMatches = val.match(multiSetCharCustomDelimter);

      let singleCharTestMatches: boolean = false;
      let multiCharTestMatches: boolean = false;
      let multiSetCharTestMatches: boolean = false;

      let bracketCount: number = 0;
      if (multiCharMatches || multiSetCharMatches) {
        for (const char of multiSetCharMatches.input) {
          if (char === "[" || char === "]") {
            bracketCount++;
          }
        }
      }

      if (singleCharMatches) {
        singleCharTestMatches = singleCharCustomDelimiter.test(singleCharMatches[0] ? singleCharMatches[0] : "");
      }

      if (multiCharMatches && bracketCount === 2) {
        multiCharTestMatches = multiCharCustomDelimiter.test(multiCharMatches[0] ? multiCharMatches[0] : "");
      }

      if (multiSetCharMatches && bracketCount > 2) {
        multiSetCharTestMatches = multiSetCharCustomDelimter.test(multiSetCharMatches[0] ? multiSetCharMatches[0] : "");
      }

      if (singleCharTestMatches || multiCharTestMatches || multiSetCharTestMatches) {
        // Creating Custom Delimitors and Validators
        this.customDelimiterMarker = true;
        const creatingCustomDelimiterObject: CreatingCustomDelimiterObject = {
          inputValue: val,
          singleCharTestMatches,
          multiCharTestMatches,
          multiSetCharTestMatches
        };
        this.creatingCustomDelimiter(creatingCustomDelimiterObject);
      } else {
        // Resetting Pattern Validator
        this.customDelimiterMarker = false;
        this.calcFormControl.setValidators([Validators.pattern(this.regexString)]);
      }
    });
  }

  creatingCustomDelimiter(values: CreatingCustomDelimiterObject) {
    if (values.singleCharTestMatches) {
      this.singleCharDelimiterHelper(values.inputValue);
    } else if (values.multiCharTestMatches) {
      this.multiCharDelimiterHelper(values.inputValue);
    } else if (values.multiSetCharTestMatches) {
      this.multiSetCharDelimiter(values.inputValue);
    }
  }

  multiSetCharDelimiter(inputValue: string) {
    // Parsing custom delimiter with [M] sets and {N} chars
    // Getting custom delimiter
    const splitParseValues: string[] = inputValue.split(/^\/{2}|\n/);
    const arrayOfDelimiters: string[] = splitParseValues[1]
      .split("]")
      .join("")
      .split("[")
      .slice(1);

    const { newRegexFormValidator, delimitersSetString } = this.createMultiSetValidator(arrayOfDelimiters);

    // Setting new regex pattern validator for the input field
    this.calcFormControl.setValidators([Validators.pattern(newRegexFormValidator)]);

    if (this.customDelimiterMarker) {
      // setting calculation string that needs to be parsed
      this.unParsedCalculationString = splitParseValues.slice(2).join();
      this.newCustomDelimiterRegex = new RegExp(`\\n|,${delimitersSetString}`, "g");
      // At this point wait for user to click calculate to start parsing and give calculation
    }
  }

  createMultiSetValidator(arrayOfDelimiters: string[]) {
    let arrayOfValidParsedTokenDelimiters = [];
    let validParsedTokenDelimiter: string = "";
    for (let index = 0; index < arrayOfDelimiters.length; index++) {
      for (const char of arrayOfDelimiters[index]) {
        if (char.match(/\w+|\d+/)) {
          validParsedTokenDelimiter += char;
        } else {
          validParsedTokenDelimiter += "\\" + char;
        }
      }
      arrayOfValidParsedTokenDelimiters.push(validParsedTokenDelimiter);
      validParsedTokenDelimiter = "";
    }
    this.customSetTokenDelimiter = arrayOfValidParsedTokenDelimiters;

    let buildingRegexStart = "//";
    let delimitersSetString = "";
    for (const token of this.customSetTokenDelimiter) {
      buildingRegexStart += "\\[" + token + "\\]";
      delimitersSetString += "|" + token;
    }
    const newRegexFormValidator = `${buildingRegexStart}\\n+((\\d|\\w)*(((,|\\n|\\w+\\d+${delimitersSetString})?)(\\d|\\w)*)*)?`;
    return { newRegexFormValidator, delimitersSetString };
  }

  singleCharDelimiterHelper(inputValue: string) {
    // parsing custom single char delimiter
    //Getting custom delimiter
    const splitParseValues: string[] = inputValue.split(/^\/{2}|\n/);

    // This takes care of case where a comma is the custom delimiter
    this.customTokenDelimiter = splitParseValues[1] === "," ? null : "\\" + splitParseValues[1];

    // Creating new regex pattern with custom single char delimiter
    // for the the input field
    const newRegexFormValidator = `//((\\d|\\w)*(((,|\\n|${
      this.customTokenDelimiter ? this.customTokenDelimiter : null
    })?)(\\d|\\w)*)*)?$`;

    //Setting new regex pattern validator for the input field
    this.calcFormControl.setValidators([Validators.pattern(newRegexFormValidator)]);

    if (this.customDelimiterMarker) {
      // Regex for removing custom initial characters
      // that set custom delimiter
      const parseOutCustomDelimiterRegex: RegExp = new RegExp(`\/{2}.\\n\+`);

      // setting calculation string that needs to be parsed
      this.unParsedCalculationString = inputValue.split(parseOutCustomDelimiterRegex)[1];

      this.newCustomDelimiterRegex = new RegExp(`[\\n,${this.customTokenDelimiter}]`);
      // At this point wait for user to click calculate to start parsing and give calculation
    }
  }

  multiCharDelimiterHelper(inputValue: string) {
    // parsing custom delimiter with {N} repitions
    // Getting custom delimiter
    const splitParseValues: string[] = inputValue.split(/^\/{2}|\n/);
    const regexExtractingDelimiter: RegExp = new RegExp(/[\[|\]]/g);
    const unvalidParsedTokenDelimiter: string = splitParseValues[1].replace(regexExtractingDelimiter, "");
    let validParsedTokenDelimiter: string = "";
    for (const delimiter of unvalidParsedTokenDelimiter) {
      validParsedTokenDelimiter += "\\" + delimiter;
    }
    this.customTokenDelimiter = validParsedTokenDelimiter;

    // Creating new regex pattern with custom single char delimiter
    // for the the input field
    const newRegexFormValidator = `//\\[${this.customTokenDelimiter}\\]\\n+((\\d|\\w)*(((,|\\n|${this.customTokenDelimiter})?)(\\d|\\w)*)*)?$`;
    // Setting new regex pattern validator for the input field
    this.calcFormControl.setValidators([Validators.pattern(newRegexFormValidator)]);

    if (this.customDelimiterMarker) {
      // setting calculation string that needs to be parsed
      this.unParsedCalculationString = splitParseValues.slice(2).join();

      this.newCustomDelimiterRegex = new RegExp(`[\\n,${this.customTokenDelimiter}]`);
      // At this point wait for user to click calculate to start parsing and give calculation
    }
  }

  showDenied() {
    if (this.customDelimiterMarker) {
      this.deniedNegativeNumbers = this.parsingHelperFunction(
        this.calcFormControl.value,
        "showDenied",
        this.newCustomDelimiterRegex
      );
    } else {
      this.deniedNegativeNumbers = this.parsingHelperFunction(this.calcFormControl.value, "showDenied");
    }

    return this.deniedNegativeNumbers;
  }

  calculate() {
    const tempCalculationResult = this.parsingHelperFunction(
      this.customDelimiterMarker ? this.unParsedCalculationString : this.calcFormControl.value,
      "calculate",
      this.newCustomDelimiterRegex ? this.newCustomDelimiterRegex : null
    ).reduce((accumVal, currVal) => {
      return accumVal + currVal;
    });
    this.customDelimiterMarker = false;
    this.calculationResult = tempCalculationResult;
  }

  parsingHelperFunction(input: string, funcCallee: string, regexExp?: RegExp) {
    const inputValue: string = input;
    const parsedStringValues = regexExp ? inputValue.split(regexExp) : inputValue.split(/[\n,]/);
    let parsedNumberValues = parsedStringValues.map((value: string) => {
      return isNaN(+value) ? 0 : +value;
    });

    if (funcCallee === "calculate") {
      parsedNumberValues = parsedNumberValues.filter(value => value <= 1000);
    } else {
      parsedNumberValues = parsedNumberValues.filter(value => value < 0);
    }

    return parsedNumberValues;
  }

  trackByFn(index, item) {
    // This function helps optimize UI rendering in
    //  angular when creating dynamic ngfor renders
    return item;
  }
}
