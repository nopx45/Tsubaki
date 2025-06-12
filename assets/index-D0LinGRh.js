import{E as l,j as e,bn as o,bo as d,q as p,ae as u,af as m,bp as x}from"./index-DQMZ3AmN.js";function b(){const s=l(),r=(a,i)=>{const t=document.createElement("div");t.className=`notification ${a}`,t.textContent=i,document.body.appendChild(t),setTimeout(()=>{t.classList.add("show")},10),setTimeout(()=>{t.classList.remove("show"),setTimeout(()=>{document.body.removeChild(t)},300)},3e3)},c=async a=>{a.preventDefault();const i=a.currentTarget,t={name:i.elements.namedItem("name").value,link_url:i.elements.namedItem("link_url").value},n=await x(t);n.status===201?(r("success",n.data.message),setTimeout(()=>s("/admin/central-web"),2e3)):r("error",n.data.error)};return e.jsxs("div",{className:"central-create-container",children:[e.jsxs("div",{className:"form-card",children:[e.jsxs("div",{className:"form-header",children:[e.jsx(o,{className:"header-icon"}),e.jsx("h2",{children:"เพิ่มเว็บไซต์กลาง (Central Web)"}),e.jsx("p",{children:"กรอกข้อมูลเว็บไซต์กลางในระบบ"})]}),e.jsxs("form",{onSubmit:c,className:"user-form",children:[e.jsxs("div",{className:"form-grid",children:[e.jsxs("div",{className:"form-group",children:[e.jsxs("label",{htmlFor:"name",children:[e.jsx(o,{className:"input-icon"})," ชื่อเว็บไซต์"]}),e.jsxs("div",{className:"input-wrapper",children:[e.jsx("input",{type:"text",id:"name",name:"name",placeholder:"กรอกชื่อเว็บไซต์",required:!0}),e.jsx("span",{className:"input-focus"})]})]}),e.jsxs("div",{className:"form-group",children:[e.jsxs("label",{htmlFor:"link_url",children:[e.jsx(d,{className:"input-icon"})," URL เว็บไซต์"]}),e.jsxs("div",{className:"input-wrapper",children:[e.jsx("input",{type:"text",id:"link_url",name:"link_url",placeholder:"กรอก URL เว็บไซต์",required:!0}),e.jsx("span",{className:"input-focus"})]})]})]}),e.jsxs("div",{className:"form-actions",children:[e.jsxs(p,{to:"/admin/central-web",className:"cancel-button",children:[e.jsx(u,{className:"button-icon"})," ยกเลิก"]}),e.jsxs("button",{type:"submit",className:"submit-button",children:[e.jsx(m,{className:"button-icon"})," ยืนยันการเพิ่ม"]})]})]})]}),e.jsx("style",{children:`
        .central-create-container {
          font-family: 'Mali', Tahoma, sans-serif;
          min-height: 80vh;
          border-radius: 30px;
          padding: 30px;
          background: linear-gradient(135deg, #f0f4f8 0%, #d9e4f2 100%);
          display: flex;
          justify-content: center;
        }

        .form-card {
          width: 100%;
          max-width: 800px;
          background: white;
          border-radius: 16px;
          padding: 40px;
          box-shadow: 0 15px 35px rgba(106, 17, 203, 0.15);
          position: relative;
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

        .input-wrapper {
          position: relative;
        }

        input {
          width: 100%;
          padding: 12px 15px 12px 40px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          font-size: 16px;
          background-color: #f9f9f9;
        }

        input:focus {
          outline: none;
          border-color: #6a11cb;
          background-color: white;
          box-shadow: 0 0 0 3px rgba(106, 17, 203, 0.1);
        }

        .input-focus {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 2px;
          background: linear-gradient(to right, #6a11cb, #2575fc);
          width: 0;
          transition: width 0.3s ease;
        }

        input:focus ~ .input-focus {
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
