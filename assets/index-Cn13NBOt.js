import{E as w,ah as N,r as p,j as e,aa as l,ab as y,ac as _,a5 as k,q as u,ae as x,ai as f,aj as F,ad as I,ak as T,al as U,k as q,am as h}from"./index-Wslmr7s8.js";function A(){const c=w(),{id:o}=N(),[m,g]=p.useState(null),r=m==="admin",b=async t=>{let s=await U(t);if(s.status==200){const a=document.getElementById("editUserForm");a&&(a.elements.namedItem("first_name").value=s.data.first_name,a.elements.namedItem("last_name").value=s.data.last_name,a.elements.namedItem("email").value=s.data.email,a.elements.namedItem("username").value=s.data.username,a.elements.namedItem("phone").value=s.data.phone,a.elements.namedItem("role").value=s.data.role)}else n("error","ไม่พบข้อมูลผู้ใช้"),setTimeout(()=>c("/admin/customer"),2e3)},j=async t=>{t.preventDefault();const s=t.currentTarget,a={first_name:s.elements.namedItem("first_name").value,last_name:s.elements.namedItem("last_name").value,email:s.elements.namedItem("email").value,username:s.elements.namedItem("username").value,phone:s.elements.namedItem("phone").value,role:s.elements.namedItem("role").value},i=await h(o,a);i.status===200?(n("success",i.data.message),setTimeout(()=>c("/admin/customer"),2e3)):n("error",i.data.error)},v=async t=>{t.preventDefault();const s=t.currentTarget,a=s.elements.namedItem("reset_password").value,i=s.elements.namedItem("confirm_reset_password").value;if(a!==i){n("error","รหัสผ่านไม่ตรงกัน");return}const d=await h(o,{password:a,force_password_change:!0});d.status===200?(n("success",d.data.message),setTimeout(()=>c("/admin/customer"),2e3)):n("error",d.data.error)},n=(t,s)=>{const a=document.createElement("div");a.className=`notification ${t}`,a.textContent=s,document.body.appendChild(a),setTimeout(()=>{a.classList.add("show")},10),setTimeout(()=>{a.classList.remove("show"),setTimeout(()=>{document.body.removeChild(a)},300)},3e3)};return p.useEffect(()=>{b(o),(async()=>{try{const s=await q();if(s){const a=JSON.parse(atob(s.split(".")[1]));g((a==null?void 0:a.role)??null)}}catch(s){console.error("Error decoding token:",s)}})()},[o]),e.jsxs("div",{className:"customer-edit-container",children:[e.jsxs("div",{className:"form-card",children:[e.jsxs("div",{className:"form-header",children:[e.jsx(l,{className:"header-icon"}),e.jsx("h2",{children:m==="admin"?"แก้ไขข้อมูลผู้ใช้":"แก้ไขเบอร์ผู้ใช้"})]}),e.jsxs("form",{id:"editUserForm",onSubmit:j,className:"user-form",children:[e.jsxs("div",{className:"form-grid",children:[e.jsxs("div",{className:"form-group",children:[e.jsxs("label",{htmlFor:"first_name",children:[e.jsx(l,{className:"input-icon"}),"ชื่อจริง"]}),e.jsxs("div",{className:"input-wrapper",children:[e.jsx("input",{type:"text",id:"first_name",name:"first_name",placeholder:"กรอกชื่อจริง",required:!0,disabled:!r}),e.jsx("span",{className:"input-focus"})]})]}),e.jsxs("div",{className:"form-group",children:[e.jsxs("label",{htmlFor:"last_name",children:[e.jsx(l,{className:"input-icon"}),"นามสกุล"]}),e.jsxs("div",{className:"input-wrapper",children:[e.jsx("input",{type:"text",id:"last_name",name:"last_name",placeholder:"กรอกนามสกุล",required:!0,disabled:!r}),e.jsx("span",{className:"input-focus"})]})]}),e.jsxs("div",{className:"form-group",children:[e.jsxs("label",{htmlFor:"email",children:[e.jsx(y,{className:"input-icon"}),"อีเมล"]}),e.jsxs("div",{className:"input-wrapper",children:[e.jsx("input",{type:"email",id:"email",name:"email",placeholder:"กรอกอีเมล",required:!0,disabled:!r}),e.jsx("span",{className:"input-focus"})]})]}),e.jsxs("div",{className:"form-group",children:[e.jsxs("label",{htmlFor:"username",children:[e.jsx(l,{className:"input-icon"}),"ชื่อผู้ใช้"]}),e.jsxs("div",{className:"input-wrapper",children:[e.jsx("input",{type:"text",id:"username",name:"username",placeholder:"กรอกชื่อผู้ใช้",required:!0,disabled:!r}),e.jsx("span",{className:"input-focus"})]})]}),e.jsxs("div",{className:"form-group",children:[e.jsxs("label",{htmlFor:"phone",children:[e.jsx(_,{className:"input-icon"}),"เบอร์ที่ทำงาน"]}),e.jsxs("div",{className:"input-wrapper",children:[e.jsx("input",{type:"tel",id:"phone",name:"phone",placeholder:"กรอกเบอร์ที่ทำงาน",required:!0}),e.jsx("span",{className:"input-focus"})]})]}),e.jsxs("div",{className:"form-group",children:[e.jsxs("label",{htmlFor:"role",children:[e.jsx(k,{className:"input-icon"}),"สิทธิ์การใช้งาน"]}),e.jsxs("div",{className:"select-wrapper",children:[e.jsxs("select",{id:"role",name:"role",required:!0,disabled:!r,children:[e.jsx("option",{value:"",children:"เลือกสิทธิ์การใช้งาน"}),e.jsx("option",{value:"admin",children:"Admin"}),e.jsx("option",{value:"adminhr",children:"Admin HR"}),e.jsx("option",{value:"adminit",children:"Admin IT"}),e.jsx("option",{value:"user",children:"User"})]}),e.jsx("span",{className:"select-focus"})]})]})]}),e.jsxs("div",{className:"form-actions",children:[e.jsxs(u,{to:"/admin/customer",className:"cancel-button",children:[e.jsx(x,{className:"button-icon"}),"ยกเลิก"]}),e.jsxs("button",{type:"submit",className:"submit-button",children:[e.jsx(f,{className:"button-icon"}),"บันทึก"]})]})]})]}),r&&e.jsxs("div",{className:"form-card password-form",children:[e.jsxs("div",{className:"form-header",children:[e.jsx(F,{className:"header-icon"}),e.jsx("h2",{children:"Reset รหัสผ่านผู้ใช้"})]}),e.jsxs("form",{onSubmit:v,className:"user-form",children:[e.jsxs("div",{className:"password-grid",children:[e.jsxs("div",{className:"form-group",children:[e.jsxs("label",{htmlFor:"reset_password",children:[e.jsx(I,{className:"input-icon"}),"รหัสผ่านใหม่"]}),e.jsxs("div",{className:"input-wrapper",children:[e.jsx("input",{type:"password",id:"reset_password",name:"reset_password",placeholder:"กรอกรหัสผ่านใหม่",minLength:6,required:!0}),e.jsx("span",{className:"input-focus"})]})]}),e.jsxs("div",{className:"form-group",children:[e.jsxs("label",{htmlFor:"confirm_reset_password",children:[e.jsx(T,{className:"input-icon"}),"ยืนยันรหัสผ่านใหม่"]}),e.jsxs("div",{className:"input-wrapper",children:[e.jsx("input",{type:"password",id:"confirm_reset_password",name:"confirm_reset_password",placeholder:"ยืนยันรหัสผ่านใหม่",required:!0}),e.jsx("span",{className:"input-focus"})]})]})]}),e.jsxs("div",{className:"form-actions",children:[e.jsxs(u,{to:"/admin/customer",className:"cancel-button",children:[e.jsx(x,{className:"button-icon"}),"ยกเลิก"]}),e.jsxs("button",{type:"submit",className:"submit-button",children:[e.jsx(f,{className:"button-icon"}),"บันทึก"]})]})]})]}),e.jsx("style",{children:`
        .customer-edit-container {
          min-height: 100vh;
          font-family: 'Mali', Tahoma, Geneva, Verdana, sans-serif;
          border-radius: 20px;
          padding: 30px;
          background: linear-gradient(135deg, #f5f7fa 0%, #e0e8f5 100%);
          display: flex;
          flex-direction: column;
          gap: 25px;
          align-items: center;
        }
        
        .form-card {
          width: 100%;
          max-width: 800px;
          background: white;
          border-radius: 16px;
          padding: 30px;
          box-shadow: 0 10px 30px rgba(106, 17, 203, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .form-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(106, 17, 203, 0.15);
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
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 25px;
          color: #2c3e50;
        }
        
        .header-icon {
          font-size: 28px;
          color: #6a11cb;
        }
        
        .user-form {
          display: flex;
          flex-direction: column;
          gap: 25px;
        }
        
        .form-grid, .password-grid {
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
          font-size: 18px;
        }
        
        .input-wrapper, .select-wrapper {
          position: relative;
        }
        
        input, select {
          width: 100%;
          padding: 12px 15px 12px 40px;
          border: 1px solid #ddd;
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
            padding: 20px;
          }
          
          .form-grid, .password-grid {
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
      `})]})}export{A as default};
