import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { CalcFormComponent } from "./calc-form.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { DebugElement } from "@angular/core";
import { BrowserModule, By } from "@angular/platform-browser";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { AppComponent } from "src/app/app.component";

describe("CalcFormComponent", () => {
  let component: CalcFormComponent;
  let fixture: ComponentFixture<CalcFormComponent>;
  let de: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatToolbarModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule
      ],
      declarations: [CalcFormComponent, AppComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalcFormComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    fixture.detectChanges();
  });

  /**********************
   * Step 1 test suite
   **********************/

  /*******************************
   * This Test is only for step 1
   * ===========================
  it("#calcFormControl.valid should be false - (1,2,3)", () => {
    component.calcFormControl.setValue("1,2,3");
    expect(component.calcFormControl.valid).toBeFalsy();
  });
  *******************************/

  it("#Calculation should equal to 20 - (20)", () => {
    component.calcFormControl.setValue("20");
    component.calculate();
    expect(component.calculationResult).toBe(20);
  });

  it("#Calculation should equal to 5 - (5,tyty)", () => {
    component.calcFormControl.setValue("5,tyty");
    component.calculate();
    expect(component.calculationResult).toBe(5);
  });

  // it("#Calculation should equal to 5001 - (1,5000)", () => {
  //   component.calcFormControl.setValue("1,5000");
  //   component.calculate();
  //   expect(component.calculationResult).toBe(5001);
  // });

  // it("#Calculation header should be 5001", () => {
  //   component.calcFormControl.setValue("1,5000");
  //   component.calculate();
  //   fixture.detectChanges();
  //   const h1 = de.query(By.css("h1"));
  //   expect(h1.nativeElement.innerText).toBe("5001");
  // });

  /**********************
   * Step 2 test suite
   **********************/
  it("#Calculation should equal to 78 - (1,2,3,4,5,6,7,8,9,10,11,12)", () => {
    component.calcFormControl.setValue("1,2,3,4,5,6,7,8,9,10,11,12");
    component.calculate();
    expect(component.calculationResult).toBe(78);
  });

  /**********************
   * Step 3 test suite
   **********************/
  it("#Calculation should be 6 (1\\n2,3)", () => {
    component.calcFormControl.setValue("1\n2,3");
    component.calculate();
    expect(component.calculationResult).toBe(6);
  });

  /**********************
   * Step 4 test suite
   **********************/
  it("#deniedNegativeNumbers should equal `[-3]`", () => {
    component.calcFormControl.setValue("1,2,-3,4");
    component.showDenied();
    expect(component.deniedNegativeNumbers).toEqual([-3]);
  });

  it("#deniedNegativeNumbers should equal `[-3,6]`", () => {
    component.calcFormControl.setValue("1,2,-3,4\n-6");
    component.showDenied();
    expect(component.deniedNegativeNumbers).toEqual([-3, -6]);
  });

  /**********************
   * Step 5 test suite
   **********************/
  it("#calculationResult should equal to `8`", () => {
    component.calcFormControl.setValue("2,1001,6");
    component.calculate();
    expect(component.calculationResult).toBe(8);
  });
});
