import{E as k,r as s,j as e,bk as L,a_ as C,q as D,aA as z,aQ as u,a6 as I,a7 as S,Y as P,bl as T,bm as Y}from"./index-DQMZ3AmN.js";u.locale("th");function F(){const f=k(),[m,c]=s.useState([]),[v,d]=s.useState(!0),[n,j]=s.useState(""),[p,x]=s.useState(1),o=20,l=m.filter(t=>{var i,a;return((i=t.name)==null?void 0:i.toLowerCase().includes(n.toLowerCase()))||((a=t.link_url)==null?void 0:a.toLowerCase().includes(n.toLowerCase()))||String(t.ID).includes(n)}),h=Math.ceil(l.length/o),b=p*o,w=b-o,y=l.slice(w,b),r=(t,i)=>{const a=document.createElement("div");a.className=`notification ${t}`,a.textContent=i,document.body.appendChild(a),setTimeout(()=>a.classList.add("show"),10),setTimeout(()=>{a.classList.remove("show"),setTimeout(()=>{document.body.removeChild(a)},300)},3e3)},N=async t=>{if(!window.confirm("คุณแน่ใจว่าจะลบข้อมูลนี้หรือไม่?"))return;const i=await Y(t);i.status===200?(r("success",i.data.message),await g()):r("error",i.data.error)},g=async()=>{d(!0);try{let t=await T();t.status===200?c(t.data):(c([]),r("error",t.data.error))}catch{r("error","เกิดข้อผิดพลาดในการโหลดข้อมูล")}finally{d(!1)}};return s.useEffect(()=>{g()},[]),e.jsxs("div",{className:"activity-management-container",children:[e.jsxs("div",{className:"activity-card",children:[e.jsxs("div",{className:"header-section",children:[e.jsxs("div",{className:"title-wrapper",children:[e.jsx(L,{className:"title-icon"}),e.jsx("h1",{children:"จัดการเว็บศูนย์กลาง (Central Web)"})]}),e.jsxs("div",{className:"header-actions",children:[e.jsxs("div",{className:"search-container",children:[e.jsx(C,{className:"search-icon"}),e.jsx("input",{type:"text",placeholder:"ค้นหา...",value:n,onChange:t=>j(t.target.value),className:"search-input"})]}),e.jsxs(D,{to:"/admin/central-web/create",className:"create-button",children:[e.jsx(z,{className:"button-icon"}),e.jsx("span",{children:"เพิ่มเว็บไซต์"}),e.jsx("span",{className:"button-hover-effect"})]})]})]}),e.jsx("div",{className:"divider"}),v?e.jsxs("div",{className:"loading-container",children:[e.jsx("div",{className:"loading-spinner"}),e.jsx("p",{children:"กำลังโหลดข้อมูล..."})]}):e.jsxs("div",{className:"table-container",children:[l.length===0?e.jsx("div",{className:"no-results",children:"ไม่พบข้อมูล"}):e.jsxs("table",{className:"activity-table",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:e.jsx("div",{className:"header-cell",children:"ID"})}),e.jsx("th",{children:e.jsx("div",{className:"header-cell",children:"วันที่แก้ไขล่าสุด"})}),e.jsx("th",{children:e.jsx("div",{className:"header-cell",children:"ชื่อเว็บไซต์"})}),e.jsx("th",{children:e.jsx("div",{className:"header-cell",children:"URL เว็บไซต์"})}),e.jsx("th",{children:e.jsx("div",{className:"header-cell",children:"จัดการ"})})]})}),e.jsx("tbody",{children:y.map(t=>{var i,a;return e.jsxs("tr",{className:"activity-row",children:[e.jsx("td",{children:e.jsx("span",{className:"id-cell",children:t.ID})}),e.jsx("td",{children:u(t.UpdatedAt).format("DD/MM/YYYY HH:mm")}),e.jsx("td",{children:t.name}),e.jsx("td",{children:((i=t.link_url)==null?void 0:i.length)??!1?`${(a=t.link_url)==null?void 0:a.slice(0,60)}...`:t.link_url}),e.jsx("td",{children:e.jsxs("div",{className:"action-buttons",children:[e.jsxs("button",{className:"delete-button",onClick:()=>N(String(t.ID)),children:[e.jsx(I,{}),e.jsx("span",{className:"tooltip",children:"ลบ"})]}),e.jsxs("button",{className:"edit-button",onClick:()=>f(`/admin/central-web/edit/${t.ID}`),children:[e.jsx(S,{}),e.jsx("span",{className:"tooltip",children:"แก้ไข"})]})]})})]},t.ID)})})]}),e.jsx(P,{currentPage:p,totalPages:h,onNext:()=>x(t=>Math.min(t+1,h)),onPrev:()=>x(t=>Math.max(t-1,1))})]})]}),e.jsx("style",{children:`
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

        .activity-row {
          transition: all 0.3s ease;
        }

        .activity-row:hover {
          transform: translateX(5px);
          background: rgba(106, 17, 203, 0.03);
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

        .edit-button:hover .tooltip,
        .delete-button:hover .tooltip {
          opacity: 1;
          visibility: visible;
          top: -40px;
        }
      `})]})}export{F as default};
