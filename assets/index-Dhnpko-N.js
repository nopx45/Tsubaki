import{G as c,E as g,j as e,F as p,H as m,J as x,K as n,p as h,N as s,h as o,e as f,P as w,S as r,Q as b}from"./index-Wslmr7s8.js";import{F as j}from"./index-zaV5M9Nx.js";function v(a){return c({attr:{viewBox:"0 0 1024 1024"},child:[{tag:"path",attr:{d:"M832 464h-68V240c0-70.7-57.3-128-128-128H388c-70.7 0-128 57.3-128 128v224h-68c-17.7 0-32 14.3-32 32v384c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V496c0-17.7-14.3-32-32-32zM332 240c0-30.9 25.1-56 56-56h248c30.9 0 56 25.1 56 56v224H332V240zm460 600H232V536h560v304zM484 701v53c0 4.4 3.6 8 8 8h40c4.4 0 8-3.6 8-8v-53a48.01 48.01 0 1 0-56 0z"},child:[]}]})(a)}function y(a){return c({attr:{viewBox:"0 0 1024 1024"},child:[{tag:"path",attr:{d:"M858.5 763.6a374 374 0 0 0-80.6-119.5 375.63 375.63 0 0 0-119.5-80.6c-.4-.2-.8-.3-1.2-.5C719.5 518 760 444.7 760 362c0-137-111-248-248-248S264 225 264 362c0 82.7 40.5 156 102.8 201.1-.4.2-.8.3-1.2.5-44.8 18.9-85 46-119.5 80.6a375.63 375.63 0 0 0-80.6 119.5A371.7 371.7 0 0 0 136 901.8a8 8 0 0 0 8 8.2h60c4.4 0 7.9-3.5 8-7.8 2-77.2 33-149.5 87.8-204.3 56.7-56.7 132-87.9 212.2-87.9s155.5 31.2 212.2 87.9C779 752.7 810 825 812 902.2c.1 4.4 3.6 7.8 8 7.8h60a8 8 0 0 0 8-8.2c-1-47.8-10.9-94.3-29.5-138.2zM512 534c-45.9 0-89.1-17.9-121.6-50.4S340 407.9 340 362c0-45.9 17.9-89.1 50.4-121.6S466.1 190 512 190s89.1 17.9 121.6 50.4S684 316.1 684 362c0 45.9-17.9 89.1-50.4 121.6S557.9 534 512 534z"},child:[]}]})(a)}const S=()=>{const a=g(),l=async d=>{var i;let t=await w(d);if(t.status===200)await r.fire({icon:"success",title:"เข้าสู่ระบบสำเร็จ",text:"กำลังเปลี่ยนเส้นทาง...",timer:1800,showConfirmButton:!1,timerProgressBar:!0}),localStorage.removeItem("exit_sent"),localStorage.setItem("isLoggedIn","true"),await b(),t.data.force_password_change?(a("/change-password",{replace:!0}),window.location.reload()):window.location.href=t.data.redirect_url;else if(t.status===429){const u=((i=t.data)==null?void 0:i.error)||"Too many login attempts.";r.fire({icon:"error",title:"บัญชีถูกล็อกชั่วคราว",text:`${u}`,confirmButtonText:"ตกลง"})}else r.fire({icon:"error",title:"เข้าสู่ระบบล้มเหลว",text:"ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง",confirmButtonText:"ลองใหม่อีกครั้ง"})};return e.jsxs("div",{className:"signin-container",children:[e.jsx("div",{className:"background-overlay",style:k}),e.jsx(j,{justify:"center",align:"center",className:"login-wrapper",children:e.jsx(m,{className:"login-card",style:{width:400,borderRadius:"16px",boxShadow:"0 12px 32px rgba(0, 0, 0, 0.1)",background:"rgba(255, 255, 255, 0.9)",backdropFilter:"blur(10px)"},children:e.jsxs(x,{align:"middle",justify:"center",className:"login-content",children:[e.jsx(n,{span:24,className:"text-center mb-4",children:e.jsx("img",{alt:"logo",src:h,style:{width:"60%",maxHeight:"120px",objectFit:"contain"}})}),e.jsx(n,{span:24,children:e.jsxs(s,{name:"signin",onFinish:l,autoComplete:"off",layout:"vertical",className:"signin-form",children:[e.jsx(s.Item,{label:"Username",name:"username",rules:[{required:!0,message:"Please input your username!"}],children:e.jsx(o,{size:"large",prefix:e.jsx(y,{}),placeholder:"Enter your username",className:"rounded-input"})}),e.jsx(s.Item,{label:"Password",name:"password",rules:[{required:!0,message:"Please input your password!"}],children:e.jsx(o.Password,{size:"large",prefix:e.jsx(v,{}),placeholder:"Enter your password",className:"rounded-input"})}),e.jsx(s.Item,{className:"mt-4",children:e.jsx(f,{type:"primary",htmlType:"submit",size:"large",block:!0,className:"login-button",style:{borderRadius:"8px",fontWeight:600,background:"linear-gradient(135deg, #667eea 0%, #764ba2 100%)"},children:"Log In"})}),e.jsx("div",{className:"login-footer",children:e.jsxs("div",{className:"login-links",children:[e.jsx("a",{onClick:()=>a("/signup"),className:"signup-link",children:"Create an account"}),e.jsx("span",{className:"forgot-password-text",children:"Contact IT if you forgot your password"})]})})]})})]})})}),e.jsx("style",{children:`
        .signin-container {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .background-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-size: cover;
          background-position: center;
          filter: blur(10px);
          z-index: 1;
        }
        
        .login-wrapper {
          position: relative;
          z-index: 2;
        }
        
        .login-card {
          transition: all 0.3s ease;
        }
        
        .login-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.12);
        }
        
        .login-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 16px;
        }
        
        .signup-link {
          color: #1890ff;
          font-weight: 500;
        }
        
        .forgot-password-text {
          color: #8c8c8c;
          font-size: 12px;
        }
        
        .rounded-input {
          border-radius: 8px;
        }
      `})]})},k={backgroundImage:`url(${p})`,backgroundSize:"cover",backgroundPosition:"center"};export{S as default};
