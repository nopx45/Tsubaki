import{E as k,r as n,j as e,O as A,aZ as c,a_ as C,q as I,aA as z,aS as L,aC as S,a6 as F,a7 as P,Y as D,b2 as T,b3 as E}from"./index-DQMZ3AmN.js";function O(){const f=k(),[l,d]=n.useState([]),[v,p]=n.useState(!0),[s,j]=n.useState(""),[x,h]=n.useState(1),o=10,g=l.filter(t=>{var i,a;return((i=t.title)==null?void 0:i.toLowerCase().includes(s.toLowerCase()))||((a=t.content)==null?void 0:a.toLowerCase().includes(s.toLowerCase()))||String(t.ID).includes(s)}),b=Math.ceil(l.length/o),m=x*o,w=m-o,y=g.slice(w,m),N=async t=>{if(!window.confirm("คุณแน่ใจที่จะลบกิจกรรมนี้ใช่หรือไม่?"))return;let i=await E(t);i.status===200?(r("success",i.data.message),await u()):r("error",i.data.error)},r=(t,i)=>{const a=document.createElement("div");a.className=`notification ${t}`,a.textContent=i,document.body.appendChild(a),setTimeout(()=>{a.classList.add("show")},10),setTimeout(()=>{a.classList.remove("show"),setTimeout(()=>{document.body.removeChild(a)},300)},3e3)},u=async()=>{p(!0);try{let t=await T();if(t.status===200){const i=t.data.map(a=>({...a,Image:a.image?a.image.split(","):[]}));d(i)}else d([]),r("error",t.data.error)}catch{r("error","เกิดข้อผิดพลาดในการโหลดข้อมูล")}finally{p(!1)}};return n.useEffect(()=>{u()},[]),e.jsxs("div",{className:"activity-management-container",children:[e.jsx(A,{}),e.jsxs("div",{className:"activity-card",children:[e.jsxs("div",{className:"header-section",children:[e.jsxs("div",{className:"title-wrapper",children:[e.jsx(c,{className:"title-icon"}),e.jsx("h1",{children:"จัดการกิจกรรม"})]}),e.jsxs("div",{className:"header-actions",children:[e.jsxs("div",{className:"search-container",children:[e.jsx(C,{className:"search-icon"}),e.jsx("input",{type:"text",placeholder:"ค้นหากิจกรรม...",value:s,onChange:t=>j(t.target.value),className:"search-input"})]}),e.jsxs(I,{to:"/admin/activity/create",className:"create-button",children:[e.jsx(z,{className:"button-icon"}),e.jsx("span",{children:"สร้างกิจกรรม"}),e.jsx("span",{className:"button-hover-effect"})]})]})]}),e.jsx("div",{className:"divider"}),v?e.jsxs("div",{className:"loading-container",children:[e.jsx("div",{className:"loading-spinner"}),e.jsx("p",{children:"กำลังโหลดข้อมูลกิจกรรม..."})]}):e.jsxs("div",{className:"table-container",children:[g.length===0?e.jsx("div",{className:"no-results",children:e.jsx("p",{children:"ไม่พบข้อมูลกิจกรรมที่ตรงกับการค้นหา"})}):e.jsxs("table",{className:"activity-table",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:e.jsxs("div",{className:"header-cell",children:[e.jsx(L,{className:"column-icon"}),e.jsx("span",{children:"ลำดับ"})]})}),e.jsx("th",{children:e.jsxs("div",{className:"header-cell",children:[e.jsx(c,{className:"column-icon"}),e.jsx("span",{children:"ชื่อกิจกรรม"})]})}),e.jsx("th",{children:e.jsxs("div",{className:"header-cell",children:[e.jsx(c,{className:"column-icon"}),e.jsx("span",{children:"รายละเอียด"})]})}),e.jsx("th",{children:e.jsxs("div",{className:"header-cell",children:[e.jsx(S,{className:"column-icon"}),e.jsx("span",{children:"รูปภาพ"})]})}),e.jsx("th",{children:"จัดการ"})]})}),e.jsx("tbody",{children:y.map(t=>e.jsxs("tr",{className:"activity-row",children:[e.jsx("td",{children:e.jsx("span",{className:"id-cell",children:t.ID})}),e.jsx("td",{children:e.jsx("span",{className:"title-cell",children:t.title?t.title.length>30?t.title.substring(0,30)+"...":t.title:"-"})}),e.jsx("td",{children:e.jsx("span",{className:"content-cell",children:t.content?t.content.length>30?t.content.substring(0,30)+"...":t.content:"-"})}),e.jsx("td",{children:t.Image?e.jsx("div",{className:"image-container",children:e.jsx("img",{src:t.Image[0],alt:"รูปภาพกิจกรรม",className:"activity-image"})}):e.jsx("span",{className:"no-image",children:"ไม่มีรูปภาพ"})}),e.jsx("td",{children:e.jsxs("div",{className:"action-buttons",children:[e.jsxs("button",{className:"delete-button",onClick:()=>N(String(t.ID)),title:"ลบกิจกรรม",children:[e.jsx(F,{}),e.jsx("span",{className:"tooltip",children:"ลบ"}),e.jsx("span",{className:"button-hover-effect"})]}),e.jsxs("button",{className:"edit-button",onClick:()=>f(`/admin/activity/edit/${t.ID}`),title:"แก้ไขกิจกรรม",children:[e.jsx(P,{}),e.jsx("span",{className:"tooltip",children:"แก้ไข"}),e.jsx("span",{className:"button-hover-effect"})]})]})})]},t.ID))})]}),e.jsx(D,{currentPage:x,totalPages:b,onNext:()=>h(t=>Math.min(t+1,b)),onPrev:()=>h(t=>Math.max(t-1,1))})]})]}),e.jsx("style",{children:`
        .activity-management-container {
          font-family: 'Mali', Tahoma, Geneva, Verdana, sans-serif;
          min-height: 100vh;
          border-radius: 20px;
          padding: 30px;
          background: linear-gradient(135deg, #f0f4f8 0%, #e0e8f5 100%);
        }
        
        .activity-card {
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
        
        .activity-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(106, 17, 203, 0.2);
        }
        
        .activity-card::before {
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
          margin-bottom: 20px;
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
        
        .activity-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          border-radius: 12px;
          overflow: hidden;
        }
        
        .activity-table th {
          background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
          color: #2c3e50;
          font-weight: 600;
          padding: 16px 12px;
          text-align: left;
          position: sticky;
          top: 0;
          z-index: 10;
        }
        
        .activity-table td {
          padding: 7px 12px;
          border-bottom: 1px solid #f0f0f0;
          transition: all 0.2s ease;
        }
        
        .activity-table tr:last-child td {
          border-bottom: none;
        }
        
        .activity-table tr:hover td {
          background: rgba(106, 17, 203, 0.03);
        }
        
        .activity-row {
          transition: all 0.3s ease;
        }
        
        .activity-row:hover {
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
        
        .title-cell, .content-cell {
          font-weight: 500;
          color: #2c3e50;
        }
        
        .no-image {
          color: #999;
          font-style: italic;
        }
        
        .image-container {
          position: relative;
          width: 40px;
          height: 40px;
          margin: 0 auto;
          border-radius: 8px;
          overflow: hidden;
        }
        
        .activity-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        
        .image-container:hover .activity-image {
          transform: scale(1.1);
        }
        
        .image-container:hover .image-hover {
          opacity: 1;
        }
        
        .no-results {
          text-align: center;
          padding: 40px;
          color: #666;
          font-size: 16px;
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
          .activity-card {
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
        }
      `})]})}export{O as default};
