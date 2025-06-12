import{E as oe,ah as re,r as n,j as e,az as X,aF as le,aC as l,aG as d,q as de,aH as ce,aI as pe,aW as ue,aX as me}from"./index-DQMZ3AmN.js";function fe(){const b=oe(),{id:u}=re(),[m,v]=n.useState(),[x,j]=n.useState(),[f,w]=n.useState(),[h,y]=n.useState(),[g,N]=n.useState(),[k,F]=n.useState(null),[z,S]=n.useState(null),[C,I]=n.useState(null),[L,P]=n.useState(null),[o,M]=n.useState(null),[T,G]=n.useState(null),[B,V]=n.useState(null),[U,R]=n.useState(null),[D,$]=n.useState(null),[c,E]=n.useState({title:"",content:""}),[H,Y]=n.useState(!1),r=(a,t)=>{const i=document.createElement("div");i.className=`notification ${a}`,i.innerHTML=`<span class="notification-icon">${a==="success"?"✓":"✗"}</span><span>${t}</span>`,document.body.appendChild(i),setTimeout(()=>i.classList.add("show"),10),setTimeout(()=>{i.classList.remove("show"),setTimeout(()=>document.body.removeChild(i),300)},3e3)},_=a=>{if(a.target.files&&a.target.files[0]){const t=a.target.files[0];F(t);const i=new FileReader;i.onloadend=()=>G(i.result),i.readAsDataURL(t)}},W=a=>{if(a.target.files&&a.target.files[0]){const t=a.target.files[0];S(t);const i=new FileReader;i.onloadend=()=>V(i.result),i.readAsDataURL(t)}},J=a=>{if(a.target.files&&a.target.files[0]){const t=a.target.files[0];if(t.size>524288e3){r("error","ขนาดไฟล์วิดีโอต้องไม่เกิน 500MB");return}I(t),R(URL.createObjectURL(t))}},K=a=>{if(a.target.files&&a.target.files[0]){const t=a.target.files[0];P(t),$(URL.createObjectURL(t))}},Q=a=>{if(a.target.files&&a.target.files[0]){const t=a.target.files[0];if(t.size>52428800){r("error","ขนาดไฟล์ต้องไม่เกิน 50MB");return}M(t)}},Z=()=>{F(null),G(null),v(void 0)},ee=()=>{S(null),V(null),j(void 0)},te=()=>{I(null),R(null),w(void 0)},ae=()=>{P(null),$(null),y(void 0)},ie=()=>{M(null),N(void 0)},ne=async a=>{try{let t=await ue(a);t.status===200?(v(t.data.thumbnail),j(t.data.Image),w(t.data.video),y(t.data.gif),N(t.data.pdf),E({title:t.data.title,content:t.data.content})):(r("error","ไม่พบข้อมูล"),setTimeout(()=>b("/admin/security"),2e3))}catch(t){console.error("Error fetching security:",t),r("error","เกิดข้อผิดพลาดในการโหลดข้อมูล")}},A=a=>{const{name:t,value:i}=a.target;E(p=>({...p,[t]:i}))},se=async a=>{var i,p,q,O;a.preventDefault(),Y(!0);const t=new FormData;t.append("title",c.title),t.append("content",c.content),k?t.append("thumbnail",k):m||t.append("removeThumbnail","true"),z?t.append("image",z):x||t.append("removeImage","true"),C?t.append("video",C):f||t.append("removeVideo","true"),L?t.append("gif",L):h||t.append("removeGif","true"),o?t.append("pdf",o):g||t.append("removePdf","true");try{let s=await me(u,t);((i=s==null?void 0:s.data)==null?void 0:i.message)==="Updated successfully"||((p=s==null?void 0:s.data)==null?void 0:p.message)==="Upload successful"?(r("success","อัปเดตข้อมูลสำเร็จ!"),setTimeout(()=>b("/admin/security"),2e3)):r("error",(s==null?void 0:s.error)||"อัปเดตข้อมูลไม่สำเร็จ")}catch(s){r("error",((O=(q=s==null?void 0:s.response)==null?void 0:q.data)==null?void 0:O.error)||"เกิดข้อผิดพลาด!")}finally{Y(!1)}};return n.useEffect(()=>{ne(u)},[u]),e.jsxs("div",{className:"security-edit-container",children:[e.jsxs("div",{className:"security-edit-card",children:[e.jsxs("div",{className:"card-header",children:[e.jsx("div",{className:"header-icon",children:e.jsx(X,{})}),e.jsx("h1",{children:"แก้ไขข้อมูลข่าวสารด้าน Security"}),e.jsx("div",{className:"header-decoration"})]}),e.jsx("div",{className:"divider"}),e.jsxs("form",{onSubmit:se,className:"security-form",children:[e.jsxs("div",{className:"form-group",children:[e.jsxs("label",{htmlFor:"title",children:[e.jsx(X,{className:"input-icon"}),"หัวข้อข่าวสาร"]}),e.jsxs("div",{className:"input-wrapper",children:[e.jsx("input",{type:"text",id:"title",name:"title",value:c.title,onChange:A,placeholder:"กรอกหัวข้อข่าวสาร IT",required:!0,maxLength:150}),e.jsx("span",{className:"input-focus"})]})]}),e.jsxs("div",{className:"form-group",children:[e.jsxs("label",{htmlFor:"content",children:[e.jsx(le,{className:"input-icon"}),"รายละเอียดข่าวสาร"]}),e.jsxs("div",{className:"input-wrapper",children:[e.jsx("textarea",{id:"content",name:"content",value:c.content,onChange:A,placeholder:"กรอกรายละเอียดข่าวสาร",rows:4,required:!0}),e.jsx("span",{className:"input-focus"})]})]}),e.jsxs("div",{className:"form-group",children:[e.jsxs("label",{htmlFor:"thumbnail",children:[e.jsx(l,{className:"input-icon"}),"รูปหน้าปก"]}),e.jsxs("div",{className:"image-upload-container",children:[e.jsxs("label",{htmlFor:"thumbnail-upload",className:"upload-button",children:[e.jsx(d,{className:"upload-icon"}),e.jsx("span",{children:"เลือกรูปหน้าปก"}),e.jsx("input",{id:"thumbnail-upload",type:"file",accept:"image/*",onChange:_,style:{display:"none"}})]}),(T||m)&&e.jsxs("div",{className:"image-preview-container",children:[e.jsx("img",{src:T||m,alt:"Thumbnail Preview",className:"image-preview"}),e.jsx("button",{type:"button",className:"remove-button",onClick:Z,title:"ลบรูปหน้าปก",children:e.jsx("svg",{className:"remove-icon",viewBox:"0 0 24 24",children:e.jsx("path",{d:"M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"})})}),e.jsx("div",{className:"image-overlay",children:e.jsx("span",{children:"ภาพหน้าปก"})})]})]})]}),e.jsxs("div",{className:"form-group",children:[e.jsxs("label",{htmlFor:"image",children:[e.jsx(l,{className:"input-icon"}),"รูปภาพข่าวสาร"]}),e.jsxs("div",{className:"image-upload-container",children:[e.jsxs("label",{htmlFor:"image-upload",className:"upload-button",children:[e.jsx(d,{className:"upload-icon"}),e.jsx("span",{children:"เลือกไฟล์ภาพ"}),e.jsx("input",{id:"image-upload",type:"file",accept:"image/*",onChange:W,style:{display:"none"}})]}),(B||x)&&e.jsxs("div",{className:"image-preview-container",children:[e.jsx("img",{src:B||x,alt:"Image Preview",className:"image-preview"}),e.jsx("button",{type:"button",className:"remove-button",onClick:ee,title:"ลบรูปภาพ",children:e.jsx("svg",{className:"remove-icon",viewBox:"0 0 24 24",children:e.jsx("path",{d:"M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"})})}),e.jsx("div",{className:"image-overlay",children:e.jsx("span",{children:"ภาพข่าวสาร"})})]})]})]}),e.jsxs("div",{className:"form-group",children:[e.jsxs("label",{htmlFor:"video",children:[e.jsx(l,{className:"input-icon"}),"วิดีโอ (mp4 ไม่เกิน 500 MB)"]}),e.jsxs("div",{className:"image-upload-container",children:[e.jsxs("label",{htmlFor:"video-upload",className:"upload-button",children:[e.jsx(d,{className:"upload-icon"}),e.jsx("span",{children:"เลือกไฟล์วิดีโอ"}),e.jsx("input",{id:"video-upload",type:"file",accept:"video/mp4",onChange:J,style:{display:"none"}})]}),(U||f)&&e.jsxs("div",{className:"video-preview-container",children:[e.jsx("video",{src:U||f,controls:!0,className:"video-preview"}),e.jsx("button",{type:"button",className:"remove-button video-remove-button",onClick:te,title:"ลบวิดีโอ",children:e.jsx("svg",{className:"remove-icon",viewBox:"0 0 24 24",children:e.jsx("path",{d:"M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"})})})]})]})]}),e.jsxs("div",{className:"form-group",children:[e.jsxs("label",{htmlFor:"gif",children:[e.jsx(l,{className:"input-icon"}),"รูปภาพ gif"]}),e.jsxs("div",{className:"image-upload-container",children:[e.jsxs("label",{htmlFor:"gif-upload",className:"upload-button",children:[e.jsx(d,{className:"upload-icon"}),e.jsx("span",{children:"เลือกไฟล์ภาพ gif"}),e.jsx("input",{id:"gif-upload",type:"file",accept:"image/gif",onChange:K,style:{display:"none"}})]}),(D||h)&&e.jsxs("div",{className:"image-preview-container",children:[e.jsx("img",{src:D||h,alt:"GIF Preview",className:"image-preview"}),e.jsx("button",{type:"button",className:"remove-button",onClick:ae,title:"ลบ GIF",children:e.jsx("svg",{className:"remove-icon",viewBox:"0 0 24 24",children:e.jsx("path",{d:"M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"})})}),e.jsx("div",{className:"image-overlay",children:e.jsx("span",{children:"GIF"})})]})]})]}),e.jsxs("div",{className:"form-group",children:[e.jsxs("label",{htmlFor:"pdf",children:[e.jsx(l,{className:"input-icon"}),"ไฟล์ pdf (ไม่เกิน 50 MB)"]}),e.jsxs("div",{className:"image-upload-container",children:[e.jsxs("label",{htmlFor:"pdf-upload",className:"upload-button",children:[e.jsx(d,{className:"upload-icon"}),e.jsx("span",{children:"เลือกไฟล์ pdf"}),e.jsx("input",{id:"pdf-upload",type:"file",accept:"application/pdf",onChange:Q,style:{display:"none"}})]}),(o||g)&&e.jsxs("div",{className:"pdf-file-container",children:[e.jsxs("div",{className:"pdf-file-content",children:[e.jsx("div",{className:"pdf-icon",children:e.jsx("svg",{viewBox:"0 0 24 24",children:e.jsx("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-1h8v1zm0-3H8v-1h8v1zm-3-5V3.5L18.5 10H13z"})})}),e.jsx("a",{href:o?URL.createObjectURL(o):g,target:"_blank",rel:"noopener noreferrer",className:"pdf-file-link",children:o?o.name:"ไฟล์ PDF เดิม"})]}),e.jsx("button",{type:"button",className:"remove-button pdf-remove-button",onClick:ie,title:"ลบ PDF",children:e.jsx("svg",{className:"remove-icon",viewBox:"0 0 24 24",children:e.jsx("path",{d:"M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"})})})]})]})]}),e.jsxs("div",{className:"form-actions",children:[e.jsxs(de,{to:"/admin/security",className:"cancel-button",children:[e.jsx(ce,{className:"button-icon"}),"ยกเลิก"]}),e.jsxs("button",{type:"submit",className:"submit-button",disabled:H,children:[e.jsx(pe,{className:"button-icon"}),H?"กำลังบันทึก...":"บันทึกการเปลี่ยนแปลง",e.jsx("div",{className:"button-hover-effect"})]})]})]})]}),e.jsx("div",{className:"floating-bubbles",children:[...Array(10)].map((a,t)=>e.jsx("div",{className:"bubble",style:{left:`${Math.random()*100}%`,animationDuration:`${10+Math.random()*20}s`,animationDelay:`${Math.random()*5}s`,width:`${10+Math.random()*20}px`,height:`${10+Math.random()*20}px`,opacity:.2+Math.random()*.5}},t))}),e.jsx("style",{children:`
  .security-edit-container {
    font-family: 'Mali', Tahoma, Geneva, Verdana, sans-serif;
    min-height: 80vh;
    border-radius: 20px;
    padding: 30px;
    background: linear-gradient(135deg, #e3f2fd, #d1e3fa);
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden;
  }

  .security-edit-card {
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

  .security-edit-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(106, 17, 203, 0.2);
  }

  .security-edit-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 5px;
    background: linear-gradient(90deg, #6a11cb, #2575fc);
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
    background: linear-gradient(to right, #6a11cb, #2575fc);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .header-icon {
    background: linear-gradient(135deg, #6a11cb, #2575fc);
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
    background: linear-gradient(90deg, #6a11cb, #2575fc);
    transition: width 0.3s ease;
  }

  input:focus ~ .input-focus, textarea:focus ~ .input-focus {
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
    background: linear-gradient(135deg, #f5f7fa, #e4e8f0);
    color: #6a11cb;
    border: 1px dashed #6a11cb;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    width: fit-content;
  }

  .upload-button:hover {
    background: linear-gradient(135deg, #e4e8f0, #d5dde8);
  }

  .upload-icon { font-size: 18px; }

  .remove-button, .video-remove-button{
    position: absolute;
    top: 10px;
    right: 10px;
    width: 28px;
    height: 28px;
    background: rgba(255, 255, 255, 0.9);
    border: none;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease;
    padding: 0;
    z-index: 2;
  }

  .pdf-remove-button {
    position: relative;
    top: auto;
    right: auto;
    margin-left: 10px;
  }

  .remove-button:hover, .video-remove-button:hover, .pdf-remove-button:hover {
    background: #ff4b2b;
    transform: scale(1.1);
  }

  .remove-icon {
    width: 18px;
    height: 18px;
    fill: #ff4b2b;
    transition: all 0.3s ease;
  }

  .remove-button:hover .remove-icon,
  .video-remove-button:hover .remove-icon,
  .pdf-remove-button:hover .remove-icon {
    fill: white;
  }

  .pdf-file-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #f5f7fa;
    border-radius: 8px;
    padding: 12px 15px;
    margin-top: 10px;
    border: 1px solid #e0e0e0;
  }

  .pdf-file-content {
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1;
  }

  .pdf-icon { width: 24px; height: 24px; }
  .pdf-icon svg { width: 100%; height: 100%; fill: #e74c3c; }

  .pdf-file-link {
    color: #2c3e50;
    text-decoration: none;
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: color 0.2s;
  }

  .pdf-file-link:hover {
    color: #6a11cb;
    text-decoration: underline;
  }

  .image-preview-container {
    position: relative;
    width: 100%;
    max-width: 300px;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }

  .image-preview { width: 100%; height: auto; display: block; transition: transform 0.3s ease; }

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

  .image-preview-container:hover .image-preview { transform: scale(1.05); }

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
    background: linear-gradient(135deg, #6a11cb, #2575fc);
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

  .button-icon { font-size: 16px; }

  .button-hover-effect {
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: all 0.6s ease;
  }

  .submit-button:hover .button-hover-effect { left: 100%; }

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

  .notification.show { transform: translateX(0); }
  .notification.success { background: linear-gradient(135deg, #6a11cb, #2575fc); }
  .notification.error { background: linear-gradient(135deg, #ff416c, #ff4b2b); }

  .notification-icon { font-weight: bold; }

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
    0% { transform: translateY(0) rotate(0deg); opacity: 0; }
    10% { opacity: 0.5; }
    100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
  }

  @media (max-width: 768px) {
    .security-edit-container { padding: 15px; }
    .security-edit-card { padding: 25px; }
    .form-actions { flex-direction: column; }
    .cancel-button, .submit-button { width: 100%; justify-content: center; }
  }
`})]})}export{fe as default};
