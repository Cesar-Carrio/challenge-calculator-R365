import { Component, OnInit } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";

@Component({
  selector: "app-calc-form",
  templateUrl: "./calc-form.component.html",
  styleUrls: ["./calc-form.component.css"]
})
export class CalcFormComponent implements OnInit {
  // Creating reactive form and validators
  calcFormControl = new FormControl("", [
    Validators.required,
    Validators.pattern(/^(\d*(((,|\n)?)\d*)*)?$/)
  ]);
  // Validators.pattern(/\-?(\d|\w)*((,|\n)?)\-?(\d|\w)*/) --- Step 3

  calculationResult: number; // End result for calculation
  deniedNegativeNumbers = []; // Array of denied negative numbers

  constructor() {}

  ngOnInit() {}

  showDenied() {
    this.deniedNegativeNumbers = this.parsingHelperFunction(
      this.calcFormControl.value,
      "showDenied"
    );
    return this.deniedNegativeNumbers;
  }

  calculate() {
    const tempCalculationResult = this.parsingHelperFunction(
      this.calcFormControl.value,
      "calculate"
    ).reduce((accumVal, currVal) => {
      return accumVal + currVal; // adding values in array
    });
    this.calculationResult = tempCalculationResult; // setting final calculation result
  }

  parsingHelperFunction(input: string, funcCallee: string) {
    const inputValue: string = input;
    const parsedStringValues = inputValue.split(/[\n,]/);
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
