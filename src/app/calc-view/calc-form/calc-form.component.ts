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
    Validators.pattern(/\-?(\d|\w)*((,|\n)?)\-?(\d|\w)*/)
  ]);
  // Validators.pattern(/^\-?(\d|\w)*(,?)\-?(\d|\w)*$/) ------ Step 1
  //  Validators.pattern(/\-?(\d|\w)*(,?)\-?(\d|\w)*/) ------- Step 2

  calculationResult: number; // End result for calculation

  constructor() {}

  ngOnInit() {}

  calculate() {
    const inputValue: string = this.calcFormControl.value;
    const parsedStringValues = inputValue.split(/[\n,]/);
    const parsedNumberValues = parsedStringValues.map((value: string) => {
      return isNaN(+value) ? 0 : +value;
    });
    const tempCalculationResult = parsedNumberValues.reduce(
      (accumVal, currVal) => {
        return accumVal + currVal; // adding values in array
      }
    );
    this.calculationResult = tempCalculationResult; // setting final calculation result
  }
}
