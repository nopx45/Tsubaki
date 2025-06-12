import{E as I,r as s,aQ as f,j as e,aZ as j,a_ as S,q as D,aA as z,a$ as c,aS as F,a6 as L,a7 as P,Y as T,b0 as Y,b1 as E}from"./index-DQMZ3AmN.js";function X(){const w=I(),[l,d]=s.useState([]),[v,p]=s.useState(!0),[i,N]=s.useState(""),y=localStorage.getItem("id"),[x,h]=s.useState(1),r=12;f.locale("th");const k=async t=>{if(!window.confirm("คุณแน่ใจที่จะลบประกาศนี้ใช่หรือไม่?"))return;let n=await E(t);n.status===200?(o("success",n.data.message),await m()):o("error",n.data.error)},o=(t,n)=>{const a=document.createElement("div");a.className=`notification ${t}`,a.textContent=n,document.body.appendChild(a),setTimeout(()=>{a.classList.add("show")},10),setTimeout(()=>{a.classList.remove("show"),setTimeout(()=>{document.body.removeChild(a)},300)},3e3)},m=async()=>{p(!0);try{let t=await Y();t.status===200?d(t.data):(d([]),o("error",t.data.error))}catch{o("error","เกิดข้อผิดพลาดในการโหลดข้อมูล")}finally{p(!1)}};s.useEffect(()=>{m()},[]);const A=l.filter(t=>{var n,a;return((n=t.title)==null?void 0:n.toLowerCase().includes(i.toLowerCase()))||((a=t.content)==null?void 0:a.toLowerCase().includes(i.toLowerCase()))||String(t.ID).includes(i)}),u=Math.ceil(l.length/r),b=x*r,C=b-r,g=A.slice(C,b);return e.jsxs("div",{className:"announcement-container",children:[e.jsxs("div",{className:"announcement-card",children:[e.jsxs("div",{className:"header-section",children:[e.jsxs("div",{className:"title-wrapper",children:[e.jsx(j,{className:"title-icon"}),e.jsx("h1",{children:"จัดการประกาศบริษัทฯ"})]}),e.jsxs("div",{className:"header-actions",children:[e.jsxs("div",{className:"search-container",children:[e.jsx(S,{className:"search-icon"}),e.jsx("input",{type:"text",placeholder:"ค้นหาประกาศ...",value:i,onChange:t=>N(t.target.value),className:"search-input"})]}),e.jsxs(D,{to:"/admin/announcement/create",className:"create-button",children:[e.jsx(z,{className:"button-icon"}),e.jsx("span",{children:"สร้างประกาศ"}),e.jsx("span",{className:"button-hover-effect"})]})]})]}),e.jsx("div",{className:"divider"}),v?e.jsxs("div",{className:"loading-container",children:[e.jsx("div",{className:"loading-spinner"}),e.jsx("p",{children:"กำลังโหลดข้อมูลประกาศ..."})]}):e.jsx("div",{className:"table-container",children:e.jsxs("table",{className:"announcement-table",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:e.jsxs("div",{className:"header-cell",children:[e.jsx(c,{className:"column-icon"}),e.jsx("span",{children:"ประกาศฉบับที่"})]})}),e.jsx("th",{children:e.jsxs("div",{className:"header-cell",children:[e.jsx(F,{className:"column-icon"}),e.jsx("span",{children:"วันที่แก้ไขล่าสุด"})]})}),e.jsx("th",{children:e.jsxs("div",{className:"header-cell",children:[e.jsx(j,{className:"column-icon"}),e.jsx("span",{children:"ชื่อประกาศ"})]})}),e.jsx("th",{children:e.jsxs("div",{className:"header-cell",children:[e.jsx(c,{className:"column-icon"}),e.jsx("span",{children:"รายละเอียด"})]})}),e.jsx("th",{children:e.jsxs("div",{className:"header-cell",children:[e.jsx(c,{className:"column-icon"}),e.jsx("span",{children:"ID ไฟล์ประกาศ"})]})}),e.jsx("th",{children:"จัดการ"})]})}),e.jsx("tbody",{children:g.length>0?g.map(t=>e.jsxs("tr",{className:"announce-row",children:[e.jsx("td",{children:e.jsx("span",{className:"id-cell",children:t.ID})}),e.jsx("td",{children:e.jsx("span",{className:"date-cell",children:f(t.UpdatedAt).format("DD/MM/YYYY HH:mm")})}),e.jsx("td",{children:e.jsx("span",{className:"title-cell",children:t.title})}),e.jsx("td",{children:e.jsx("span",{className:"content-cell",children:t.content})}),e.jsx("td",{children:e.jsx("span",{className:"file-cell",children:t.file_id})}),e.jsx("td",{children:e.jsxs("div",{className:"action-buttons",children:[Number(y)!==(t==null?void 0:t.ID)&&e.jsxs("button",{className:"delete-button",onClick:()=>k(String(t.ID)),title:"ลบประกาศ",children:[e.jsx(L,{}),e.jsx("span",{className:"tooltip",children:"ลบ"}),e.jsx("span",{className:"button-hover-effect"})]}),e.jsxs("button",{className:"edit-button",onClick:()=>w(`/admin/announcement/edit/${t.ID}`),title:"แก้ไขประกาศ",children:[e.jsx(P,{}),e.jsx("span",{className:"tooltip",children:"แก้ไข"}),e.jsx("span",{className:"button-hover-effect"})]})]})})]},t.ID)):e.jsx("tr",{children:e.jsx("td",{colSpan:6,className:"empty-message",children:"ไม่พบข้อมูลประกาศ"})})})]})}),e.jsx(T,{currentPage:x,totalPages:u,onNext:()=>h(t=>Math.min(t+1,u)),onPrev:()=>h(t=>Math.max(t-1,1))})]}),e.jsx("style",{children:`
        .announcement-container {
          font-family: 'Mali', Tahoma, Geneva, Verdana, sans-serif;
          min-height: 100vh;
          max-width: 100%;
          border-radius: 20px;
          padding: 30px;
          background: linear-gradient(135deg, #f0f4f8 0%, #e0e8f5 100%);
        }
        
        .announcement-card {
          max-width: 1200px;
          margin: 0 auto;
          background: white;
          border-radius: 16px;
          padding: 30px;
          box-shadow: 0 15px 35px rgba(106, 17, 203, 0.15);
          transition: transform 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .announcement-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(106, 17, 203, 0.2);
        }
        
        .announcement-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 5px;
          background: linear-gradient(90deg, #6a11cb 0%, #2575fc 100%);
        }
        
        .header-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
        }
        
        .title-wrapper {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        
        .title-wrapper h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 700;
          background: linear-gradient(to right, #6a11cb 0%, #2575fc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .title-icon {
          font-size: 32px;
          color: #6a11cb;
          background: rgba(106, 17, 203, 0.1);
          padding: 12px;
          border-radius: 50%;
        }
        
        .header-actions {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        
        .search-container {
          position: relative;
          display: flex;
          align-items: center;
        }
        
        .search-icon {
          position: absolute;
          left: 15px;
          color: #6a11cb;
          font-size: 16px;
        }
        
        .search-input {
          padding: 10px 15px 10px 40px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.3s ease;
          width: 250px;
        }
        
        .search-input:focus {
          outline: none;
          border-color: #6a11cb;
          box-shadow: 0 0 0 3px rgba(106, 17, 203, 0.1);
        }
        
        .create-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(106, 17, 203, 0.3);
          position: relative;
          overflow: hidden;
        }
        
        .create-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(106, 17, 203, 0.4);
        }
        
        .button-icon {
          font-size: 16px;
        }
        
        .button-hover-effect {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .create-button:hover .button-hover-effect {
          opacity: 1;
        }
        
        .divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(106, 17, 203, 0.1), transparent);
          margin: 25px 0;
        }
        
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 0;
        }
        
        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 5px solid rgba(106, 17, 203, 0.1);
          border-radius: 50%;
          border-top-color: #6a11cb;
          animation: spin 1s ease-in-out infinite;
          margin-bottom: 20px;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .table-container {
          overflow-x: auto;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }
        
        .announcement-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          border-radius: 12px;
          overflow: hidden;
        }
        
        .announcement-table th {
          background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
          color: #2c3e50;
          font-weight: 600;
          padding: 16px 12px;
          text-align: left;
          position: sticky;
          top: 0;
          z-index: 10;
        }
        
        .announcement-table td {
          padding: 7px 12px;
          border-bottom: 1px solid #f0f0f0;
          transition: all 0.2s ease;
        }
        
        .announcement-table tr:last-child td {
          border-bottom: none;
        }
        
        .announcement-table tr:hover td {
          background: rgba(106, 17, 203, 0.03);
        }
        
        .announce-row {
          transition: all 0.3s ease;
        }
        
        .announce-row:hover {
          transform: translateX(5px);
        }
        
        .header-cell {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .column-icon {
          color: #6a11cb;
          font-size: 16px;
        }
        
        .id-cell {
          font-weight: bold;
          color: #2575fc;
          background: rgba(37, 117, 252, 0.1);
          padding: 4px 8px;
          border-radius: 4px;
        }
        
        .date-cell {
          color: #6a11cb;
          font-weight: 500;
        }
        
        .title-cell {
          font-weight: 500;
          color: #2c3e50;
        }
        
        .content-cell {
          color: #666;
          max-width: 300px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          display: inline-block;
        }
        
        .file-cell {
          color: #2575fc;
          font-weight: 500;
        }
        
        .empty-message {
          text-align: center;
          padding: 20px;
          color: #666;
        }
        
        .action-buttons {
          display: flex;
          gap: 10px;
          justify-content: center;
        }
        
        .edit-button, .delete-button {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;
          overflow: hidden;
        }
        
        .edit-button {
          background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
          color: white;
        }
        
        .delete-button {
          background: linear-gradient(135deg, #ff5e62 0%, #ff9966 100%);
          color: white;
        }
        
        .edit-button:hover, .delete-button:hover {
          transform: scale(1.1);
        }
        
        .edit-button .tooltip, .delete-button .tooltip {
          position: absolute;
          top: -30px;
          left: 50%;
          transform: translateX(-50%);
          background: #2c3e50;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          opacity: 0;
          visibility: hidden;
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        
        .edit-button:hover .tooltip, .delete-button:hover .tooltip {
          opacity: 1;
          visibility: visible;
          top: -40px;
        }
        
        .notification {
          position: fixed;
          top: 20px;
          right: 20px;
          padding: 15px 25px;
          border-radius: 8px;
          color: white;
          font-weight: 500;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          transform: translateX(100%);
          opacity: 0;
          transition: all 0.3s ease;
          z-index: 1000;
        }
        
        .notification.show {
          transform: translateX(0);
          opacity: 1;
        }
        
        .notification.success {
          background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
        }
        
        .notification.error {
          background: linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%);
        }
        
        @media (max-width: 768px) {
          .announcement-card {
            padding: 20px;
          }
          
          .header-section {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .header-actions {
            width: 100%;
            flex-direction: column;
            align-items: flex-start;
          }
          
          .search-input {
            width: 100%;
          }
          
          .create-button {
            width: 100%;
            justify-content: center;
          }
          
          .content-cell {
            max-width: 150px;
          }
        }
      `})]})}export{X as default};
