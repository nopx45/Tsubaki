import{E as w,r,j as e,a$ as c,q as j,aH as v,aA as y,bh as N}from"./index-DQMZ3AmN.js";function F(){const f=w(),[l,m]=r.useState(null),[s,g]=r.useState(""),[d,p]=r.useState(!1),o=(t,i)=>{const a=document.createElement("div");a.className=`notification ${t}`,a.textContent=i,document.body.appendChild(a),setTimeout(()=>{a.classList.add("show")},10),setTimeout(()=>{a.classList.remove("show"),setTimeout(()=>{document.body.removeChild(a)},300)},3e3)},b=t=>{t.target.files&&t.target.files[0]&&m(t.target.files[0])},h=async t=>{var a,u,x;if(t.preventDefault(),!s||!l){o("error","กรุณากรอกข้อมูลให้ครบ!");return}p(!0);const i=new FormData;i.append("name",s),i.append("file",l);try{const n=await N(i);(n==null?void 0:n.message)==="Regulation create successfully"?(o("success","เพิ่มระเบียบสำเร็จ!"),setTimeout(()=>{f("/admin/regulation")},2e3)):o("error",((a=n.data)==null?void 0:a.error)||"ไม่สามารถเพิ่มข้อมูลได้")}catch(n){o("error",((x=(u=n.response)==null?void 0:u.data)==null?void 0:x.error)||"เกิดข้อผิดพลาด!")}finally{p(!1)}};return e.jsxs("div",{className:"announcement-create-container",children:[e.jsxs("div",{className:"announcement-create-card",children:[e.jsx("div",{className:"header-section",children:e.jsxs("div",{className:"title-wrapper",children:[e.jsx(c,{className:"title-icon"}),e.jsx("h1",{children:"เพิ่มระเบียบข้อบังคับของบริษัท"})]})}),e.jsx("div",{className:"divider"}),e.jsxs("form",{onSubmit:h,className:"announcement-form",children:[e.jsxs("div",{className:"form-group",children:[e.jsxs("label",{htmlFor:"name",children:[e.jsx(c,{className:"input-icon"}),"ชื่อไฟล์ระเบียบ"]}),e.jsxs("div",{className:"input-wrapper",children:[e.jsx("input",{type:"text",id:"name",name:"name",value:s,onChange:t=>g(t.target.value),placeholder:"กรอกชื่อไฟล์",required:!0}),e.jsx("span",{className:"input-focus"})]})]}),e.jsxs("div",{className:"form-group",children:[e.jsxs("label",{htmlFor:"file",children:[e.jsx(c,{className:"input-icon"}),"อัปโหลดไฟล์ระเบียบ"]}),e.jsxs("div",{className:"input-wrapper",children:[e.jsx("input",{type:"file",id:"file",name:"file",onChange:b,required:!0}),e.jsx("span",{className:"input-focus"})]})]}),e.jsxs("div",{className:"form-actions",children:[e.jsxs(j,{to:"/admin/regulation",className:"cancel-button",children:[e.jsx(v,{className:"button-icon"}),"ยกเลิก"]}),e.jsxs("button",{type:"submit",className:"submit-button",disabled:d,children:[e.jsx(y,{className:"button-icon"}),d?"กำลังดำเนินการ...":"ยืนยัน"]})]})]})]}),e.jsx("style",{children:`
        .announcement-create-container {
          font-family: 'Mali', Tahoma, Geneva, Verdana, sans-serif;
          min-height: 80vh;
          border-radius: 20px;
          padding: 30px;
          background: linear-gradient(135deg, #f0f4f8 0%, #e0e8f5 100%);
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .announcement-create-card {
          width: 100%;
          max-width: 800px;
          background: white;
          border-radius: 16px;
          padding: 40px;
          box-shadow: 0 15px 35px rgba(106, 17, 203, 0.15);
          transition: transform 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .announcement-create-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(106, 17, 203, 0.2);
        }
        
        .announcement-create-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 5px;
          background: linear-gradient(90deg, #6a11cb 0%, #2575fc 100%);
        }
        
        .header-section {
          margin-bottom: 25px;
          text-align: center;
        }
        
        .title-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
        }
        
        .title-wrapper h1 {
          margin: 10px 0 5px;
          font-size: 28px;
          font-weight: 700;
        }
        
        .title-icon {
          font-size: 32px;
          color: #6a11cb;
          background: rgba(106, 17, 203, 0.1);
          padding: 15px;
          border-radius: 50%;
        }
        
        .divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(106, 17, 203, 0.1), transparent);
          margin: 25px 0;
        }
        
        .announcement-form {
          display: flex;
          flex-direction: column;
          gap: 25px;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        .form-group label {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 500;
          color: #2c3e50;
          font-size: 16px;
        }
        
        .file-hint {
          font-size: 14px;
          color: #666;
          font-weight: normal;
        }
        
        .input-icon {
          color: #6a11cb;
          font-size: 18px;
        }
        
        .input-wrapper {
          position: relative;
        }
        
        input, textarea, select {
          width: 100%;
          padding: 12px 15px 12px 40px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          font-size: 16px;
          transition: all 0.3s ease;
          background-color: #f9f9f9;
        }
        
        textarea {
          min-height: 120px;
          resize: vertical;
        }
        
        select {
          appearance: none;
          cursor: pointer;
        }
        
        input:focus, textarea:focus, select:focus {
          outline: none;
          border-color: #6a11cb;
          background-color: white;
          box-shadow: 0 0 0 3px rgba(106, 17, 203, 0.1);
        }
        
        .input-focus {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #6a11cb 0%, #2575fc 100%);
          transition: width 0.3s ease;
        }
        
        input:focus ~ .input-focus, 
        textarea:focus ~ .input-focus,
        select:focus ~ .input-focus {
          width: 100%;
        }
        
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 15px;
          margin-top: 30px;
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
          transition: all 0.3s ease;
        }
        
        .cancel-button {
          background: #f5f5f5;
          color: #666;
          text-decoration: none;
        }
        
        .cancel-button:hover {
          background: #e0e0e0;
          transform: translateY(-2px);
        }
        
        .submit-button {
          background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(106, 17, 203, 0.3);
        }
        
        .submit-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(106, 17, 203, 0.4);
          background: linear-gradient(135deg, #5a0db5 0%, #1565d8 100%);
        }
        
        .submit-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .button-icon {
          font-size: 16px;
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
          .announcement-create-card {
            padding: 25px;
          }
          
          .form-actions {
            flex-direction: column;
          }
          
          .cancel-button, .submit-button {
            width: 100%;
            justify-content: center;
          }
        }
      `})]})}export{F as default};
