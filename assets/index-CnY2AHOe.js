import{r as n,aQ as i,j as e,cA as A,a_ as T,a6 as V,Y as R,cB as z,cC as F}from"./index-DQMZ3AmN.js";import{i as _,a as H}from"./isSameOrBefore-C1QLX1Bw.js";import{D as I}from"./index-BifxmWHr.js";i.locale("th");i.extend(_);i.extend(H);function G(){const[u,k]=n.useState(!1),[s,Y]=n.useState(null),[C,N]=n.useState([]),[c,D]=n.useState(""),[f,m]=n.useState(1),[P,S]=n.useState(!0),g=30,d=(t,o)=>{const a=document.createElement("div");a.className=`notification ${t}`,a.textContent=o,document.body.appendChild(a),setTimeout(()=>a.classList.add("show"),10),setTimeout(()=>{a.classList.remove("show"),setTimeout(()=>{document.body.removeChild(a)},300)},3e3)},y=async()=>{try{const t=await z();t.status===200?N(t.data):d("error",t.data.error)}catch{d("error","โหลดข้อมูลล้มเหลว")}finally{S(!1)}},E=async t=>{if(!window.confirm("คุณแน่ใจที่จะลบข้อมูลนี้ใช่หรือไม่?"))return;const o=await F(t);o.status===200?(d("success",o.data.message),await y()):d("error",o.data.error)};n.useEffect(()=>{y()},[]);const l=C.filter(t=>{var p,x,r;const o=((p=t.username)==null?void 0:p.toLowerCase().includes(c.toLowerCase()))||((x=t.page_name)==null?void 0:x.toLowerCase().includes(c.toLowerCase()))||((r=t.page_path)==null?void 0:r.toLowerCase().includes(c.toLowerCase()))||i(t.UpdatedAt).format("DD/MM/YYYY HH:mm:ss").includes(c),a=i(t.UpdatedAt),b=!s||s[0]&&s[1]&&a.isSameOrAfter(s[0].startOf("day"))&&a.isSameOrBefore(s[1].endOf("day"));return o&&b}),w=Math.ceil(l.length/g),v=f*g,M=v-g,j=l.slice(M,v),L=()=>{const t=[],o=["วันที่","ชื่อผู้ใช้","ชื่อเพจ","พาธ"];t.push(o.join(",")),(u?j:l).forEach(h=>{const O=[`"${i(h.UpdatedAt).format("DD/MM/YYYY HH:mm:ss")}"`,`"${h.username||""}"`,`"${h.page_name||""}"`,`"${h.page_path||""}"`];t.push(O.join(","))});const b="\uFEFF"+t.join(`
`),p=new Blob([b],{type:"text/csv;charset=utf-8;"}),x=URL.createObjectURL(p),r=document.createElement("a");r.href=x,r.setAttribute("download",`visitor-log-${i().format("YYYY-MM-DD")}.csv`),document.body.appendChild(r),r.click(),document.body.removeChild(r)};return e.jsxs("div",{className:"activity-management-container",children:[e.jsxs("div",{className:"activity-card",children:[e.jsxs("div",{className:"header-section",children:[e.jsxs("div",{className:"title-wrapper",children:[e.jsx(A,{className:"title-icon"}),e.jsx("h1",{children:"ประวัติการเข้าชมหน้าเพจ"})]}),e.jsxs("div",{className:"header-actions",style:{display:"flex",gap:12,alignItems:"center",flexWrap:"wrap"},children:[e.jsxs("div",{className:"search-container",children:[e.jsx(T,{className:"search-icon"}),e.jsx("input",{type:"text",placeholder:"ค้นหาด้วยชื่อผู้ใช้ / เพจ / วันที่...",value:c,onChange:t=>D(t.target.value),className:"search-input"})]}),e.jsx(I.RangePicker,{format:"DD/MM/YYYY",value:s,onChange:t=>Y(t),style:{borderRadius:8},placeholder:["เริ่มต้น","สิ้นสุด"]}),e.jsxs("label",{style:{display:"flex",alignItems:"center",gap:"6px"},children:[e.jsx("input",{type:"checkbox",checked:u,onChange:t=>k(t.target.checked)}),"Export เฉพาะหน้าปัจจุบัน"]}),e.jsx("button",{className:"export-button",onClick:L,children:"📤 Export CSV"})]})]}),e.jsx("div",{className:"divider"}),P?e.jsxs("div",{className:"loading-container",children:[e.jsx("div",{className:"loading-spinner"}),e.jsx("p",{children:"กำลังโหลดข้อมูล..."})]}):e.jsxs("div",{className:"table-container",children:[l.length===0?e.jsx("div",{className:"no-results",children:"ไม่พบข้อมูลที่ตรงกับการค้นหา"}):e.jsxs("table",{className:"activity-table",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"วันที่"}),e.jsx("th",{children:"ชื่อผู้ใช้"}),e.jsx("th",{children:"ชื่อหน้าเพจ"}),e.jsx("th",{children:"Path"}),e.jsx("th",{children:"จัดการ"})]})}),e.jsx("tbody",{children:j.map(t=>e.jsxs("tr",{className:"activity-row",children:[e.jsx("td",{children:i(t.UpdatedAt).format("DD/MM/YYYY HH:mm")}),e.jsx("td",{style:{color:"#17d632"},children:t.username}),e.jsx("td",{style:{color:"#c19c1c"},children:t.page_name}),e.jsx("td",{style:{color:"#0D47A1"},children:t.page_path}),e.jsx("td",{children:e.jsx("div",{className:"action-buttons",children:e.jsxs("button",{className:"delete-button",onClick:()=>E(String(t.ID)),children:[e.jsx(V,{}),e.jsx("span",{className:"tooltip",children:"ลบ"})]})})})]},t.ID))})]}),e.jsx(R,{currentPage:f,totalPages:w,onNext:()=>m(t=>Math.min(t+1,w)),onPrev:()=>m(t=>Math.max(t-1,1))})]})]}),e.jsx("style",{children:`
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
