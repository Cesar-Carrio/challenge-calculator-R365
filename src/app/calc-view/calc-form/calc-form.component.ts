import { Component, OnInit } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";

@Component({
  selector: "app-calc-form",
  templateUrl: "./calc-form.component.html",
  styleUrls: ["./calc-form.component.css"]
})
export class CalcFormComponent implements OnInit {
  calculationResult: number; // End result for calculation
  deniedNegativeNumbers = []; // Array of denied negative numbers
  customTokenDelimiter: any;
  customDelimiterString: string;
  regexString: string = `^((\\d|\\w)*(((,|\\n)?)(\\d|\\w)*)*)?$`;
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
      const customDelimiter: RegExp = new RegExp(/^\/\/.\n/);
      const foundMatches = val.match(customDelimiter);
      let testMatches: boolean = false;
      if (foundMatches) {
        testMatches = customDelimiter.test(foundMatches[0] ? foundMatches[0] : "");
      }

      if (testMatches) {
        // Creating Custom Delimitors and Validators
        this.customDelimiterMarker = true;
        this.creatingCustomDelimiter(val);
      } else {
        // Resetting Pattern Validator
        this.customDelimiterMarker = false;
        this.calcFormControl.setValidators([Validators.pattern(this.regexString)]);
      }
    });
  }

  creatingCustomDelimiter(inputValue: string) {
    const parsedToken = inputValue.split(/^\/{2}|\n/); //Getting custom delimiter
    this.customTokenDelimiter = parsedToken[1] === "," ? null : "\\" + parsedToken[1];

    console.log(this.customTokenDelimiter);

    const newRegexString = `//((\\d|\\w)*(((,|\\n|${
      this.customTokenDelimiter ? this.customTokenDelimiter : null
    })?)(\\d|\\w)*)*)?$`; //Creating new Regex string for Pattern Validation
    this.calcFormControl.setValidators([Validators.pattern(newRegexString)]); // Setting form validation with new regex pattern

    if (this.customDelimiterMarker) {
      // starting the parsing with the custom delimiter
      const parseOutCustomDelimiterRegex: RegExp = new RegExp(`\/{2}.\\n\+`);
      this.customDelimiterString = inputValue.split(parseOutCustomDelimiterRegex)[1];
      this.newCustomDelimiterRegex = new RegExp(`[\\n,${this.customTokenDelimiter}]`);
    }
  }

  showDenied() {
    this.deniedNegativeNumbers = this.parsingHelperFunction(this.calcFormControl.value, "showDenied");
    return this.deniedNegativeNumbers;
  }

  calculate() {
    const tempCalculationResult = this.parsingHelperFunction(
      this.customDelimiterMarker ? this.customDelimiterString : this.calcFormControl.value,
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
}
