import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilService {
  constructor(
  ) {}

  parseJson(value:string | null){
    if(value){
      try {
        return JSON.parse(value)
      }catch (err) {
        console.log("Json Parse Error",err);
        
        return value
      }
    }
    return value;
  }


  validateConsData(dataJson: any): string[] {
    let dataCheck: any = {
      Name: {
        dataType: 'string',
        required: true,
        minLength: 0,
        maxLength: 1000
      },
      'Mobile No': {
        dataType: 'number',
        required: true,
        minLength: 0,
        maxLength: 1000
      },
      'Email Id': {
        dataType: 'string',
        required: false,
        // pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        minLength: 0,
        maxLength: 1000
      },
      'Full Address': {
        dataType: 'string',
        required: true,
        minLength: 0,
        maxLength: 1000
      },
      'City': {
        dataType: 'string',
        required: true,
        minLength: 0,
        maxLength: 10000
      },
      'State': {
        dataType: 'string',
        required: true,
        minLength: 0,
        maxLength: 1000
      },
      'Country':{
        dataType: 'string',
        required: true,
        minLength: 0,
        maxLength: 1000
      },
      'Website':{
        dataType: 'string',
        required: false,
        minLength: 0,
        maxLength: 1000
      },
      'About':{
        dataType: 'string',
        required: true,
        minLength: 0,
        maxLength: 10000
      },
    }
  
    let columnNames: any = ['Name', 'Mobile No', 'Email Id','Full Address','City','State','Country','Website','About'];
    console.log('columnNames',columnNames);
    const errors: string[] = [];
  
    if (dataJson.length > 0) {
      const tmpCol: string[] = [];
      Object.keys(dataJson[0]).forEach((columnName: string, i: number) => {
          tmpCol.push(columnName);
      });
  
      if (columnNames.length !== tmpCol.length) {
        errors.push('Columns length Mismatching');
        return errors;
      }
  
      for (let i = 0; i < dataJson.length; i++) {
        const rowData = dataJson[i];
        const rowErrors: string[] = [];
  
        for (let j = 0; j < columnNames.length; j++) {
          const columnName = columnNames[j];
          const columnData = rowData[columnName];
  
          if (!dataCheck[columnName]) {
            continue;
          }
  
          if (dataCheck[columnName].required && !columnData) {
            rowErrors.push(`${columnName} is required.`);
          }
  
          if (dataCheck[columnName].minLength && columnData && columnData.length < dataCheck[columnName].minLength) {
            rowErrors.push(`${columnName} should be at least ${dataCheck[columnName].minLength} characters long.`);
          }
  
          if (dataCheck[columnName].maxLength && columnData && columnData.length > dataCheck[columnName].maxLength) {
            rowErrors.push(`${columnName} should not exceed ${dataCheck[columnName].maxLength} characters.`);
          }
  
          if (dataCheck[columnName].pattern && !dataCheck[columnName].pattern.test(columnData)) {
            rowErrors.push(`${columnName} has an invalid format.`);
          }
        }
  
        if (rowErrors.length > 0) {
          errors.push(`Row no:[${i + 2}] ${rowErrors.join(' and ')}`);
        }
      }
    }
  
    return errors;
  }

}
