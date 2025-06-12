import{E as y,ah as w,r as x,j as e,aZ as g,aF as j,aC as N,b4 as k,b5 as F,q as I,aH as z,aI as E,b7 as T,b8 as A}from"./index-DQMZ3AmN.js";function L(){const d=y(),{id:c}=w(),[r,l]=x.useState([]),o=(n,t)=>{const i=document.createElement("div");i.className=`notification ${n}`,i.textContent=t,document.body.appendChild(i),setTimeout(()=>{i.classList.add("show")},10),setTimeout(()=>{i.classList.remove("show"),setTimeout(()=>{document.body.removeChild(i)},300)},3e3)},f=async n=>{try{const t=await T(n);if(t.status===200){const i=t.data.image.split(",");l(i);const s=document.getElementById("activityForm");s&&(s.elements.namedItem("title").value=t.data.title,s.elements.namedItem("content").value=t.data.content)}else o("error","ไม่พบข้อมูลกิจกรรม"),setTimeout(()=>d("/admin/activity"),2e3)}catch(t){console.error("Error fetching activity:",t),o("error","เกิดข้อผิดพลาดในการโหลดข้อมูล")}},b=n=>{if(n.target.files){const t=Array.from(n.target.files),i=[...r,...t];if(i.length>50){o("error","ไม่สามารถอัปโหลดเกิน 50 รูปได้");return}l(i)}},h=n=>{const t=[...r];t.splice(n,1),l(t)},v=async n=>{var s,p,m,u;n.preventDefault();const t=n.currentTarget,i=new FormData;i.append("title",t.elements.namedItem("title").value),i.append("content",t.elements.namedItem("content").value),r.forEach(a=>{a instanceof File?i.append("image",a):typeof a=="string"&&i.append("image_url",a)});try{const a=await A(c,i);((s=a==null?void 0:a.data)==null?void 0:s.message)==="Activity updated successfully"||((p=a==null?void 0:a.data)==null?void 0:p.message)==="Upload successful"?(o("success",(a==null?void 0:a.message)||"อัปเดตกิจกรรมสำเร็จ!"),setTimeout(()=>d("/admin/activity"),2e3)):o("error",(a==null?void 0:a.error)||"อัปเดตกิจกรรมไม่สำเร็จ")}catch(a){o("error",((u=(m=a==null?void 0:a.response)==null?void 0:m.data)==null?void 0:u.error)||"เกิดข้อผิดพลาด!")}};return x.useEffect(()=>{f(c)},[c]),e.jsxs("div",{className:"activity-edit-container",children:[e.jsxs("div",{className:"activity-edit-card",children:[e.jsx("div",{className:"header-section",children:e.jsxs("div",{className:"title-wrapper",children:[e.jsx(g,{className:"title-icon"}),e.jsx("h1",{children:"แก้ไขข้อมูลกิจกรรม"})]})}),e.jsx("div",{className:"divider"}),e.jsxs("form",{id:"activityForm",onSubmit:v,className:"activity-form",children:[e.jsxs("div",{className:"form-group",children:[e.jsxs("label",{htmlFor:"title",children:[e.jsx(g,{className:"input-icon"}),"ชื่อกิจกรรม"]}),e.jsxs("div",{className:"input-wrapper",children:[e.jsx("input",{type:"text",id:"title",name:"title",placeholder:"กรอกชื่อกิจกรรม",required:!0}),e.jsx("span",{className:"input-focus"})]})]}),e.jsxs("div",{className:"form-group",children:[e.jsxs("label",{htmlFor:"content",children:[e.jsx(j,{className:"input-icon"}),"รายละเอียดกิจกรรม"]}),e.jsxs("div",{className:"input-wrapper",children:[e.jsx("textarea",{id:"content",name:"content",placeholder:"กรอกรายละเอียดกิจกรรม",rows:4,required:!0}),e.jsx("span",{className:"input-focus"})]})]}),e.jsxs("div",{className:"form-group",children:[e.jsxs("label",{htmlFor:"image",children:[e.jsx(N,{className:"input-icon"}),"รูปภาพกิจกรรม (สูงสุด 50 รูป)"]}),e.jsxs("div",{className:"image-upload-container",children:[e.jsxs("label",{htmlFor:"image-upload",className:"upload-button",children:[e.jsx(k,{className:"upload-icon"}),e.jsx("span",{children:"เลือกไฟล์ภาพ"}),e.jsx("input",{id:"image-upload",type:"file",accept:"image/*",multiple:!0,onChange:b,style:{display:"none"}})]}),r.length>0&&e.jsx("div",{className:"image-preview-container",children:r.map((n,t)=>e.jsxs("div",{className:"image-preview-item",children:[e.jsx("img",{src:n instanceof File?URL.createObjectURL(n):n,alt:`Image ${t}`,className:"image-preview"}),e.jsxs("div",{className:"image-overlay",children:[e.jsx("button",{type:"button",onClick:()=>h(t),className:"delete-button","aria-label":"Remove image",children:e.jsx(F,{})}),e.jsxs("span",{className:"image-number",children:["Image ",t+1]})]})]},t))})]})]}),e.jsxs("div",{className:"form-actions",children:[e.jsxs(I,{to:"/admin/activity",className:"cancel-button",children:[e.jsx(z,{className:"button-icon"}),"ยกเลิก"]}),e.jsxs("button",{type:"submit",className:"submit-button",children:[e.jsx(E,{className:"button-icon"}),"บันทึกการเปลี่ยนแปลง"]})]})]})]}),e.jsx("style",{children:`
        .activity-edit-container {
          font-family: 'Mali', Tahoma, Geneva, Verdana, sans-serif;
          min-height: 80vh;
          border-radius: 20px;
          padding: 30px;
          background: linear-gradient(135deg, #f0f4f8 0%, #e0e8f5 100%);
          display: flex;
          justify-content: center;
          align-items: top;
        }
        
        .activity-edit-card {
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
        
        .activity-edit-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(106, 17, 203, 0.2);
        }
        
        .activity-edit-card::before {
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
          background: linear-gradient(to right, #6a11cb 0%, #2575fc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
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
        
        .activity-form {
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
        
        input, textarea {
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
        
        input:focus, textarea:focus {
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
        textarea:focus ~ .input-focus {
          width: 100%;
        }
        
        .image-upload-container {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        
        .upload-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
          color: #6a11cb;
          border: 1px dashed #6a11cb;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          width: fit-content;
        }
        
        .image-preview-container {
          display: grid;
          grid-template-columns: repeat(4, 1fr);  /* แสดง 4 ภาพต่อแถว */
          gap: 15px;  /* ระยะห่างระหว่างภาพ */
          margin-top: 15px;
        }
        .upload-button:hover {
          background: linear-gradient(135deg, #e4e8f0 0%, #d5dde8 100%);
        }
        
        .upload-icon {
          font-size: 18px;
        }
        
        /* Each individual image item */
        .image-preview-item {
          position: relative;
          width: 100%;
          aspect-ratio: 1/1; /* Square aspect ratio */
          overflow: hidden;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        /* The actual preview image */
        .image-preview {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        /* Overlay that appears on hover */
        .image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.4), transparent);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 8px;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .image-preview-item:hover .image-overlay {
          opacity: 1;
        }

        /* Delete button styles */
        .delete-button {
          align-self: flex-end;
          background: #ff4444;
          border: none;
          border-radius: 50%;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s;
        }

        .delete-button:hover {
          background: #cc0000;
        }

        .delete-button svg {
          width: 16px;
          height: 16px;
        }

        /* Image number text */
        .image-number {
          color: white;
          font-size: 14px;
          font-weight: 500;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
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
        
        .submit-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(106, 17, 203, 0.4);
          background: linear-gradient(135deg, #5a0db5 0%, #1565d8 100%);
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
          .activity-edit-card {
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
      `})]})}export{L as default};
