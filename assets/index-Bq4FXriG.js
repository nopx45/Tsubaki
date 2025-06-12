import{E as p,ah as u,r as m,j as e,bn as c,bo as x,q as f,ae as b,af as g,bq as h,br as w}from"./index-Wslmr7s8.js";function j(){const s=p(),{id:o}=u(),i=(n,a)=>{const t=document.createElement("div");t.className=`notification ${n}`,t.textContent=a,document.body.appendChild(t),setTimeout(()=>t.classList.add("show"),10),setTimeout(()=>{t.classList.remove("show"),setTimeout(()=>document.body.removeChild(t),300)},3e3)},l=async n=>{const a=await h(n);if(a.status===200){const t=document.getElementById("centralForm");t&&(t.elements.namedItem("name").value=a.data.name,t.elements.namedItem("link_url").value=a.data.link_url)}else i("error","ไม่พบข้อมูลเว็บไซต์"),setTimeout(()=>s("/admin/central-web"),2e3)},d=async n=>{n.preventDefault();const a=n.currentTarget,t={name:a.elements.namedItem("name").value,link_url:a.elements.namedItem("link_url").value},r=await w(o,t);r.status===200?(i("success",r.data.message),setTimeout(()=>s("/admin/central-web"),2e3)):i("error",r.data.error)};return m.useEffect(()=>{l(o)},[o]),e.jsxs("div",{className:"section-create-container",children:[e.jsxs("div",{className:"form-card",children:[e.jsxs("div",{className:"form-header",children:[e.jsx(c,{className:"header-icon"}),e.jsx("h2",{children:"แก้ไขเว็บไซต์ศูนย์กลาง"}),e.jsx("p",{children:"แก้ไขข้อมูลเว็บไซต์ศูนย์กลางในระบบ"})]}),e.jsxs("form",{id:"centralForm",onSubmit:d,className:"user-form",children:[e.jsxs("div",{className:"form-grid",children:[e.jsxs("div",{className:"form-group",children:[e.jsxs("label",{htmlFor:"name",children:[e.jsx(c,{className:"input-icon"})," ชื่อเว็บไซต์"]}),e.jsxs("div",{className:"input-wrapper",children:[e.jsx("input",{type:"text",id:"name",name:"name",placeholder:"กรอกชื่อเว็บไซต์",required:!0}),e.jsx("span",{className:"input-focus"})]})]}),e.jsxs("div",{className:"form-group",children:[e.jsxs("label",{htmlFor:"link_url",children:[e.jsx(x,{className:"input-icon"})," URL เว็บไซต์"]}),e.jsxs("div",{className:"input-wrapper",children:[e.jsx("input",{type:"text",id:"link_url",name:"link_url",placeholder:"กรอก URL เว็บไซต์",required:!0}),e.jsx("span",{className:"input-focus"})]})]})]}),e.jsxs("div",{className:"form-actions",children:[e.jsxs(f,{to:"/admin/central-web",className:"cancel-button",children:[e.jsx(b,{className:"button-icon"})," ยกเลิก"]}),e.jsxs("button",{type:"submit",className:"submit-button",children:[e.jsx(g,{className:"button-icon"})," บันทึกการเปลี่ยนแปลง"]})]})]})]}),e.jsx("style",{children:`
        .section-create-container {
          font-family: 'Mali', Tahoma, sans-serif;
          min-height: 80vh;
          border-radius: 20px;
          padding: 30px;
          background: linear-gradient(135deg, #f0f4f8 0%, #d9e4f2 100%);
          display: flex;
          justify-content: center;
          align-items: top;
        }
        .form-card {
          width: 100%;
          max-width: 800px;
          background: white;
          border-radius: 16px;
          padding: 40px;
          box-shadow: 0 15px 35px rgba(106, 17, 203, 0.15);
          position: relative;
          overflow: hidden;
        }
        .form-header {
          text-align: center;
          margin-bottom: 40px;
        }
        .form-header h2 {
          background: linear-gradient(to right, #6a11cb, #2575fc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .header-icon {
          font-size: 40px;
          color: #6a11cb;
          background: rgba(106, 17, 203, 0.1);
          padding: 15px;
          border-radius: 50%;
        }
        .user-form {
          display: flex;
          flex-direction: column;
          gap: 25px;
        }
        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .form-group label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 500;
          color: #2c3e50;
        }
        .input-icon {
          color: #6a11cb;
        }
        .input-wrapper, .select-wrapper {
          position: relative;
        }
        input, select {
          width: 100%;
          padding: 12px 15px 12px 40px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          font-size: 14px;
          background-color: #f9f9f9;
        }
        select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 10px center;
          background-size: 15px;
        }
        input:focus, select:focus {
          outline: none;
          border-color: #6a11cb;
          background-color: white;
          box-shadow: 0 0 0 3px rgba(106, 17, 203, 0.1);
        }
        .input-focus, .select-focus {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 2px;
          background: linear-gradient(to right, #6a11cb, #2575fc);
          width: 0;
          transition: width 0.3s ease;
        }
        input:focus ~ .input-focus, select:focus ~ .select-focus {
          width: 100%;
        }
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 15px;
        }
        .cancel-button, .submit-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        }
        .cancel-button {
          background: #f5f5f5;
          color: #666;
        }
        .cancel-button:hover {
          background: #e0e0e0;
          transform: translateY(-2px);
        }
        .submit-button {
          background: linear-gradient(to right, #6a11cb, #2575fc);
          color: white;
          box-shadow: 0 4px 15px rgba(106, 17, 203, 0.3);
        }
        .submit-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(106, 17, 203, 0.4);
        }
        .button-icon {
          font-size: 18px;
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
          background: linear-gradient(to right, #6a11cb, #2575fc);
        }
        .notification.error {
          background: linear-gradient(to right, #ff416c, #ff4b2b);
        }
        @media (max-width: 768px) {
          .form-card {
            padding: 25px;
          }
          .form-grid {
            grid-template-columns: 1fr;
          }
          .form-actions {
            flex-direction: column;
          }
          .cancel-button, .submit-button {
            width: 100%;
            justify-content: center;
          }
        }
      `})]})}export{j as default};
