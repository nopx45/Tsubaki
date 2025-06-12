import{r as o,aQ as a,j as e,bB as L,a_ as O,a6 as _,Y as F,bC as R,bD as V}from"./index-Wslmr7s8.js";import{i as z,a as I}from"./isSameOrBefore-D-cyiIrT.js";import{D as $}from"./index-QcCNZ5Bz.js";a.locale("th");a.extend(z);a.extend(I);function G(){const[u,Y]=o.useState(!1),[s,k]=o.useState(null),[C,N]=o.useState([]),[D,M]=o.useState(!0),[n,S]=o.useState(""),[m,f]=o.useState(1),b=30,l=(t,i)=>{const r=document.createElement("div");r.className=`notification ${t}`,r.textContent=i,document.body.appendChild(r),setTimeout(()=>r.classList.add("show"),10),setTimeout(()=>{r.classList.remove("show"),setTimeout(()=>{document.body.removeChild(r)},300)},3e3)},w=async()=>{try{const t=await R();t.status===200?N(t.data):l("error",t.data.error)}catch{l("error","โหลดข้อมูลล้มเหลว")}finally{M(!1)}},E=async t=>{if(!window.confirm("คุณแน่ใจที่จะลบข้อมูลนี้ใช่หรือไม่?"))return;const i=await V(t);i.status===200?(l("success",i.data.message),await w()):l("error",i.data.error)};o.useEffect(()=>{w()},[]);const p=C.filter(t=>{var x,h;const i=((x=t.username)==null?void 0:x.toLowerCase().includes(n.toLowerCase()))||((h=t.user_ip)==null?void 0:h.toLowerCase().includes(n.toLowerCase()))||a(t.start_time).format("DD/MM/YYYY HH:mm:ss").includes(n)||a(t.CreatedAt).format("DD/MM/YYYY HH:mm:ss").includes(n),r=a(t.start_time),g=!s||s[0]&&s[1]&&r.isSameOrAfter(s[0].startOf("day"))&&r.isSameOrBefore(s[1].endOf("day"));return i&&g}),y=Math.ceil(p.length/b),j=m*b,P=j-b,v=p.slice(P,j),H=()=>{const t=[],i=["ชื่อผู้ใช้","IP","เวลาเข้า","เวลาออก","ระยะเวลา (นาที)"];t.push(i.join(",")),(u?v:p).forEach(c=>{const T=[`"${c.username||""}"`,`"${c.user_ip||""}"`,`"${a(c.start_time).format("DD/MM/YYYY HH:mm:ss")}"`,`"${a(c.end_time).format("DD/MM/YYYY HH:mm:ss")}"`,`"${((c.duration??0)/60).toFixed(2)}"`];t.push(T.join(","))});const g="\uFEFF"+t.join(`
`),x=new Blob([g],{type:"text/csv;charset=utf-8;"}),h=URL.createObjectURL(x),d=document.createElement("a");d.href=h,d.setAttribute("download",`visitor-log-${a().format("YYYY-MM-DD")}.csv`),document.body.appendChild(d),d.click(),document.body.removeChild(d)};return e.jsxs("div",{className:"activity-management-container",children:[e.jsxs("div",{className:"activity-card",children:[e.jsxs("div",{className:"header-section",children:[e.jsxs("div",{className:"title-wrapper",children:[e.jsx(L,{className:"title-icon"}),e.jsx("h1",{children:"บันทึกการเข้าใช้งานระบบ"})]}),e.jsxs("div",{className:"header-actions",style:{display:"flex",gap:12,alignItems:"center",flexWrap:"wrap"},children:[e.jsxs("div",{className:"search-container",children:[e.jsx(O,{className:"search-icon"}),e.jsx("input",{type:"text",placeholder:"ค้นหาด้วยชื่อผู้ใช้ / IP / วันที่...",value:n,onChange:t=>S(t.target.value),className:"search-input"})]}),e.jsx($.RangePicker,{format:"DD/MM/YYYY",value:s,onChange:t=>k(t),style:{borderRadius:8},placeholder:["เริ่มต้น","สิ้นสุด"]}),e.jsxs("label",{style:{display:"flex",alignItems:"center",gap:"6px"},children:[e.jsx("input",{type:"checkbox",checked:u,onChange:t=>Y(t.target.checked)}),"Export เฉพาะหน้าปัจจุบัน"]}),e.jsx("button",{className:"export-button",onClick:H,children:"📤 Export CSV"})]})]}),e.jsx("div",{className:"divider"}),D?e.jsxs("div",{className:"loading-container",children:[e.jsx("div",{className:"loading-spinner"}),e.jsx("p",{children:"กำลังโหลดข้อมูล..."})]}):e.jsxs("div",{className:"table-container",children:[p.length===0?e.jsx("div",{className:"no-results",children:"ไม่พบข้อมูลที่ตรงกับการค้นหา"}):e.jsxs("table",{className:"activity-table",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"ชื่อผู้ใช้"}),e.jsx("th",{children:"IP"}),e.jsx("th",{children:"เวลาเข้า"}),e.jsx("th",{children:"เวลาออก"}),e.jsx("th",{children:"ระยะเวลา (นาที)"}),e.jsx("th",{children:"จัดการ"})]})}),e.jsx("tbody",{children:v.map(t=>e.jsxs("tr",{className:"activity-row",children:[e.jsx("td",{children:t.username}),e.jsx("td",{children:t.user_ip}),e.jsx("td",{children:a(t.start_time).format("DD/MM/YYYY HH:mm:ss")}),e.jsx("td",{children:a(t.end_time).format("DD/MM/YYYY HH:mm:ss")}),e.jsx("td",{children:((t.duration??0)/60).toFixed(2)}),e.jsx("td",{children:e.jsx("div",{className:"action-buttons",children:e.jsxs("button",{className:"delete-button",onClick:()=>E(String(t.id)),children:[e.jsx(_,{}),e.jsx("span",{className:"tooltip",children:"ลบ"})]})})})]},t.id))})]}),e.jsx(F,{currentPage:m,totalPages:y,onNext:()=>f(t=>Math.min(t+1,y)),onPrev:()=>f(t=>Math.max(t-1,1))})]})]}),e.jsx("style",{children:`
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
          padding: 2px 12px;
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

        .export-button {
          padding: 10px 16px;
          background: linear-gradient(135deg, #00c9ff 0%,rgb(120, 82, 245) 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0, 201, 255, 0.3);
          transition: all 0.3s ease;
        }

        .export-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 201, 255, 0.4);
        }
      `})]})}export{G as default};
