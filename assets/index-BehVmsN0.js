import{E as D,aQ as y,r as s,j as e,O as $,aR as c,V as I,q as L,aA as Y,aS as F,aT as P,aC as T,a6 as E,a7 as A,Y as H,aU as O,aV as R}from"./index-DQMZ3AmN.js";function B(){const v=D();y.locale("th");const[l,d]=s.useState([]),[N,p]=s.useState(!0),[n,k]=s.useState(""),[S,x]=s.useState(null),h=l.filter(t=>{var a,i;return((a=t.title)==null?void 0:a.toLowerCase().includes(n.toLowerCase()))||((i=t.content)==null?void 0:i.toLowerCase().includes(n.toLowerCase()))||String(t.ID).includes(n)}),[u,g]=s.useState(1),o=10,b=Math.ceil(h.length/o),f=u*o,M=f-o,C=h.slice(M,f),r=(t,a)=>{const i=document.createElement("div");i.className=`notification ${t}`,i.innerHTML=`
      <span class="notification-icon">${t==="success"?"✓":"✗"}</span>
      <span>${a}</span>
    `,document.body.appendChild(i),setTimeout(()=>{i.classList.add("show")},10),setTimeout(()=>{i.classList.remove("show"),setTimeout(()=>{document.body.removeChild(i)},300)},3e3)},z=async t=>{if(!window.confirm("คุณแน่ใจที่จะลบบทความนี้ใช่หรือไม่?"))return;let a=await R(t);a.status===200?(r("success",a.data.message),await m()):r("error",a.data.error)},m=async()=>{p(!0);try{let t=await O();t.status===200?d(t.data):(d([]),r("error",t.data.error))}catch{r("error","เกิดข้อผิดพลาดในการโหลดข้อมูล")}finally{p(!1)}};return s.useEffect(()=>{m()},[]),e.jsxs("div",{className:"security-management-container",children:[e.jsx($,{}),e.jsxs("div",{className:"security-card",children:[e.jsxs("div",{className:"header-section",children:[e.jsxs("div",{className:"title-wrapper",children:[e.jsx(c,{className:"title-icon"}),e.jsx("h1",{children:"จัดการข่าวสารด้านความปลอดภัย"})]}),e.jsxs("div",{className:"search-container",children:[e.jsx(I,{className:"search-icon"}),e.jsx("input",{type:"text",placeholder:"ค้นหาข่าวสาร...",value:n,onChange:t=>k(t.target.value),className:"search-input"}),e.jsx("div",{className:"search-underline"})]}),e.jsxs(L,{to:"/admin/security/create",className:"create-button",children:[e.jsx(Y,{className:"button-icon"}),e.jsx("span",{children:"สร้างข้อมูล"}),e.jsx("div",{className:"button-hover-effect"})]})]}),e.jsx("div",{className:"divider"}),N?e.jsxs("div",{className:"loading-container",children:[e.jsx("div",{className:"loading-spinner"}),e.jsx("p",{children:"กำลังโหลดข้อมูล..."})]}):e.jsx("div",{className:"table-container",children:l.length===0?e.jsxs("div",{className:"no-results",children:[e.jsx("img",{src:"/no-results.png",alt:"No results",className:"no-results-image"}),e.jsx("h3",{children:"ไม่พบข้อมูลบทความ"}),e.jsx("p",{children:"ลองสร้างบทความใหม่หรือรีเฟรชหน้าเว็บ"})]}):e.jsxs("table",{className:"security-table",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:e.jsxs("div",{className:"header-cell",children:[e.jsx(F,{className:"column-icon"}),e.jsx("span",{children:"วันที่สร้าง"})]})}),e.jsx("th",{children:e.jsxs("div",{className:"header-cell",children:[e.jsx(P,{className:"column-icon"}),e.jsx("span",{children:"ไอดี"})]})}),e.jsx("th",{children:e.jsxs("div",{className:"header-cell",children:[e.jsx(c,{className:"column-icon"}),e.jsx("span",{children:"หัวข้อ"})]})}),e.jsx("th",{children:e.jsxs("div",{className:"header-cell",children:[e.jsx(c,{className:"column-icon"}),e.jsx("span",{children:"รายละเอียด"})]})}),e.jsx("th",{children:e.jsxs("div",{className:"header-cell",children:[e.jsx(T,{className:"column-icon"}),e.jsx("span",{children:"รูปภาพ"})]})}),e.jsx("th",{children:"จัดการ"})]})}),e.jsx("tbody",{children:C.map(t=>{var a,i,j,w;return e.jsxs("tr",{className:`security-row ${S===t.ID?"hovered":""}`,onMouseEnter:()=>x(t.ID??0),onMouseLeave:()=>x(null),children:[e.jsx("td",{children:e.jsx("span",{className:"id-cell",children:y(t.created_at).format("DD/MM/YYYY HH:mm")})}),e.jsx("td",{children:e.jsx("span",{className:"id-cell",children:t.ID})}),e.jsx("td",{children:e.jsx("span",{className:"title-cell",children:(((a=t.title)==null?void 0:a.length)??0)>30?`${(i=t.title)==null?void 0:i.substring(0,30)}...`:t.title})}),e.jsx("td",{children:e.jsx("span",{className:"content-cell",children:(((j=t.content)==null?void 0:j.length)??0)>30?`${(w=t.content)==null?void 0:w.substring(0,30)}...`:t.content})}),e.jsx("td",{children:t.thumbnail?e.jsx("div",{className:"image-container",children:e.jsx("img",{src:t.thumbnail,alt:"รูปภาพบทความ",className:"security-image"})}):e.jsx("span",{className:"no-image",children:"ไม่มีรูปภาพ"})}),e.jsx("td",{children:e.jsxs("div",{className:"action-buttons",children:[e.jsxs("button",{className:"delete-button",onClick:()=>z(String(t.ID)),title:"ลบบทความ",children:[e.jsx(E,{}),e.jsx("span",{className:"tooltip",children:"ลบ"}),e.jsx("span",{className:"button-hover-effect"})]}),e.jsxs("button",{className:"edit-button",onClick:()=>v(`/admin/security/edit/${t.ID}`),title:"แก้ไขบทความ",children:[e.jsx(A,{}),e.jsx("span",{className:"tooltip",children:"แก้ไข"}),e.jsx("span",{className:"button-hover-effect"})]})]})})]},t.ID)})})]})}),e.jsx(H,{currentPage:u,totalPages:b,onNext:()=>g(t=>Math.min(t+1,b)),onPrev:()=>g(t=>Math.max(t-1,1))})]}),e.jsx("div",{className:"floating-bubbles",children:[...Array(15)].map((t,a)=>e.jsx("div",{className:"bubble",style:{left:`${Math.random()*100}%`,animationDuration:`${10+Math.random()*20}s`,animationDelay:`${Math.random()*5}s`,width:`${10+Math.random()*20}px`,height:`${10+Math.random()*20}px`,opacity:.2+Math.random()*.5}},a))}),e.jsx("style",{children:`
        .security-management-container {
          min-height: 100vh;
          border-radius: 20px;
          padding: 30px;
          background: linear-gradient(135deg, #f0f4f8 0%, #e0e8f5 100%);
          position: relative;
          overflow: hidden;
        }
        
        .security-card {
          max-width: 1200px;
          margin: 0 auto;
          background: white;
          border-radius: 20px;
          padding: 30px;
          border-left: 0;
          box-shadow: 0 15px 35px rgba(106, 17, 203, 0.15);
          transition: transform 0.3s ease;
          position: relative;
          z-index: 1;
          overflow: hidden;
        }
        
        .security-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(106, 17, 203, 0.2);
        }
        
        .security-card::before {
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
        
        .search-container {
          position: relative;
        }
        
        .search-icon {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #6a11cb;
          font-size: 16px;
        }
        
        .search-input {
          padding: 12px 15px 12px 40px;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.3s ease;
          width: 250px;
          background-color: #f5f7fa;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
        }
        
        .search-input:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(106, 17, 203, 0.1);
        }
        
        .search-underline {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #6a11cb, #2575fc);
          transition: width 0.3s ease;
        }
        
        .search-input:focus ~ .search-underline {
          width: 100%;
        }

        .search-container {
          position: relative;
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
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: all 0.6s ease;
        }
        
        .create-button:hover .button-hover-effect {
          left: 100%;
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
        
        .security-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          border-radius: 12px;
          overflow: hidden;
        }
        
        .security-table th {
          background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
          color: #2c3e50;
          font-weight: 600;
          padding: 16px 12px;
          text-align: left;
          position: sticky;
          top: 0;
          z-index: 10;
        }
        
        .security-table td {
          padding: 7px;
          border-bottom: 1px solid #f0f0f0;
          transition: all 0.3s ease;
        }
        
        .security-table tr:last-child td {
          border-bottom: none;
        }
        
        .security-row:hover td {
          background: rgba(106, 17, 203, 0.03);
        }
        
        .security-row.hovered {
          transform: translateX(5px);
          box-shadow: 0 5px 15px rgba(106, 17, 203, 0.1);
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
          padding: 6px 10px;
          border-radius: 20px;
          display: inline-block;
        }
        
        .title-cell, .content-cell {
          font-weight: 500;
          color: #2c3e50;
        }
        
        .no-image {
          color: #999;
          font-style: italic;
          padding: 6px 10px;
          background: #f5f5f5;
          border-radius: 4px;
          display: inline-block;
        }
        
        .image-container {
          position: relative;
          width: 50px;
          height: 50px;
          margin: 0 auto;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
        }
        
        .security-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        
        .image-hover {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(106, 17, 203, 0.7);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
          font-size: 12px;
        }
        
        .image-container:hover .security-image {
          transform: scale(1.1);
        }
        
        .image-container:hover .image-hover {
          opacity: 1;
        }
        
        .no-results {
          text-align: center;
          padding: 40px;
        }
        
        .no-results-image {
          width: 200px;
          height: auto;
          margin-bottom: 20px;
          opacity: 0.7;
        }
        
        .no-results h3 {
          color: #6a11cb;
          margin-bottom: 10px;
        }
        
        .no-results p {
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
          background: linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%);
          color: white;
        }
        
        .edit-button:hover, .delete-button:hover {
          transform: scale(1.1);
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
        }
        
        .tooltip {
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
          display: flex;
          align-items: center;
          gap: 10px;
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
        
        .notification-icon {
          font-weight: bold;
        }
        
        .floating-bubbles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 0;
        }
        
        .bubble {
          position: absolute;
          bottom: -100px;
          background: linear-gradient(135deg, rgba(106, 17, 203, 0.2), rgba(37, 117, 252, 0.2));
          border-radius: 50%;
          animation: float-up linear infinite;
        }
        
        @keyframes float-up {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.5;
          }
          100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
          }
        }
        
        @media (max-width: 768px) {
          .security-management-container {
            padding: 15px;
          }
          
          .security-card {
            padding: 25px;
          }
          
          .header-section {
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
      `})]})}export{B as default};
