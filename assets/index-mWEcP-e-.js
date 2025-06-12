import{E as A,r as s,j as e,az as j,aF as V,aC as N,aG as o,q as Y,aH as B,aA as E,S as q,aN as H}from"./index-DQMZ3AmN.js";function X(){const y=A(),[p,F]=s.useState(null),[u,d]=s.useState(!1),[m,k]=s.useState(null),[x,z]=s.useState(null),[g,C]=s.useState(null),[l,S]=s.useState(null),[c,T]=s.useState(null),[h,L]=s.useState(null),[f,M]=s.useState(null),[b,P]=s.useState(null),r=(a,t)=>{const i=document.createElement("div");i.className=`notification ${a}`,i.innerHTML=`
      <span class="notification-icon">${a==="success"?"✓":"✗"}</span>
      <span>${t}</span>
    `,document.body.appendChild(i),setTimeout(()=>{i.classList.add("show")},10),setTimeout(()=>{i.classList.remove("show"),setTimeout(()=>{document.body.removeChild(i)},300)},3e3)},I=a=>{if(a.target.files&&a.target.files[0]){const t=a.target.files[0];k(t);const i=new FileReader;i.onloadend=()=>{T(i.result)},i.readAsDataURL(t)}},U=a=>{if(a.target.files&&a.target.files[0]){const t=a.target.files[0];F(t);const i=new FileReader;i.onloadend=()=>{L(i.result)},i.readAsDataURL(t)}},D=a=>{if(a.target.files&&a.target.files[0]){const t=a.target.files[0];if(t.size>524288e3){r("error","ขนาดไฟล์วิดีโอต้องไม่เกิน 500MB");return}z(t),M(URL.createObjectURL(t))}},G=a=>{if(a.target.files&&a.target.files[0]){const t=a.target.files[0];C(t),P(URL.createObjectURL(t))}},R=a=>{if(a.target.files&&a.target.files[0]){const t=a.target.files[0];if(t.size>52428800){r("error","ขนาดไฟล์ต้องไม่เกิน 50MB");return}S(t)}},$=async a=>{var v,w;a.preventDefault(),d(!0);const t=a.currentTarget,i=new FormData;if(i.append("title",t.elements.namedItem("title").value),i.append("content",t.elements.namedItem("content").value),m)i.append("thumbnail",m);else{await q.fire({icon:"warning",title:"กรุณาเลือกรูปหน้าปก!!",text:"คุณต้องเลือกภาพหน้าปก ก่อนทำการอัปโหลด"}),d(!1);return}p&&i.append("image",p),x&&i.append("video",x),g&&i.append("gif",g),l&&i.append("pdf",l);try{let n=await H(i);(n==null?void 0:n.message)==="Upload successful"?(r("success","สร้างรายการสำเร็จ!"),setTimeout(()=>{y("/admin/training")},2e3)):(console.error("Upload failed:",n),r("error",(n==null?void 0:n.error)||"สร้างรายการไม่สำเร็จ"))}catch(n){console.error("Upload error:",n),r("error",((w=(v=n==null?void 0:n.response)==null?void 0:v.data)==null?void 0:w.error)||"เกิดข้อผิดพลาด!")}finally{d(!1)}};return e.jsxs("div",{className:"it-knowledge-create-container",children:[e.jsxs("div",{className:"it-knowledge-create-card",children:[e.jsxs("div",{className:"card-header",children:[e.jsx("div",{className:"header-icon",children:e.jsx(j,{})}),e.jsx("h1",{children:"เพิ่มข้อมูลรายการอบรม"}),e.jsx("div",{className:"header-decoration"})]}),e.jsx("div",{className:"divider"}),e.jsxs("form",{onSubmit:$,className:"it-knowledge-form",children:[e.jsxs("div",{className:"form-group",children:[e.jsxs("label",{htmlFor:"title",children:[e.jsx(j,{className:"input-icon"}),"ชื่อหัวข้อ"]}),e.jsxs("div",{className:"input-wrapper",children:[e.jsx("input",{type:"text",id:"title",name:"title",placeholder:"กรอกหัวข้อ",required:!0,maxLength:55}),e.jsx("span",{className:"input-focus"})]})]}),e.jsxs("div",{className:"form-group",children:[e.jsxs("label",{htmlFor:"content",children:[e.jsx(V,{className:"input-icon"}),"รายละเอียด"]}),e.jsxs("div",{className:"input-wrapper",children:[e.jsx("textarea",{id:"content",name:"content",placeholder:"กรอกรายละเอียด",rows:4,required:!0}),e.jsx("span",{className:"input-focus"})]})]}),e.jsxs("div",{className:"form-group",children:[e.jsxs("label",{htmlFor:"thumbnail",children:[e.jsx(N,{className:"input-icon"}),"รูปหน้าปก"]}),e.jsxs("div",{className:"image-upload-container",children:[e.jsxs("label",{htmlFor:"thumbnail-upload",className:"upload-button",children:[e.jsx(o,{className:"upload-icon"}),e.jsx("span",{children:"เลือกรูปหน้าปก"}),e.jsx("input",{id:"thumbnail-upload",type:"file",accept:"image/*",onChange:I,style:{display:"none"}})]}),c&&e.jsxs("div",{className:"image-preview-container",children:[e.jsx("img",{src:c||void 0,alt:"Preview",className:"image-preview"}),e.jsx("div",{className:"image-overlay",children:e.jsx("span",{children:"ภาพ"})})]})]})]}),e.jsxs("div",{className:"form-group",children:[e.jsxs("label",{htmlFor:"image",children:[e.jsx(N,{className:"input-icon"}),"รูป"]}),e.jsxs("div",{className:"image-upload-container",children:[e.jsxs("label",{htmlFor:"image-upload",className:"upload-button",children:[e.jsx(o,{className:"upload-icon"}),e.jsx("span",{children:"เลือกไฟล์ภาพ"}),e.jsx("input",{id:"image-upload",type:"file",accept:"image/*",onChange:U,style:{display:"none"}})]}),h&&e.jsxs("div",{className:"image-preview-container",children:[e.jsx("img",{src:h,alt:"Preview",className:"image-preview"}),e.jsx("div",{className:"image-overlay",children:e.jsx("span",{children:"ภาพ"})})]})]}),e.jsxs("div",{className:"form-group",children:[e.jsxs("label",{htmlFor:"video",children:[e.jsx(o,{className:"input-icon"}),"วิดีโอ (.mp4 ไม่เกิน 500MB)"]}),e.jsxs("div",{className:"image-upload-container",children:[e.jsxs("label",{htmlFor:"video-upload",className:"upload-button",children:[e.jsx(o,{className:"upload-icon"}),e.jsx("span",{children:"เลือกไฟล์วิดีโอ"}),e.jsx("input",{id:"video-upload",type:"file",accept:"video/mp4",onChange:D,style:{display:"none"}})]}),f&&e.jsx("div",{className:"video-preview-container",children:e.jsx("video",{src:f,controls:!0,className:"video-preview"})})]})]}),e.jsxs("div",{className:"form-group",children:[e.jsxs("label",{htmlFor:"gif",children:[e.jsx(o,{className:"input-icon"}),"ไฟล์ GIF (.gif)"]}),e.jsxs("div",{className:"image-upload-container",children:[e.jsxs("label",{htmlFor:"gif-upload",className:"upload-button",children:[e.jsx(o,{className:"upload-icon"}),e.jsx("span",{children:"เลือกไฟล์ GIF"}),e.jsx("input",{id:"gif-upload",type:"file",accept:"image/gif",onChange:G,style:{display:"none"}})]}),b&&e.jsx("div",{className:"image-preview-container",children:e.jsx("img",{src:b,alt:"GIF Preview",className:"image-preview"})})]})]}),e.jsxs("div",{className:"form-group",children:[e.jsxs("label",{htmlFor:"pdf",children:[e.jsx(o,{className:"input-icon"}),"ไฟล์ PDF (ไม่เกิน 50 MB)"]}),e.jsxs("div",{className:"image-upload-container",children:[e.jsxs("label",{htmlFor:"pdf-upload",className:"upload-button",children:[e.jsx(o,{className:"upload-icon"}),e.jsx("span",{children:"เลือกไฟล์ PDF"}),e.jsx("input",{id:"pdf-upload",type:"file",accept:"application/pdf",onChange:R,style:{display:"none"}})]}),l&&e.jsx("div",{className:"pdf-file-name",children:e.jsx("span",{children:l.name})})]})]})]}),e.jsxs("div",{className:"form-actions",children:[e.jsxs(Y,{to:"/admin/training",className:"cancel-button",children:[e.jsx(B,{className:"button-icon"}),"ยกเลิก"]}),e.jsxs("button",{type:"submit",className:"submit-button",disabled:u,children:[e.jsx(E,{className:"button-icon"}),u?"กำลังดำเนินการ...":"ยืนยัน",e.jsx("div",{className:"button-hover-effect"})]})]})]})]}),e.jsx("div",{className:"floating-bubbles",children:[...Array(10)].map((a,t)=>e.jsx("div",{className:"bubble",style:{left:`${Math.random()*100}%`,animationDuration:`${10+Math.random()*20}s`,animationDelay:`${Math.random()*5}s`,width:`${10+Math.random()*20}px`,height:`${10+Math.random()*20}px`,opacity:.2+Math.random()*.5}},t))}),e.jsx("style",{children:`
        .it-knowledge-create-container {
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
        
        .it-knowledge-create-card {
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
        
        .it-knowledge-create-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(106, 17, 203, 0.2);
        }
        
        .it-knowledge-create-card::before {
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
        
        .it-knowledge-form {
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

        .video-preview-container {
          position: relative;
          width: 100%;
          max-width: 400px;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .video-preview {
          width: 100%;
          height: auto;
          display: block;
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
          .it-knowledge-create-container {
            padding: 15px;
          }
          
          .it-knowledge-create-card {
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
      `})]})}export{X as default};
