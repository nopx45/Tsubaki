import{E as A,r as n,j as e,aR as w,aF as V,aC as y,aG as o,q as B,aH as E,aA as q,aY as $}from"./index-DQMZ3AmN.js";function O(){const N=A(),[c,p]=n.useState(!1),[u,F]=n.useState(null),[m,k]=n.useState(null),[x,S]=n.useState(null),[f,C]=n.useState(null),[l,z]=n.useState(null),[d,P]=n.useState(null),[g,T]=n.useState(null),[h,I]=n.useState(null),[b,L]=n.useState(null),r=(a,t)=>{const i=document.createElement("div");i.className=`notification ${a}`,i.innerHTML=`
      <span class="notification-icon">${a==="success"?"✓":"✗"}</span>
      <span>${t}</span>
    `,document.body.appendChild(i),setTimeout(()=>{i.classList.add("show")},10),setTimeout(()=>{i.classList.remove("show"),setTimeout(()=>{document.body.removeChild(i)},300)},3e3)},R=a=>{if(a.target.files&&a.target.files[0]){const t=a.target.files[0];F(t);const i=new FileReader;i.onloadend=()=>P(i.result),i.readAsDataURL(t)}},U=a=>{if(a.target.files&&a.target.files[0]){const t=a.target.files[0];k(t);const i=new FileReader;i.onloadend=()=>T(i.result),i.readAsDataURL(t)}},G=a=>{if(a.target.files&&a.target.files[0]){const t=a.target.files[0];if(t.size>524288e3){r("error","ขนาดไฟล์วิดีโอต้องไม่เกิน 500MB");return}S(t),I(URL.createObjectURL(t))}},D=a=>{if(a.target.files&&a.target.files[0]){const t=a.target.files[0];C(t),L(URL.createObjectURL(t))}},M=a=>{if(a.target.files&&a.target.files[0]){const t=a.target.files[0];if(t.size>52428800){r("error","ขนาดไฟล์ต้องไม่เกิน 50MB");return}z(t)}},Y=async a=>{var v,j;a.preventDefault(),p(!0);const t=a.currentTarget,i=new FormData;i.append("title",t.elements.namedItem("title").value),i.append("content",t.elements.namedItem("content").value),u&&i.append("thumbnail",u),m&&i.append("image",m),x&&i.append("video",x),f&&i.append("gif",f),l&&i.append("pdf",l);try{let s=await $(i);(s==null?void 0:s.message)==="Upload successful"?(r("success","สร้างข่าวสารสำเร็จ!"),setTimeout(()=>{N("/admin/security")},2e3)):(console.error("Upload failed:",s),r("error",(s==null?void 0:s.error)||"สร้างข่าวสารไม่สำเร็จ"))}catch(s){console.error("Upload error:",s),r("error",((j=(v=s==null?void 0:s.response)==null?void 0:v.data)==null?void 0:j.error)||"เกิดข้อผิดพลาด!")}finally{p(!1)}};return e.jsxs("div",{className:"security-create-container",children:[e.jsxs("div",{className:"security-create-card",children:[e.jsxs("div",{className:"card-header",children:[e.jsx("div",{className:"header-icon",children:e.jsx(w,{})}),e.jsx("h1",{children:"เพิ่มข้อมูลข่าวสารความปลอดภัย"}),e.jsx("div",{className:"header-decoration"})]}),e.jsx("div",{className:"divider"}),e.jsxs("form",{onSubmit:Y,className:"security-form",children:[e.jsxs("div",{className:"form-group",children:[e.jsxs("label",{htmlFor:"title",children:[e.jsx(w,{className:"input-icon"}),"ชื่อหัวข้อ"]}),e.jsx("input",{type:"text",id:"title",name:"title",required:!0})]}),e.jsxs("div",{className:"form-group",children:[e.jsxs("label",{htmlFor:"content",children:[e.jsx(V,{className:"input-icon"}),"รายละเอียด"]}),e.jsx("textarea",{id:"content",name:"content",rows:4,required:!0})]}),e.jsxs("div",{className:"form-group",children:[e.jsxs("label",{htmlFor:"thumbnail",children:[e.jsx(y,{className:"input-icon"}),"รูปหน้าปก"]}),e.jsxs("div",{className:"image-upload-container",children:[e.jsxs("label",{htmlFor:"thumbnail-upload",className:"upload-button",children:[e.jsx(o,{className:"upload-icon"}),e.jsx("span",{children:"เลือกรูปหน้าปก"}),e.jsx("input",{id:"thumbnail-upload",type:"file",accept:"image/*",onChange:R,style:{display:"none"}})]}),d&&e.jsxs("div",{className:"image-preview-container",children:[e.jsx("img",{src:d||void 0,alt:"Preview",className:"image-preview"}),e.jsx("div",{className:"image-overlay",children:e.jsx("span",{children:"ภาพข่าวสาร"})})]})]})]}),e.jsxs("div",{className:"form-group",children:[e.jsxs("label",{htmlFor:"image",children:[e.jsx(y,{className:"input-icon"}),"รูปข่าวสาร"]}),e.jsxs("div",{className:"image-upload-container",children:[e.jsxs("label",{htmlFor:"image-upload",className:"upload-button",children:[e.jsx(o,{className:"upload-icon"}),e.jsx("span",{children:"เลือกไฟล์ภาพ"}),e.jsx("input",{id:"image-upload",type:"file",accept:"image/*",onChange:U,style:{display:"none"}})]}),g&&e.jsxs("div",{className:"image-preview-container",children:[e.jsx("img",{src:g,alt:"Preview",className:"image-preview"}),e.jsx("div",{className:"image-overlay",children:e.jsx("span",{children:"ภาพข่าวสาร"})})]})]}),e.jsxs("div",{className:"form-group",children:[e.jsxs("label",{htmlFor:"video",children:[e.jsx(o,{className:"input-icon"}),"วิดีโอ (.mp4 ไม่เกิน 500 MB)"]}),e.jsxs("div",{className:"image-upload-container",children:[e.jsxs("label",{htmlFor:"video-upload",className:"upload-button",children:[e.jsx(o,{className:"upload-icon"}),e.jsx("span",{children:"เลือกไฟล์วิดีโอ"}),e.jsx("input",{id:"video-upload",type:"file",accept:"video/mp4",onChange:G,style:{display:"none"}})]}),h&&e.jsx("div",{className:"video-preview-container",children:e.jsx("video",{src:h,controls:!0,className:"video-preview"})})]})]})]}),e.jsxs("div",{className:"form-group",children:[e.jsxs("label",{htmlFor:"gif",children:[e.jsx(o,{className:"input-icon"}),"ไฟล์ GIF (.gif)"]}),e.jsxs("div",{className:"image-upload-container",children:[e.jsxs("label",{htmlFor:"gif-upload",className:"upload-button",children:[e.jsx(o,{className:"upload-icon"}),e.jsx("span",{children:"เลือกไฟล์ GIF"}),e.jsx("input",{id:"gif-upload",type:"file",accept:"image/gif",onChange:D,style:{display:"none"}})]}),b&&e.jsx("div",{className:"image-preview-container",children:e.jsx("img",{src:b,alt:"GIF Preview",className:"image-preview"})})]})]}),e.jsxs("div",{className:"form-group",children:[e.jsxs("label",{htmlFor:"pdf",children:[e.jsx(o,{className:"input-icon"}),"ไฟล์ PDF (.pdf ไม่เกิน 50 MB)"]}),e.jsxs("div",{className:"image-upload-container",children:[e.jsxs("label",{htmlFor:"pdf-upload",className:"upload-button",children:[e.jsx(o,{className:"upload-icon"}),e.jsx("span",{children:"เลือกไฟล์ PDF"}),e.jsx("input",{id:"pdf-upload",type:"file",accept:"application/pdf",onChange:M,style:{display:"none"}})]}),l&&e.jsx("div",{className:"pdf-file-name",children:e.jsx("span",{children:l.name})})]})]}),e.jsxs("div",{className:"form-actions",children:[e.jsxs(B,{to:"/admin/security",className:"cancel-button",children:[e.jsx(E,{})," ยกเลิก"]}),e.jsxs("button",{type:"submit",className:"submit-button",disabled:c,children:[e.jsx(q,{className:"button-icon"}),c?"กำลังดำเนินการ...":"ยืนยัน",e.jsx("div",{className:"button-hover-effect"})]})]})]})]}),e.jsx("style",{children:`
        .security-create-container {
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
        
        .security-create-card {
          width: 100%;
          max-width: 800px;
          background: white;
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 15px 35px rgba(106, 17, 203, 0.15);
          transition: transform 0.3s ease;
          position: relative;
          z-index: 1;
          overflow: hidden;
        }
        
        .security-create-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(106, 17, 203, 0.2);
        }
        
        .security-create-card::before {
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
          color: #6a11cb;
        }
        
        .header-icon {
          background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
          color: white;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
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
        
        .security-form {
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
          font-size: 14px;
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
        
        .upload-button:hover {
          background: linear-gradient(135deg, #e4e8f0 0%, #d5dde8 100%);
        }
        
        .upload-icon {
          font-size: 18px;
        }
        
        .image-preview-container {
          position: relative;
          width: 100%;
          max-width: 400px;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }
        
        .image-preview {
          width: 100%;
          height: auto;
          display: block;
          transition: transform 0.3s ease;
        }
        
        .video-preview-container {
          position: relative;
          display: inline-block;
          width: 300px;
        }

        .video-preview { width: 300px; height: 225px; }
        
        .image-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          padding: 10px;
          background: linear-gradient(transparent, rgba(106, 17, 203, 0.7));
          color: white;
          text-align: center;
          font-weight: 500;
        }
        
        .image-preview-container:hover .image-preview {
          transform: scale(1.05);
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
          .security-create-container {
            padding: 15px;
          }
          
          .security-create-card {
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
      `})]})}export{O as default};
