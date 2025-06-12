import{E as R,r as n,j as e,U as M,V as X,q as $,X as O,Y as A,Z as G,k as V,$ as Y,S as x,a0 as q,a1 as J,a2 as C,a3 as Z,a4 as H,a5 as L,a6 as K,a7 as Q,a8 as W,a9 as ee}from"./index-Wslmr7s8.js";function te(){const I=R(),[g,u]=n.useState([]),[i,U]=n.useState(null),[p,r]=n.useState([]),[S,f]=n.useState(!0),[m,o]=n.useState(1),[F,z]=n.useState(""),l=15,b=Math.ceil(p.length/l),w=m*l,T=w-l,P=p.slice(T,w),E=localStorage.getItem("id"),_=a=>{if(z(a),a===""){r(g),o(1);return}const s=g.filter(t=>{var d,N,v,y,k;return((d=t.first_name)==null?void 0:d.toLowerCase().includes(a.toLowerCase()))||((N=t.last_name)==null?void 0:N.toLowerCase().includes(a.toLowerCase()))||((v=t.username)==null?void 0:v.toLowerCase().includes(a.toLowerCase()))||((y=t.email)==null?void 0:y.toLowerCase().includes(a.toLowerCase()))||((k=t.role)==null?void 0:k.toLowerCase().includes(a.toLowerCase()))||String(t.ID).includes(a)});r(s),o(1)},j=[{title:e.jsxs("div",{className:"header-cell",children:[e.jsx(J,{className:"column-icon"}),e.jsx("span",{children:"ลำดับ"})]}),key:"index",render:a=>e.jsxs("div",{className:"id-cell-with-lock",children:[e.jsx("span",{children:a.index??1}),a.locked?e.jsx(Y,{className:"lock-icon",style:{color:"red",marginLeft:"8px",cursor:i==="admin"?"pointer":"default"},title:"บัญชีถูกล็อก",onClick:()=>{i==="admin"&&x.fire({title:"ปลดล็อกบัญชีนี้?",text:`คุณต้องการปลดล็อกบัญชีของผู้ใช้ ${a.username} ใช่หรือไม่?`,icon:"warning",showCancelButton:!0,confirmButtonText:"ใช่, ปลดล็อก",cancelButtonText:"ยกเลิก"}).then(s=>{s.isConfirmed&&a.username&&D(a.username)})}}):e.jsx(q,{className:"lock-icon",style:{color:"#2de330",marginLeft:"8px"},title:"บัญชีเปิดใช้งาน"})]})},{title:e.jsxs("div",{className:"header-cell",children:[e.jsx(C,{className:"column-icon"}),e.jsx("span",{children:"ชื่อ"})]}),dataIndex:"first_name",key:"first_name",render:a=>e.jsx("span",{className:"name-cell",children:a.first_name})},{title:e.jsxs("div",{className:"header-cell",children:[e.jsx(C,{className:"column-icon"}),e.jsx("span",{children:"นามสกุล"})]}),dataIndex:"last_name",key:"last_name",render:a=>e.jsx("span",{className:"name-cell",children:a.last_name})},{title:e.jsxs("div",{className:"header-cell",children:[e.jsx(Z,{className:"column-icon"}),e.jsx("span",{children:"ชื่อผู้ใช้"})]}),dataIndex:"username",key:"username",render:a=>e.jsxs("span",{className:"username-cell",children:["@",a.username]})},{title:e.jsxs("div",{className:"header-cell",children:[e.jsx(H,{className:"column-icon"}),e.jsx("span",{children:"อีเมล"})]}),dataIndex:"email",key:"email",render:a=>e.jsx("span",{className:"email-cell",children:a.email})},{title:e.jsxs("div",{className:"header-cell",children:[e.jsx(L,{className:"column-icon"}),e.jsx("span",{children:"สิทธิ์การใช้งาน"})]}),dataIndex:"role",key:"role",render:a=>e.jsxs("span",{className:`role-badge ${a.role}`,children:[a.role==="admin"&&e.jsx(L,{className:"role-icon"}),a.role]})},{title:"จัดการ",key:"action",render:a=>e.jsxs("div",{className:"action-buttons",children:[Number(E)!==(a==null?void 0:a.ID)&&i==="admin"&&e.jsxs("button",{className:"delete-button",onClick:()=>{a.ID!==void 0&&B(String(a.ID))},title:"ลบผู้ใช้",children:[e.jsx(K,{}),e.jsx("span",{className:"tooltip",children:"ลบ"})]}),e.jsxs("button",{className:"edit-button",onClick:()=>I(`/admin/customer/edit/${a.ID}`),title:"แก้ไขผู้ใช้",children:[e.jsx(Q,{}),e.jsx("span",{className:"tooltip",children:"แก้ไข"})]})]})}],B=async a=>{if(!window.confirm("คุณแน่ใจที่จะลบผู้ใช้นี้ใช่หรือไม่?"))return;let s=await ee(a);s.status===200?(c("success",s.data.message),await h()):c("error",s.data.error)},c=(a,s)=>{const t=document.createElement("div");t.className=`notification ${a}`,t.textContent=s,document.body.appendChild(t),setTimeout(()=>{t.classList.add("show")},10),setTimeout(()=>{t.classList.remove("show"),setTimeout(()=>{document.body.removeChild(t)},300)},3e3)},h=async()=>{f(!0);try{let a=await G();a.status===200?(u(a.data),r(a.data)):(u([]),r([]),c("error",a.data.error))}catch{c("error","เกิดข้อผิดพลาดในการโหลดข้อมูล")}finally{f(!1)}},D=async a=>{try{const s=await W(a);s.status===200?(await x.fire({icon:"success",title:"ปลดล็อกสำเร็จ",text:s.data.message,timer:2e3,showConfirmButton:!1}),await h()):x.fire({icon:"error",title:"เกิดข้อผิดพลาด",text:s.data.error||"ปลดล็อกไม่สำเร็จ"})}catch{x.fire({icon:"error",title:"เกิดข้อผิดพลาด",text:"ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้"})}};return n.useEffect(()=>{h(),(async()=>{try{const s=await V();if(s){const t=JSON.parse(atob(s.split(".")[1]));U((t==null?void 0:t.role)??null)}}catch(s){console.error("Error decoding token:",s)}})()},[]),e.jsxs("div",{className:"customer-management-container",children:[e.jsxs("div",{className:"customer-management-card",children:[e.jsxs("div",{className:"header-section",children:[e.jsxs("div",{className:"title-wrapper",children:[e.jsx(M,{className:"title-icon"}),e.jsx("h1",{children:"จัดการข้อมูลสมาชิก"})]}),e.jsxs("div",{className:"header-actions",children:[e.jsxs("div",{className:"search-container",children:[e.jsx(X,{className:"search-icon"}),e.jsx("input",{type:"text",placeholder:"ค้นหาสมาชิก...",value:F,onChange:a=>_(a.target.value),className:"search-input"})]}),i==="admin"&&e.jsxs($,{to:"/admin/customer/create",className:"create-button",children:[e.jsx(O,{className:"button-icon"}),e.jsx("span",{children:"สร้างข้อมูล"})]})]})]}),e.jsx("div",{className:"divider"}),S?e.jsxs("div",{className:"loading-container",children:[e.jsx("div",{className:"loading-spinner"}),e.jsx("p",{children:"กำลังโหลดข้อมูล..."})]}):e.jsx("div",{className:"table-container",children:p.length===0?e.jsx("div",{className:"no-results",children:e.jsx("p",{children:"ไม่พบข้อมูลสมาชิกที่ตรงกับการค้นหา"})}):e.jsxs(e.Fragment,{children:[e.jsxs("table",{className:"customer-table",children:[e.jsx("thead",{children:e.jsx("tr",{children:j.map((a,s)=>e.jsx("th",{children:a.title},s))})}),e.jsx("tbody",{children:P.map((a,s)=>e.jsx("tr",{className:"user-row",children:j.map((t,d)=>e.jsx("td",{children:t.render?t.key==="index"?t.render({...a,index:(m-1)*l+s+1}):t.render(a):a[t.dataIndex]},d))},a.ID))})]}),e.jsx(A,{currentPage:m,totalPages:b,onNext:()=>o(a=>Math.min(a+1,b)),onPrev:()=>o(a=>Math.max(a-1,1))})]})})]}),e.jsx("style",{children:`
        :global(body) {
          margin: 0;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
        
        .customer-management-container {
          font-family: 'Mali', Tahoma, Geneva, Verdana, sans-serif;
          min-height: 100vh;
          border-radius: 20px;
          padding: 30px;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
        
        .customer-management-card {
          max-width: 1200px;
          margin: 0 auto;
          background: white;
          border-radius: 16px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
          padding: 30px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .customer-management-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 5px;
          background: linear-gradient(90deg, #ff9a9e 0%, #fad0c4 50%, #a18cd1 100%);
        }
        
        .header-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 15px;
        }
        
        .title-wrapper {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        
        .title-wrapper h1 {
          margin: 0;
          color: #2c3e50;
          font-size: 28px;
          font-weight: 600;
          background: linear-gradient(to right, #6a11cb 0%, #2575fc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .title-icon {
          font-size: 32px;
          color: #6a11cb;
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
        }
        
        .create-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(106, 17, 203, 0.4);
        }
        
        .button-icon {
          font-size: 16px;
        }
        
        .divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0,0,0,0.1), transparent);
          margin: 20px 0;
        }
        
        .table-container {
          overflow-x: auto;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }
        
        .customer-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          border-radius: 12px;
          overflow: hidden;
        }
        
        .customer-table th {
          background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
          color: #2c3e50;
          font-weight: 600;
          padding: 16px 12px;
          text-align: left;
          position: sticky;
          top: 0;
          z-index: 10;
        }
        
        .customer-table td {
          padding: 7px 12px;
          border-bottom: 1px solid #f0f0f0;
          transition: all 0.2s ease;
        }
        
        .customer-table tr:last-child td {
          border-bottom: none;
        }
        
        .customer-table tr:hover td {
          background: rgba(106, 17, 203, 0.03);
        }
        
        .user-row {
          transition: all 0.3s ease;
        }
        
        .user-row:hover {
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
        
        .name-cell {
          font-weight: 500;
          color: #2c3e50;
        }
        
        .username-cell {
          color: #6a11cb;
          font-weight: 500;
        }
        
        .email-cell {
          color: #2575fc;
        }
        
        .role-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          color: white;
        }
        
        .role-badge.admin {
          background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%);
        }
        
        .role-badge.adminit,
        .role-badge.adminhr {
          background: linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%);
        }
        
        .role-badge.user {
          background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%);
        }
        
        .role-icon {
          font-size: 14px;
        }
        
        .action-buttons {
          display: flex;
          gap: 10px;
        }
        
        .edit-button, .delete-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
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
        
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 0;
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
        
        .no-results {
          text-align: center;
          padding: 40px;
          color: #666;
          font-size: 16px;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
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
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }
        
        .notification.error {
          background: linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%);
        }
        
        @media (max-width: 768px) {
          .customer-management-card {
            padding: 20px;
          }
          
          .header-section {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
          }
          
          .header-actions {
            width: 100%;
            flex-direction: column;
            gap: 15px;
          }
          
          .search-input {
            width: 100%;
          }
          
          .create-button {
            width: 100%;
            justify-content: center;
          }
          
          .customer-table th, .customer-table td {
            padding: 12px 8px;
          }
        }
      `})]})}export{te as default};
