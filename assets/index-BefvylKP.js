import{E as c,r as d,j as e,aa as t,ab as p,ac as m,ad as u,a5 as x,q as f,ae as h,af as g,ag as b}from"./index-DQMZ3AmN.js";function w(){const o=c(),l=async r=>{r.preventDefault();const a=r.currentTarget,s={first_name:a.elements.namedItem("first_name").value,last_name:a.elements.namedItem("last_name").value,username:a.elements.namedItem("username").value,email:a.elements.namedItem("email").value,phone:a.elements.namedItem("phone").value,password:a.elements.namedItem("password").value,role:a.elements.namedItem("role").value,force_password_change:!0},n=await b(s);n.status==201?(i("success",n.data.message),setTimeout(()=>o("/admin/customer"),2e3)):i("error",n.data.error)},i=(r,a)=>{const s=document.createElement("div");s.className=`notification ${r}`,s.textContent=a,document.body.appendChild(s),setTimeout(()=>{s.classList.add("show")},10),setTimeout(()=>{s.classList.remove("show"),setTimeout(()=>{document.body.removeChild(s)},300)},3e3)};return d.useEffect(()=>{},[]),e.jsxs("div",{className:"customer-create-container",children:[e.jsxs("div",{className:"form-card",children:[e.jsxs("div",{className:"form-header",children:[e.jsx(t,{className:"header-icon"}),e.jsx("h2",{children:"เพิ่มข้อมูลผู้ใช้"}),e.jsx("p",{children:"กรอกข้อมูลผู้ใช้ใหม่ในระบบ"})]}),e.jsxs("form",{onSubmit:l,className:"user-form",children:[e.jsxs("div",{className:"form-grid",children:[e.jsxs("div",{className:"form-group",children:[e.jsxs("label",{htmlFor:"first_name",children:[e.jsx(t,{className:"input-icon"}),"ชื่อจริง"]}),e.jsxs("div",{className:"input-wrapper",children:[e.jsx("input",{type:"text",id:"first_name",name:"first_name",placeholder:"กรอกชื่อจริง",required:!0}),e.jsx("span",{className:"input-focus"})]})]}),e.jsxs("div",{className:"form-group",children:[e.jsxs("label",{htmlFor:"last_name",children:[e.jsx(t,{className:"input-icon"}),"นามสกุล"]}),e.jsxs("div",{className:"input-wrapper",children:[e.jsx("input",{type:"text",id:"last_name",name:"last_name",placeholder:"กรอกนามสกุล",required:!0}),e.jsx("span",{className:"input-focus"})]})]}),e.jsxs("div",{className:"form-group",children:[e.jsxs("label",{htmlFor:"username",children:[e.jsx(t,{className:"input-icon"}),"ชื่อผู้ใช้"]}),e.jsxs("div",{className:"input-wrapper",children:[e.jsx("input",{type:"text",id:"username",name:"username",placeholder:"กรอกชื่อผู้ใช้",required:!0}),e.jsx("span",{className:"input-focus"})]})]}),e.jsxs("div",{className:"form-group",children:[e.jsxs("label",{htmlFor:"email",children:[e.jsx(p,{className:"input-icon"}),"อีเมล"]}),e.jsxs("div",{className:"input-wrapper",children:[e.jsx("input",{type:"email",id:"email",name:"email",placeholder:"กรอกอีเมล",required:!0}),e.jsx("span",{className:"input-focus"})]})]}),e.jsxs("div",{className:"form-group",children:[e.jsxs("label",{htmlFor:"phone",children:[e.jsx(m,{className:"input-icon"}),"เบอร์ที่ทำงาน"]}),e.jsxs("div",{className:"input-wrapper",children:[e.jsx("input",{type:"tel",id:"phone",name:"phone",placeholder:"กรอกเบอร์ที่ทำงาน",required:!0}),e.jsx("span",{className:"input-focus"})]})]}),e.jsxs("div",{className:"form-group",children:[e.jsxs("label",{htmlFor:"password",children:[e.jsx(u,{className:"input-icon"}),"รหัสผ่าน"]}),e.jsxs("div",{className:"input-wrapper",children:[e.jsx("input",{type:"password",id:"password",name:"password",placeholder:"กรอกรหัสผ่าน",required:!0}),e.jsx("span",{className:"input-focus"})]})]}),e.jsxs("div",{className:"form-group",children:[e.jsxs("label",{htmlFor:"role",children:[e.jsx(x,{className:"input-icon"}),"สิทธิ์การเข้าถึง"]}),e.jsxs("div",{className:"select-wrapper",children:[e.jsxs("select",{id:"role",name:"role",required:!0,children:[e.jsx("option",{value:"user",children:"User"}),e.jsx("option",{value:"admin",children:"Admin"}),e.jsx("option",{value:"adminit",children:"Admin IT"}),e.jsx("option",{value:"adminhr",children:"Admin HR"})]}),e.jsx("span",{className:"select-focus"})]})]})]}),e.jsxs("div",{className:"form-actions",children:[e.jsxs(f,{to:"/admin/customer",className:"cancel-button",children:[e.jsx(h,{className:"button-icon"}),"ยกเลิก"]}),e.jsxs("button",{type:"submit",className:"submit-button",children:[e.jsx(g,{className:"button-icon"}),"ยืนยันการเพิ่ม"]})]})]})]}),e.jsx("style",{children:`
        .customer-create-container {
          font-family: 'Mali', Tahoma, Geneva, Verdana, sans-serif;
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
          transition: transform 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .form-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(106, 17, 203, 0.2);
        }
        
        .form-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 5px;
          background: linear-gradient(90deg, #6a11cb 0%, #2575fc 100%);
        }
        
        .form-header {
          margin-bottom: 50px;
          text-align: center;
        }
        
        .form-header h2 {
          background: linear-gradient(to right, #6a11cb 0%, #2575fc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: inherit;
        }
        
        .form-header p {
          margin: 0;
          color: #7b8a8b;
          font-size: 16px;
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
          font-size: 14px;
        }
        
        .input-icon {
          color: #6a11cb;
          font-size: 18px;
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
          transition: all 0.3s ease;
          background-color: #f9f9f9;
        }
        
        select {
          appearance: none;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
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
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #6a11cb 0%, #2575fc 100%);
          transition: width 0.3s ease;
        }
        
        input:focus ~ .input-focus, 
        select:focus ~ .select-focus {
          width: 100%;
        }
        
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 15px;
          margin-top: 20px;
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
        
        .submit-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(106, 17, 203, 0.4);
          background: linear-gradient(135deg, #5a0db5 0%, #1565d8 100%);
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
          background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
        }
        
        .notification.error {
          background: linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%);
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
      `})]})}export{w as default};
