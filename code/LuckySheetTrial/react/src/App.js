import React, { Component } from 'react';
import './App.css';
import Luckysheet from './component/Luckysheet'
import Excel from 'exceljs';
import XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import _ from 'lodash';
import moment from 'moment';
import LuckyExcel from 'luckyexcel'
import { Upload, message, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

function App(props) {
  // console.log('props',props.uploadProps);
  return (
    <div className="App">
      <header className="App-header">
      </header>
      <body>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <div><h1><ol>
            <li>Coffee</li>
            <li>Tea</li>
            <li>Milk</li>
          </ol></h1></div>
          <div>
            <Upload 
            {...props.uploadProps}
            
            >
              <Button icon={<UploadOutlined />} onClick={props.import}>Import</Button>
            </Upload>
          </div>
          <div><Button onClick={props.export}>Export</Button></div>
          <div>
            <Luckysheet style={{ height: '100px', width: '100px' }} />
          </div>
        </div>

      </body>
    </div>
  );
}

let hoc = (WrappedComponent) => {
  return class EnhancedComponent extends Component {
    constructor(props) {
      super(props);
      this.state = {

        uploadProps: {
          name: 'file',
          accept: '.xlsx',
          action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
          headers: {
            authorization: 'authorization-text',
          },
          onChange: async info => {
            if (info.file.status !== 'uploading') {
              // console.log('uploading',info.file, info.fileList);
            }
  
            if (info.file.status === 'done') {
              // message.success(this.t('productsImportedMessage'));
              // console.log('info',info);
              // await this.fetchProducts(1);
            } else if (info.file.status === 'error') {
              // console.log('info',info);
              // message.error(this.t('productsImportFailedMessage'));
            }


            console.log('uploading excel info file',info.file);

      let name = info.file.name;
      let suffixArr = name.split("."), suffix = suffixArr[suffixArr.length-1];
      if(suffix!="xlsx"){
          alert("Currently only supports the import of xlsx files");
          return;
      }

      LuckyExcel.transformExcelToLucky(info.file, function(exportJson, luckysheetfile){
          console.log('export json',exportJson);

          if(exportJson.sheets==null || exportJson.sheets.length==0){
              alert("Failed to read the content of the excel file, currently does not support xls files!");
              return;
          }
          window.luckysheet.destroy();

          window.luckysheet.create({
              container: 'luckysheet', //luckysheet is the container id
              showinfobar:false,
              data:exportJson.sheets,
              title:exportJson.info.name,
              userInfo:exportJson.info.name.creator
          });
      });

            




          }
        }


      };
    }

    async componentDidMount() {

 
      
      this.timer = setInterval(() => {
        this.forceUpdate();
      }, 1000 * 60);
    }

    componentWillUnmount() {
      if (this.timer) {
        clearInterval(this.timer);
      }
    }



    async import(){
      // console.log('importting');
      
      // // After getting the xlsx file
      // LuckyExcel.transformExcelToLucky(file, function(exportJson, luckysheetfile){
      //     //Get the worksheet data after conversion
      // });

      // const files = evt.target.files;
      // if(files==null || files.length==0){
      //     alert("No files wait for import");
      //     return;
      // }

      // let name = files[0].name;
      // let suffixArr = name.split("."), suffix = suffixArr[suffixArr.length-1];
      // if(suffix!="xlsx"){
      //     alert("Currently only supports the import of xlsx files");
      //     return;
      // }
      // LuckyExcel.transformExcelToLucky(files[0], function(exportJson, luckysheetfile){
      //     console.log('export json',exportJson);

      //     if(exportJson.sheets==null || exportJson.sheets.length==0){
      //         alert("Failed to read the content of the excel file, currently does not support xls files!");
      //         return;
      //     }
      //     window.luckysheet.destroy();

      //     window.luckysheet.create({
      //         container: 'luckysheet', //luckysheet is the container id
      //         showinfobar:false,
      //         data:exportJson.sheets,
      //         title:exportJson.info.name,
      //         userInfo:exportJson.info.name.creator
      //     });
      // });
    }

    async export() {
      // let tmpWB = window.luckysheet.getAllSheets();
      // console.log('tmpDown',tmpWB);
      // let tmpDown = new Blob([this.strToStream(XLSX.write(tmpWB,
      //   { bookType: 'xlsx', bookSST: false, type: 'binary' }
      // ))], {
      //   type: ''
      // });
      // let href = URL.createObjectURL(tmpDown);
      // document.getElementById('hf').href = href;
      // // document.getElementById('hf').click(); //click to download
      // setTimeout(function () {
      //   URL.revokeObjectURL(tmpDown);
      // }, 100);


      let luckysheet = window.luckysheet.getAllSheets();
      console.log('lucksheet data',luckysheet);
      // 参数为luckysheet.getluckysheetfile()获取的对象
      // 1.创建工作簿，可以为工作簿添加属性
      const workbook = new Excel.Workbook()
      // 2.创建表格，第二个参数可以配置创建什么样的工作表
      if (Object.prototype.toString.call(luckysheet) === '[object Object]') {
        luckysheet = [luckysheet]
      }
      // luckysheet.forEach(function (table) {
      //   if (table.data.length === 0) return true
      //   // ws.getCell('B2').fill = fills.
      //   const worksheet = workbook.addWorksheet(table.name);
      //   // console.log('luckysheet worksheet',worksheet);
      //   // const merge = (table.config && table.config.merge) || {}
      //   // const borderInfo = (table.config && table.config.borderInfo) || {}
      //   // const imageInfo = (table.images) || {}
      //   // 3.设置单元格合并,设置单元格边框,设置单元格样式,设置值
      //   // this.setStyleAndValue(table.data, worksheet);
      //   // setMerge(merge, worksheet)
      //   // setBorder(borderInfo, worksheet)
      //   // setImage(imageInfo, worksheet)
      //   console.log('worksheet', worksheet);
      //   return true
      // })

      _.each(luckysheet, table=>{
        if (table.data.length === 0) return true
        // ws.getCell('B2').fill = fills.
        const worksheet = workbook.addWorksheet(table.name);
        // worksheet.properties.defaultRowHeight = table.ch_width;
        // worksheet.properties.defaultColWidth = table.rh_height;
        const merge = (table.config && table.config.merge) || {}
        const borderInfo = (table.config && table.config.borderInfo) || {}
        // 3.设置单元格合并,设置单元格边框,设置单元格样式,设置值
        this.setStyleAndValue(table.data, worksheet);
        this.setMerge(merge, worksheet)
        this.setBorder(borderInfo, worksheet)
        
        const columnData = table.config.columnlen;
        this.setRowColSize(columnData, worksheet);

        console.log('luckysheet worksheet each',worksheet);
      })


      // return
      // 4.写入 buffer
      const buffer = workbook.xlsx.writeBuffer().then(data => {
        // console.log('data', data)
        const blob = new Blob([data], {
          type: 'application/vnd.ms-excel;charset=utf-8'
        })
        console.log("导出成功！")
        // FileSaver.saveAs(blob, `下载.xlsx`)
        saveAs(blob, `下载`+moment().format('YYYYMMDD HH:MM:ss')+`.xlsx`);
        // let href = URL.createObjectURL(blob);
				// document.getElementById('luckysheet').href = href;
				// document.getElementById('luckysheet').click(); //click to download
				// setTimeout(function () {
				// 	URL.revokeObjectURL(blob);
				// }, 100);
      })
    }


    setRowColSize(columnData, worksheet){
      console.log('columnData',columnData);
      if(columnData){
        _.each(columnData, (v,k)=>{
          console.log('i v', k,'=====',v)
          let columnNum = parseInt(k)+1;
          console.log(columnNum);
          let temp = worksheet.getColumn(columnNum);
          console.log('temp',temp);
          temp.width = v;
        })
      }
    }

    setMerge = function(luckyMerge = {}, worksheet) {
      const mergearr = Object.values(luckyMerge)
      mergearr.forEach(function(elem) {
        // elem格式：{r: 0, c: 0, rs: 1, cs: 2}
        // 按开始行，开始列，结束行，结束列合并（相当于 K10:M12）
        worksheet.mergeCells(
          elem.r + 1,
          elem.c + 1,
          elem.r + elem.rs,
          elem.c + elem.cs
        )
      })
    }
    
    setBorder = function(luckyBorderInfo, worksheet) {
      if (!Array.isArray(luckyBorderInfo)) return
      // console.log('luckyBorderInfo', luckyBorderInfo)
      _.map(luckyBorderInfo,(elem)=> {
        // 现在只兼容到borderType 为range的情况
        // console.log('ele', elem)
        if (elem.rangeType === 'range') {
          let border = this.borderConvert(elem.borderType, elem.style, elem.color)
          let rang = elem.range[0]
          // console.log('range', rang)
          let row = rang.row
          let column = rang.column
          for (let i = row[0] + 1; i < row[1] + 2; i++) {
            for (let y = column[0] + 1; y < column[1] + 2; y++) {
              worksheet.getCell(i, y).border = border
            }
          }
        }
        if (elem.rangeType === 'cell') {
          // col_index: 2
          // row_index: 1
          // b: {
          //   color: '#d0d4e3'
          //   style: 1
          // }
          const { col_index, row_index } = elem.value
          const borderData = Object.assign({}, elem.value)
          delete borderData.col_index
          delete borderData.row_index
          let border = this.addborderToCell(borderData, row_index, col_index)
          // console.log('bordre', border, borderData)
          worksheet.getCell(row_index + 1, col_index + 1).border = border
        }
        // console.log(rang.column_focus + 1, rang.row_focus + 1)
        // worksheet.getCell(rang.row_focus + 1, rang.column_focus + 1).border = border
      })
    }


    setStyleAndValue(cellArr, worksheet){
      console.log('settting values cellArr',cellArr);
      if (!Array.isArray(cellArr)) return
      _.map(cellArr,(row, rowid)=> {
        _.map(row, (cell, columnid) => {
          if (!cell) return true
          let fill = this.fillConvert(cell.bg)
    
          let font = this.fontConvert(
            cell.ff,
            cell.fc,
            cell.bl,
            cell.it,
            cell.fs,
            cell.cl,
            cell.ul
          )
          let alignment = this.alignmentConvert(cell.vt, cell.ht, cell.tb, cell.tr)
          let value = ''
    
          console.log('cell',cell);
          if (cell.f) {
            value = { formula: cell.f, result: cell.v }
          } else if (!cell.v && cell.ct && cell.ct.s) {
            // xls转为xlsx之后，内部存在不同的格式，都会进到富文本里，即值不存在与cell.v，而是存在于cell.ct.s之后
            // value = cell.ct.s[0].v
            cell.ct.s.forEach(arr => {
              value += arr.v
            })
          } else {
            value = cell.v
          }
          //  style 填入到_value中可以实现填充色
          let letter = this.createCellPos(columnid)
          let target = worksheet.getCell(letter + (rowid + 1))
          // console.log('1233', letter + (rowid + 1))
          for (const key in fill) {
            target.fill = fill
            break
          }
          target.font = font
          target.alignment = alignment
          target.value = value
    
          return true
        })
      })
    }

    fillConvert(bg) {
      if (!bg) {
        return {}
      }
      // const bgc = bg.replace('#', '')
      let fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: bg.replace('#', '') }
      }
      return fill
    }
    
    fontConvert(
      ff = 0,
      fc = '#000000',
      bl = 0,
      it = 0,
      fs = 10,
      cl = 0,
      ul = 0
    ) {
      // luckysheet：ff(样式), fc(颜色), bl(粗体), it(斜体), fs(大小), cl(删除线), ul(下划线)
      const luckyToExcel = {
        0: '微软雅黑',
        1: '宋体（Song）',
        2: '黑体（ST Heiti）',
        3: '楷体（ST Kaiti）',
        4: '仿宋（ST FangSong）',
        5: '新宋体（ST Song）',
        6: '华文新魏',
        7: '华文行楷',
        8: '华文隶书',
        9: 'Arial',
        10: 'Times New Roman ',
        11: 'Tahoma ',
        12: 'Verdana',
        num2bl: function(num) {
          return num === 0 ? false : true
        }
      }
      // 出现Bug，导入的时候ff为luckyToExcel的val
    
      let font = {
        name: typeof ff === 'number' ? luckyToExcel[ff] : ff,
        family: 1,
        size: fs,
        color: { argb: fc.replace('#', '') },
        bold: luckyToExcel.num2bl(bl),
        italic: luckyToExcel.num2bl(it),
        underline: luckyToExcel.num2bl(ul),
        strike: luckyToExcel.num2bl(cl)
      }
    
      return font
    }
    
    alignmentConvert(
      vt = 'default',
      ht = 'default',
      tb = 'default',
      tr = 'default'
    ) {
      // luckysheet:vt(垂直), ht(水平), tb(换行), tr(旋转)
      const luckyToExcel = {
        vertical: {
          0: 'middle',
          1: 'top',
          2: 'bottom',
          default: 'top'
        },
        horizontal: {
          0: 'center',
          1: 'left',
          2: 'right',
          default: 'left'
        },
        wrapText: {
          0: false,
          1: false,
          2: true,
          default: false
        },
        textRotation: {
          0: 0,
          1: 45,
          2: -45,
          3: 'vertical',
          4: 90,
          5: -90,
          default: 0
        }
      }
    
      let alignment = {
        vertical: luckyToExcel.vertical[vt],
        horizontal: luckyToExcel.horizontal[ht],
        wrapText: luckyToExcel.wrapText[tb],
        textRotation: luckyToExcel.textRotation[tr]
      }
      return alignment
    }
    
    borderConvert(borderType, style = 1, color = '#000') {
      // 对应luckysheet的config中borderinfo的的参数
      if (!borderType) {
        return {}
      }
      const luckyToExcel = {
        type: {
          'border-all': 'all',
          'border-top': 'top',
          'border-right': 'right',
          'border-bottom': 'bottom',
          'border-left': 'left'
        },
        style: {
          0: 'none',
          1: 'thin',
          2: 'hair',
          3: 'dotted',
          4: 'dashDot', // 'Dashed',
          5: 'dashDot',
          6: 'dashDotDot',
          7: 'double',
          8: 'medium',
          9: 'mediumDashed',
          10: 'mediumDashDot',
          11: 'mediumDashDotDot',
          12: 'slantDashDot',
          13: 'thick'
        }
      }
      let template = {
        style: luckyToExcel.style[style],
        color: { argb: color.replace('#', '') }
      }
      let border = {}
      if (luckyToExcel.type[borderType] === 'all') {
        border['top'] = template
        border['right'] = template
        border['bottom'] = template
        border['left'] = template
      } else {
        border[luckyToExcel.type[borderType]] = template
      }
      // console.log('border', border)
      return border
    }
    
    addborderToCell(borders, row_index, col_index) {
      let border = {}
      const luckyExcel = {
        type: {
          l: 'left',
          r: 'right',
          b: 'bottom',
          t: 'top'
        },
        style: {
          0: 'none',
          1: 'thin',
          2: 'hair',
          3: 'dotted',
          4: 'dashDot', // 'Dashed',
          5: 'dashDot',
          6: 'dashDotDot',
          7: 'double',
          8: 'medium',
          9: 'mediumDashed',
          10: 'mediumDashDot',
          11: 'mediumDashDotDot',
          12: 'slantDashDot',
          13: 'thick'
        }
      }
      // console.log('borders', borders)
      for (const bor in borders) {
        // console.log(bor)
        if (borders[bor].color.indexOf('rgb') === -1) {
          border[luckyExcel.type[bor]] = {
            style: luckyExcel.style[borders[bor].style],
            color: { argb: borders[bor].color.replace('#', '') }
          }
        } else {
          border[luckyExcel.type[bor]] = {
            style: luckyExcel.style[borders[bor].style],
            color: { argb: borders[bor].color }
          }
        }
      }
    
      return border
    }
    
    createCellPos(n) {
      let ordA = 'A'.charCodeAt(0)
    
      let ordZ = 'Z'.charCodeAt(0)
      let len = ordZ - ordA + 1
      let s = ''
      while (n >= 0) {
        s = String.fromCharCode((n % len) + ordA) + s
    
        n = Math.floor(n / len) - 1
      }
      return s
    }

    render() {
      return (
        <WrappedComponent
				  {...this.props}
          uploadProps={this.state.uploadProps}
          import={() => this.import()}
          export={() => this.export()}
        />
      );
    }
  }
};

export default hoc(App);

