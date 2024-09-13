import jsPDF from 'jspdf';
import Papa from 'papaparse';
import html2canvas from 'html2canvas';

export const exportPDF = (data) => {
  // 创建一个新的PDF文档
  const doc = new jsPDF();

  // 创建一个临时的HTML元素来显示中文内容
  const tempElement = document.createElement('div');
  tempElement.style.width = '200px'; // 设置宽度以适应PDF页面
  tempElement.style.height = 'auto';
  tempElement.style.position = 'absolute';
  tempElement.style.left = '-9999px'; // 隐藏元素

  // 将数据添加到HTML元素
  let content = '';
  for (const [key, value] of Object.entries(data)) {
    content += `<p>${key}:${value}</p>`;
  }
  tempElement.innerHTML = content;

  // 将HTML元素添加到文档中
  document.body.appendChild(tempElement);

  // 使用html2canvas将HTML内容转换为图片
  html2canvas(tempElement, {scale: 2}).then(canvas => {


    // 将图片添加到PDF中
    const imgData = canvas.toDataURL('image/png');
    doc.addImage(imgData, 'PNG', 10, 10, 180, canvas.height * 180 / canvas.width);

    // 保存PDF文件
    doc.save('report.pdf');

    // 清理：移除临时的HTML元素
    document.body.removeChild(tempElement);
  });
}
export const exportCSV = (data) => {
  const csv = Papa.unparse([data]);
  const blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
  const link = document.createElement('a');
  if (link.download !== undefined) { // feature detection
    // Browsers that support HTML5 download attribute
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'report.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
