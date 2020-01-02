import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

constructor() { }


email(input: string): boolean {
  if ( !input) {
    return  false;
  }
  if (input.includes('@') && input[input.length - 1] !== '@') {
    return false;
  } else {
    return true;
  }
}

minLength(input: string, minLength: number): boolean {
  if (!input) {
    return  false;
  }

  if (input == null || input.length === 0) {
    return false;
  }

  if (input.length < minLength) {
    return true;
  } else {
    return false;
  }
}

onlyNumbers(inputFieldId: string): boolean {
  let element: any = document.getElementById(inputFieldId);
  if (element == null) {
    return false;
  }

  const val = element.value;

  if (val == null || val.length === 0) {
    return false;
  }

  let inp = val.match(/\d/g);
  if (inp == null || inp.length === 1) {
    element.value = inp;
    return true;
  }

  inp = inp.join('');

  element.value = inp;
  element = document.getElementById(inputFieldId);
  element.value = inp;
  return false;
}

compareField(elem1: string, elem2: string): boolean {
  const element1: any = document.getElementById(elem1);
  const element2: any = document.getElementById(elem2);

  if (element1 == null || element2 == null) {
    return true;
  }

  if (element1.value == null || element1.value.length === 0 || element2.value == null || element2.value.length === 0) {
    return true;
  }

  if (element1.value === element2.value) {
    return true;
  } else {
    return false;
  }

}

  phoneMobileFormat(inputFieldId: string, modelVal: string): boolean {
    let element: any = document.getElementById(inputFieldId);
    if (element == null) {
       return false;
    }

    const val = element.value;
    // const input = val.replace( /^\D+/g, '');
    if (val == null || val.length === 0) {
      return false;
    }

    let input = val.match(/\d/g);
    if (input == null || input.length === 1) {
      element.value = input;
      return true;
    }

    input = input.join('');

    if (input.length > 10) {
      input = input.substring(0, input.length - 1);
    }

    let j = 0;
    let phone = '';
    for (let i = 1; i < 13; i++) {
        if (i % 4 === 0 && i !== 0 && i < 12 && (i < input.length + i / 4)) {
          phone += ' ';
        } else {
          if (input.length > j) {
            phone += input[j];
            j++;
          } else {
            break;
          }
        }
      }
    element.value = phone;
    element = document.getElementById(inputFieldId);
    element.value = phone;
    return false;
  }

  phoneFormat(inputFieldId: string, modelVal: string): boolean {
    let element: any = document.getElementById(inputFieldId);
    if (element == null) {
      return false;
    }

    const val = element.value;
    // const input = val.replace( /^\D+/g, '');
    if (val == null || val.length === 0) {
      return false;
    }

    let input = val.match(/\d/g);
    if (input == null || input.length === 1) {
      element.value = input;
      return true;
    }

    input = input.join('');

    if (input.length > 9) {
      input = input.substring(0, input.length - 1);
    }

    let j = 0;
    let phone = '';
    for (let i = 1; i < 10; i++) {
        if ((i === 4 || i === 7) && (i < input.length + i / 4)) {
          phone += ' ';
        } else {
          if (input.length > j) {
            phone += input[j];
            j++;
          } else {
            break;
          }
        }
      }
    element.value = phone;
    element = document.getElementById(inputFieldId);
    element.value = phone;
    return false;
  }

  bankAccountFormat(inputFieldId: string, modelVal: string): boolean {
    let element: any = document.getElementById(inputFieldId);
    if (element == null) {
       return false;
    }

    const val = element.value;
    if (val == null || val.length === 0) {
      return false;
    }

    let input = val.match(/\d/g);
    if (input == null || input.length === 1) {
      element.value = input;
      return true;
    }

    input = input.join('');

    if (input.length > 32) {
      input = input.substring(0, input.length - 1);
    }
// input.length != 2 && input.length != 6 && input.length != 10 && input.length != 14 && input.length != 18 && input.length != 22

    let j = 0;
    let account = '';
    for (let i = 1; i < 33; i++) {
        if ((i == 3 || i == 8 || i == 13 || i == 18 || i == 23 || i == 28) && (i < input.length + i / 5)) {
          account += ' ';
        } else {
          if (input.length > j) {
            account += input[j];
            j++;
          } else {
            break;
          }
        }
      }
    element.value = account;
    element = document.getElementById(inputFieldId);
    element.value = account;
    return false;

  }

  maxLength(inputFieldId: string, length: number): boolean {
    const element: any = document.getElementById(inputFieldId);
    if (element == null) {
      return false;
    }

    const val = element.value;
    // const input = val.replace( /^\D+/g, '');
    if (val == null || val.length === 0) {
      return false;
    }

    let input = val.match(/\d/g);
    if (input == null || input.length === 1) {
      element.value = input;
      return true;
    }

    input = input.join('');

    if (input.length > length) {
      input = input.substring(0, length);
    }

    element.value = input;
    return false;
  }

  postCode(inputFieldId: string) {
    let element: any = document.getElementById(inputFieldId);
    if (element == null) {
      return false;
    }
    const val = element.value;
    if (val == null || val.length === 0) {
      return false;
    }

    let input = val.match(/\d/g);
    if (input == null || input.length === 1) {
      element.value = input;
      return true;
    }

    input = input.join('');

    if (input.length > 6) {
      input = input.substring(0, input.length - 1);
    }

    let j = 0;
    let account = '';
    for (let i = 1; i < 7; i++) {
        if (i == 3 && (i < input.length + i / 3)) {
          account += '-';
        } else {
          if (input.length > j) {
            account += input[j];
            j++;
          } else {
            break;
          }
        }
      }
    element.value = account;
    element = document.getElementById(inputFieldId);
    element.value = account;
    return false;
  }

  onlyLetters(inputFieldId: string): boolean {
    const element: any = document.getElementById(inputFieldId);
    if (element == null) {
      return false;
    }
    let val = element.value;
    if (val == null || val.length === 0) {
      return false;
    }
    val = val.replace(/[^a-zA-Z żŻźŹćĆńŃóÓłŁśŚęĘ]+/g, '');
    element.value = val;
    return false;
  }

  FirstCapital(inputFieldId: string): boolean {
    const element: any = document.getElementById(inputFieldId);
    if (element == null) {
      return false;
    }
    let val = element.value;

    if (val == null || val.length === 0) {
      return false;
    }

    if (val == null || val.length < 2) {
      return true;
    }
    val = val[0].toUpperCase() + val.substring(1, val.length);
    element.value = val;
    return false;
  }

  checkValidation(): boolean {
    const elements = document.getElementsByClassName('field-validation');
    return (!elements || elements.length === 0);
  }
//     this.model.bankAccount = this.model.bankAccount.split(' ').join('');
}


