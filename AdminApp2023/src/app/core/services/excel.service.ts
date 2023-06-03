// import { Injectable } from '@angular/core';
// import { utils as XLSUtils, writeFile } from 'xlsx';
// import { WorkBook, WorkSheet } from 'xlsx/types';

// @Injectable({
//     providedIn: 'root',
// })
// export class ExcelService {
//     public data : false;
//     constructor() {}
//     fileExtension = ".xlsx"
//     public exportToExcel({
//         data,
//         fileName,
//         sheetName = "Data",
//         header = [],
//         table}
// ): void{
//         let wb: WorkBook;
//         if (table){
//             wb =XLSUtils.table_to_book(table)
//         }else{
//             const ws: WorkSheet = XLSUtils.json_to_sheet(data, { header});
//             wb = XLSUtils.book_new();
//             XLSUtils.book_append_sheet(wb,ws,sheetName)
//         }
//         writeFile(wb, `${fileName}${this.fileExtension}`);
//     }
// }
