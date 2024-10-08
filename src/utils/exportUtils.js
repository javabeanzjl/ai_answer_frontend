import jsPDF from 'jspdf';
import Papa from 'papaparse';
import html2canvas from 'html2canvas';
import ReactDOMServer from 'react-dom/server';
import {QRCode} from "antd";

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

export const generatePoster = async () => {
  // 创建一个隐藏的DOM元素，用于生成海报
  const posterContent = document.createElement('div');
  posterContent.style.position = 'fixed';
  posterContent.style.left = '-9999px';
  posterContent.style.top = '-9999px';
  posterContent.style.width = '600px'; // 设置海报宽度
  posterContent.style.height = '800px'; // 设置海报高度
  posterContent.style.backgroundColor = '#fff'; // 设置海报背景颜色
  posterContent.style.padding = '20px';
  posterContent.style.boxSizing = 'border-box';

  // 设置海报内容，包括二维码和应用介绍
  posterContent.innerHTML = ReactDOMServer.renderToString(
    <div style={{ textAlign: 'center' }}>
      <h1 style={{ margin: 0, padding: '20px 0' }}>你的应用名称</h1>
      <p style={{ fontSize: '16px', padding: '0 0 20px' }}>这里是应用介绍...</p>
      <QRCode value="https://hao.123.com" size={128} />
    </div>
  );

  document.body.appendChild(posterContent);

  // 使用html2canvas生成海报图片
  const canvas = await html2canvas(posterContent, {
    logging: false, // 禁用日志输出
    scale: 2, // 提高图片质量
    useCORS: true // 如果海报内容包含跨域图片，则需要启用CORS
  });

  // 转换canvas为图片并获取图片数据URL
  const posterImage = canvas.toDataURL('image/png');

  // 清理创建的DOM元素
  document.body.removeChild(posterContent);

  return posterImage; // 返回海报图片数据URL
};
export const displayOrDownloadPoster = (posterImage) => {
  // 这里可以根据需求处理海报图片，例如显示在模态框中或直接下载
  const img = new Image();
  img.src = posterImage;
  img.style.width = '100%'; // 根据需要调整大小
  document.body.appendChild(img); // 显示图片
  // 创建下载链接
  const link = document.createElement('a');
  link.href = posterImage;
  link.download = '应用分享海报.png';
  link.click();
};
