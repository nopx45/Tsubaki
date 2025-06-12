import{E as u,s as p,j as e,F as g,H as x,J as d,K as s,p as h,N as a,h as r,e as j,ag as b}from"./index-Wslmr7s8.js";import{F as f}from"./index-zaV5M9Nx.js";const v=()=>{const i=u(),[l,c]=p.useMessage(),m=async t=>{let n=await b(t);n.status===201?(l.open({type:"success",content:n.data.message}),setTimeout(function(){i("/signin")},2e3)):l.open({type:"error",content:n.data.error})};return e.jsxs("div",{className:"signup-container",children:[c,e.jsx("div",{className:"background-overlay",style:w}),e.jsx(f,{justify:"center",align:"center",className:"signup-wrapper",children:e.jsx(x,{className:"signup-card",style:{width:500,borderRadius:"16px",boxShadow:"0 12px 32px rgba(0, 0, 0, 0.1)",background:"rgba(255, 255, 255, 0.9)",backdropFilter:"blur(10px)"},children:e.jsxs(d,{align:"middle",justify:"center",className:"signup-content",children:[e.jsxs(s,{span:24,className:"text-center mb-4",children:[e.jsx("img",{alt:"logo",src:h,style:{width:"60%",maxHeight:"120px",objectFit:"contain"}}),e.jsx("h2",{className:"signup-title",children:"Create Your Account"})]}),e.jsx(s,{span:24,children:e.jsx(a,{name:"register",layout:"vertical",onFinish:m,autoComplete:"off",className:"signup-form",children:e.jsxs(d,{gutter:[16,16],children:[e.jsx(s,{xs:24,sm:24,md:12,lg:12,children:e.jsx(a.Item,{label:"First Name",name:"first_name",rules:[{required:!0,message:"Please enter your first name"}],children:e.jsx(r,{size:"large",placeholder:"Enter first name",className:"rounded-input"})})}),e.jsx(s,{xs:24,sm:24,md:12,lg:12,children:e.jsx(a.Item,{label:"Last Name",name:"last_name",rules:[{required:!0,message:"Please enter your last name"}],children:e.jsx(r,{size:"large",placeholder:"Enter last name",className:"rounded-input"})})}),e.jsx(s,{span:24,children:e.jsx(a.Item,{label:"Username",name:"username",rules:[{required:!0,message:"Please enter a username"}],children:e.jsx(r,{size:"large",placeholder:"Choose a username",className:"rounded-input"})})}),e.jsx(s,{span:24,children:e.jsx(a.Item,{label:"Email",name:"email",rules:[{type:"email",message:"Invalid email format"},{required:!0,message:"Please enter your email"}],children:e.jsx(r,{size:"large",placeholder:"Enter your email",className:"rounded-input"})})}),e.jsx(s,{span:24,children:e.jsx(a.Item,{label:"TAT telephone",name:"phone",rules:[{required:!0,message:"Please enter your TAT telephone"},{max:3,message:"TAT telephone must be at most 3 characters"}],children:e.jsx(r,{size:"large",placeholder:"Enter TAT telephone",className:"rounded-input"})})}),e.jsx(s,{span:24,children:e.jsx(a.Item,{label:"Password",name:"password",rules:[{required:!0,message:"Please enter a password"},{min:6,message:"Password must be at least 6 characters"}],hasFeedback:!0,children:e.jsx(r.Password,{size:"large",placeholder:"Create a password",className:"rounded-input"})})}),e.jsx(s,{span:24,children:e.jsx(a.Item,{label:"Confirm Password",name:"confirm_password",dependencies:["password"],rules:[{required:!0,message:"Please confirm your password"},({getFieldValue:t})=>({validator(n,o){return!o||t("password")===o?Promise.resolve():Promise.reject(new Error("Passwords do not match"))}})],hasFeedback:!0,children:e.jsx(r.Password,{size:"large",placeholder:"Confirm password",className:"rounded-input"})})}),e.jsxs(s,{span:24,children:[e.jsx(a.Item,{children:e.jsx(j,{type:"primary",htmlType:"submit",size:"large",block:!0,className:"signup-button",style:{borderRadius:"8px",fontWeight:600,background:"linear-gradient(135deg, #667eea 0%, #764ba2 100%)"},children:"Sign Up"})}),e.jsxs("div",{className:"signup-footer text-center",children:["Already have an account?",e.jsx("a",{onClick:()=>i("/signin"),className:"signin-link ml-2",children:"Sign in now"})]})]})]})})})]})})}),e.jsx("style",{children:`
        .signup-container {
          min-height: 100vh;
          padding: 2rem 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: auto;
          background-color: #f0f2f5;
        }

        .background-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-size: cover;
          background-position: 80% 30%;
          background-repeat: no-repeat;
          filter: blur(10px) brightness(0.9);
          z-index: 0;
        }

        .signup-wrapper {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 600px;
        }

        .signup-card {
          transition: all 0.3s ease;
        }

        .signup-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.12);
        }

        .signup-title {
          text-align: center;
          margin-top: 16px;
          color: #333;
          font-weight: 600;
        }

        .signup-footer {
          margin-top: 16px;
          text-align: center;
        }

        .signin-link {
          color: #1890ff;
          font-weight: 500;
          margin-left: 4px;
          cursor: pointer;
        }

        .signin-link:hover {
          text-decoration: underline;
        }

        .rounded-input {
          border-radius: 8px;
        }
      `})]})},w={backgroundImage:`url(${g})`,backgroundSize:"cover",backgroundPosition:"80% 30%"};export{v as default};
