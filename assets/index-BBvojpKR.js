import{E as v,ah as j,r as d,j as e,a$ as x,aG as f,q as y,aH as N,aI as k,bi as F,bj as z}from"./index-Wslmr7s8.js";function T(){const l=v(),{id:s}=j(),[c,m]=d.useState(),[r,g]=d.useState(null),i=(t,n)=>{const a=document.createElement("div");a.className=`notification ${t}`,a.textContent=n,document.body.appendChild(a),setTimeout(()=>a.classList.add("show"),10),setTimeout(()=>{a.classList.remove("show"),setTimeout(()=>document.body.removeChild(a),300)},3e3)},b=async t=>{try{const n=await F(t);if(n.status===200){m(n.data.file_name);const a=document.getElementById("regulationForm");a&&(a.elements.namedItem("name").value=n.data.name)}else i("error","ไม่พบข้อมูลกฎระเบียบ"),setTimeout(()=>l("/admin/regulation"),2e3)}catch(n){console.error("Error fetching regulation:",n),i("error","เกิดข้อผิดพลาดในการโหลดข้อมูล")}},h=t=>{t.target.files&&t.target.files[0]&&g(t.target.files[0])},w=async t=>{var p,u;t.preventDefault();const n=t.currentTarget,a=new FormData;a.append("name",n.elements.namedItem("name").value),r&&a.append("file",r);try{const o=await z(s,a);o.status===200?(i("success",o.data.message||"อัปเดตระเบียบสำเร็จ!"),setTimeout(()=>l("/admin/regulation"),2e3)):i("error",o.data.error||"อัปเดตไม่สำเร็จ")}catch(o){console.error("Upload error:",o),i("error",((u=(p=o==null?void 0:o.response)==null?void 0:p.data)==null?void 0:u.error)||"เกิดข้อผิดพลาด!")}};return d.useEffect(()=>{b(s)},[s]),e.jsxs("div",{className:"announcement-edit-container",children:[e.jsxs("div",{className:"announcement-edit-card",children:[e.jsxs("div",{className:"card-header",children:[e.jsx("div",{className:"header-icon",children:e.jsx(x,{})}),e.jsx("h1",{children:"แก้ไขข้อมูลกฎระเบียบ"}),e.jsx("div",{className:"header-decoration"})]}),e.jsx("div",{className:"divider"}),e.jsxs("form",{id:"regulationForm",onSubmit:w,className:"announcement-form",children:[e.jsxs("div",{className:"form-group",children:[e.jsxs("label",{htmlFor:"name",children:[e.jsx(x,{className:"input-icon"})," ชื่อไฟล์"]}),e.jsxs("div",{className:"input-wrapper",children:[e.jsx("input",{type:"text",id:"name",name:"name",placeholder:"กรอกชื่อไฟล์",required:!0}),e.jsx("span",{className:"input-focus"})]})]}),e.jsxs("div",{className:"form-group",children:[e.jsxs("label",{htmlFor:"file",children:[e.jsx(f,{className:"input-icon"})," อัปโหลดไฟล์ใหม่ (ถ้ามี)"]}),e.jsxs("div",{className:"upload-wrapper",children:[e.jsxs("label",{htmlFor:"file-upload",className:"upload-button",children:[e.jsx(f,{className:"upload-icon"}),e.jsx("span",{children:"เลือกไฟล์ PDF"}),e.jsx("input",{id:"file-upload",type:"file",accept:".pdf",onChange:h,style:{display:"none"}})]}),r?e.jsxs("div",{className:"upload-filename",children:["ไฟล์ที่เลือก: ",r.name]}):c?e.jsxs("div",{className:"upload-filename",children:["ไฟล์ปัจจุบัน: ",c]}):null]})]}),e.jsxs("div",{className:"form-actions",children:[e.jsxs(y,{to:"/admin/regulation",className:"cancel-button",children:[e.jsx(N,{className:"button-icon"})," ยกเลิก"]}),e.jsxs("button",{type:"submit",className:"submit-button",children:[e.jsx("span",{className:"button-hover-effect"}),e.jsx(k,{className:"button-icon"})," บันทึกการเปลี่ยนแปลง"]})]})]})]}),e.jsx("div",{className:"floating-bubbles",children:[...Array(10)].map((t,n)=>e.jsx("div",{className:"bubble",style:{width:`${20+Math.random()*30}px`,height:`${20+Math.random()*30}px`,left:`${Math.random()*100}%`,animationDuration:`${5+Math.random()*10}s`}},n))}),e.jsx("style",{children:`
        .announcement-edit-container {
          font-family: 'Mali', Tahoma, Geneva, Verdana, sans-serif;
          min-height: 80vh;
          border-radius: 20px;
          padding: 30px;
          background: linear-gradient(135deg, #e3f2fd 0%, #d1e3fa 100%);
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          overflow: hidden;
        }
        
        .announcement-edit-card {
          width: 100%;
          max-width: 800px;
          background: white;
          border-radius: 16px;
          padding: 40px;
          box-shadow: 0 15px 35px rgba(106, 17, 203, 0.15);
          transition: transform 0.3s ease;
          position: relative;
          z-index: 1;
          overflow: hidden;
        }
        
        .announcement-edit-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(106, 17, 203, 0.2);
        }
        
        .announcement-edit-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 5px;
          background: linear-gradient(90deg, #6a11cb 0%, #2575fc 100%);
        }
        
        .card-header {
          margin-bottom: 25px;
          text-align: center;
          position: relative;
        }
        
        .card-header h1 {
          margin: 15px 0 5px;
          font-size: 28px;
          font-weight: 700;
          background: linear-gradient(to right, #6a11cb 0%, #2575fc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .header-icon {
          background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
          color: white;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          box-shadow: 0 4px 12px rgba(106, 17, 203, 0.3);
        }
        
        .header-decoration {
          position: absolute;
          top: -20px;
          right: -20px;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: rgba(126, 87, 194, 0.1);
          z-index: -1;
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
          padding-right: 40px;
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
        
        .select-arrow {
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          color: #6a11cb;
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
          position: relative;
          overflow: hidden;
        }
        
        .submit-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(106, 17, 203, 0.4);
        }
        
        .submit-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .button-icon {
          font-size: 16px;
        }
        
        .button-hover-effect {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: all 0.6s ease;
        }
        
        .submit-button:hover .button-hover-effect {
          left: 100%;
        }
        
        .notification {
          position: fixed;
          top: 20px;
          right: 20px;
          padding: 15px 25px;
          border-radius: 8px;
          color: white;
          display: flex;
          align-items: center;
          gap: 10px;
          z-index: 1000;
          transform: translateX(120%);
          transition: transform 0.3s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        .notification.show {
          transform: translateX(0);
        }
        
        .notification.success {
          background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
        }
        
        .notification.error {
          background: linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%);
        }
        
        .notification-icon {
          font-weight: bold;
        }
        
        .floating-bubbles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 0;
        }
        
        .bubble {
          position: absolute;
          bottom: -100px;
          background: linear-gradient(135deg, rgba(106, 17, 203, 0.2), rgba(37, 117, 252, 0.2));
          border-radius: 50%;
          animation: float-up linear infinite;
        }
        
        @keyframes float-up {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.5;
          }
          100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
          }
        }
        
        @media (max-width: 768px) {
          .announcement-edit-container {
            padding: 15px;
          }
          
          .announcement-edit-card {
            padding: 25px;
          }
          
          .card-header h1 {
            font-size: 24px;
          }
          
          .form-actions {
            flex-direction: column;
          }
          
          .cancel-button, .submit-button {
            width: 100%;
            justify-content: center;
          }
        }
          .upload-wrapper {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }

          .upload-button {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            padding: 12px 20px;
            background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
            color: #6a11cb;
            border: 2px dashed #6a11cb;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            width: fit-content;
          }

          .upload-button:hover {
            background: linear-gradient(135deg, #e4e8f0 0%, #d5dde8 100%);
            transform: translateY(-1px);
            box-shadow: 0 4px 10px rgba(106, 17, 203, 0.1);
          }

          .upload-icon {
            font-size: 18px;
          }

          .upload-filename {
            font-size: 14px;
            color: #444;
            background-color: #f9f9f9;
            padding: 10px 15px;
            border-radius: 6px;
            border: 1px solid #e0e0e0;
          }
      `})]})}export{T as default};
