import{E as l,j as e,bn as s,bx as d,bo as p,q as u,ae as m,af as x,by as f}from"./index-DQMZ3AmN.js";function b(){const r=l(),o=(n,i)=>{const t=document.createElement("div");t.className=`notification ${n}`,t.textContent=i,document.body.appendChild(t),setTimeout(()=>{t.classList.add("show")},10),setTimeout(()=>{t.classList.remove("show"),setTimeout(()=>{document.body.removeChild(t)},300)},3e3)},c=async n=>{n.preventDefault();const i=n.currentTarget,t={name:i.elements.namedItem("name").value,name_link:i.elements.namedItem("name_link").value,link_url:i.elements.namedItem("link_url").value},a=await f(t);a.status===201||a.status===201?(o("success",a.data.message),setTimeout(()=>r("/admin/section-web"),2e3)):o("error",a.data.error)};return e.jsxs("div",{className:"section-create-container",children:[e.jsxs("div",{className:"form-card",children:[e.jsxs("div",{className:"form-header",children:[e.jsx(s,{className:"header-icon"}),e.jsx("h2",{children:"เพิ่มเว็บไซต์ที่เกี่ยวข้อง"}),e.jsx("p",{children:"กรอกข้อมูลเว็บไซต์ฝ่ายในระบบ"})]}),e.jsxs("form",{onSubmit:c,className:"user-form",children:[e.jsxs("div",{className:"form-grid",children:[e.jsxs("div",{className:"form-group",children:[e.jsxs("label",{htmlFor:"name",children:[e.jsx(d,{className:"input-icon"})," ฝ่าย"]}),e.jsxs("div",{className:"select-wrapper",children:[e.jsxs("select",{id:"name",name:"name",required:!0,children:[e.jsx("option",{value:"",children:"เลือกฝ่าย"}),e.jsx("option",{value:"HR",children:"HR"}),e.jsx("option",{value:"ACC",children:"ACC"}),e.jsx("option",{value:"QA",children:"QA"}),e.jsx("option",{value:"MKT",children:"MKT"}),e.jsx("option",{value:"IT",children:"IT"}),e.jsx("option",{value:"ME/PE",children:"ME/PE"}),e.jsx("option",{value:"Safety",children:"Safety"}),e.jsx("option",{value:"WH",children:"WH"}),e.jsx("option",{value:"PC",children:"PC"})]}),e.jsx("span",{className:"select-focus"})]})]}),e.jsxs("div",{className:"form-group",children:[e.jsxs("label",{htmlFor:"name_link",children:[e.jsx(s,{className:"input-icon"})," ชื่อเว็บไซต์"]}),e.jsxs("div",{className:"input-wrapper",children:[e.jsx("input",{type:"text",id:"name_link",name:"name_link",placeholder:"กรอกชื่อเว็บไซต์",required:!0}),e.jsx("span",{className:"input-focus"})]})]}),e.jsxs("div",{className:"form-group",children:[e.jsxs("label",{htmlFor:"link_url",children:[e.jsx(p,{className:"input-icon"})," URL เว็บไซต์"]}),e.jsxs("div",{className:"input-wrapper",children:[e.jsx("input",{type:"text",id:"link_url",name:"link_url",placeholder:"กรอก URL เว็บไซต์",required:!0}),e.jsx("span",{className:"input-focus"})]})]})]}),e.jsxs("div",{className:"form-actions",children:[e.jsxs(u,{to:"/admin/section-web",className:"cancel-button",children:[e.jsx(m,{className:"button-icon"})," ยกเลิก"]}),e.jsxs("button",{type:"submit",className:"submit-button",children:[e.jsx(x,{className:"button-icon"})," ยืนยันการเพิ่ม"]})]})]})]}),e.jsx("style",{children:`
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
          font-size: 16px;
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
      `})]})}export{b as default};
