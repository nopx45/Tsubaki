import{E as h,cN as u,r as n,j as e,cY as b,cV as f,aS as w,cZ as d,cT as j,k as N,c_ as k,c$ as v,cU as y,d0 as z}from"./index-DQMZ3AmN.js";const R=()=>{const i=h(),{t:s}=u(),[m,x]=n.useState([]),[o,g]=n.useState(null);n.useEffect(()=>{(async()=>{try{const a=await N();if(a){const r=JSON.parse(atob(a.split(".")[1]));g((r==null?void 0:r.role)??null)}}catch(a){console.error("Error decoding token:",a)}})()},[]),n.useEffect(()=>{(async()=>{try{const a=await k();x(a.data)}catch(a){console.error("Error fetching knowledges:",a)}})()},[o]);const l=[e.jsx(v,{style:{color:"#6a5acd"}}),e.jsx(y,{style:{color:"#ff6b6b"}}),e.jsx(z,{style:{color:"#ffd166"}})],p=()=>{const t=Math.floor(Math.random()*l.length);return l[t]};return e.jsxs("div",{className:"knowledge-container",children:[e.jsx("div",{className:"knowledge-header-right",children:(o==="admin"||o==="adminit")&&e.jsx("button",{onClick:()=>i("admin"),className:"admin-button",children:"🛠 Admin Knowledge"})}),e.jsx(b,{text:s("it_knowledge")}),e.jsx("div",{className:"articles-list",children:m.slice(0,10).map((t,a)=>{var c;const r=a===0;return e.jsxs("div",{className:"article-card",onClick:()=>i(`/it-knowledge/detail/${t.ID}`),children:[e.jsx("img",{className:"article-image",src:t.thumbnail||"/default-thumbnail.jpg",alt:t.title,style:{flex:1,maxHeight:250,backgroundSize:"cover",backgroundPosition:"center"}}),e.jsxs("div",{className:"article-content",children:[e.jsxs("h3",{children:[e.jsx("span",{className:"title-icon",children:p()}),t.title]}),e.jsxs("div",{className:"article-meta",children:[e.jsxs("span",{className:"meta-item",children:[e.jsx(f,{className:"meta-icon"})," TAT"]}),e.jsxs("span",{className:"meta-item",children:[e.jsx(w,{className:"meta-icon"}),new Date(t.created_at??"").toLocaleDateString("th-TH")]})]}),e.jsxs("p",{className:"article-excerpt",children:[(c=t.content)==null?void 0:c.substring(0,200),"..."]}),e.jsxs("button",{className:"read-more-button",children:[s("read_more")," ",e.jsx(d,{className:"arrow-icon"})]}),r&&e.jsxs("div",{className:"new-badge",children:[e.jsx(j,{className:"new-icon"})," NEW"]})]})]},t.ID)})}),e.jsxs("button",{onClick:()=>i("/it-knowledge/all"),className:"more-button",children:[s("view_all")," ",e.jsx(d,{className:"arrow"})]}),e.jsx("style",{children:`
        .knowledge-container {
          padding: 2rem;
          max-width: 90%;
          margin: 0 auto;
        }

        .knowledge-header-right {
          display: flex;
          justify-content: flex-end;
          padding-right: 20px;
        }

        .admin-button {
          margin-left: auto;
          background: linear-gradient(90deg,rgb(65, 141, 255),rgb(43, 61, 255));
          color: white;
          border: none;
          height: 20%;
          padding: 10px 20px;
          border-radius: 25px;
          font-weight: bold;
          font-size: 0.95rem;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(255, 65, 108, 0.3);
          transition: transform 0.2s ease;
        }

        .admin-button:hover {
          transform: translateY(-2px);
        }

        .articles-list {
          display: grid;
          gap: 25px;
          margin-bottom: 20px;
        }

        .article-card {
          display: flex;
          background: white;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          cursor: pointer;
          position: relative;
        }

        .article-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        }
          
        @media (max-width: 768px) {
          .article-card {
            flex-direction: column;
          }
        }

        .article-image {
          flex: 1;
          max-height: 250px;
          background-size: cover;
          background-position: center;
        }

        @media (min-width: 769px) {
          .article-image {
            min-width: 300px;
          }
        }

        .article-content {
          flex: 2;
          padding: 25px;
        }

        .article-content h3 {
          font-size: 1.3rem;
          color: #4a148c;
          margin-bottom: 15px;
          display: flex;
          align-items: center;
        }

        .title-icon {
          margin-right: 10px;
        }

        .article-meta {
          display: flex;
          gap: 15px;
          margin-bottom: 15px;
        }

        .meta-item {
          display: flex;
          align-items: center;
          color: #757575;
          font-size: 0.9rem;
        }

        .meta-icon {
          margin-right: 5px;
        }

        .article-excerpt {
          color: #757575;
          margin-bottom: 20px;
          line-height: 1.6;
        }

        .read-more-button {
          display: flex;
          align-items: center;
          padding: 8px 20px;
          background: linear-gradient(90deg, #7b1fa2, #1976d2);
          color: white;
          border: none;
          border-radius: 30px;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .read-more-button .arrow-icon {
          margin-left: 8px;
          transition: all 0.3s ease;
        }

        .read-more-button:hover .arrow-icon {
          transform: translateX(5px);
        }

        .new-badge {
          position: absolute;
          top: 15px;
          right: 15px;
          background: red;
          color: white;
          padding: 5px 10px;
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: bold;
          display: flex;
          align-items: center;
        }

        .new-icon {
          margin-right: 5px;
          font-size: 0.8rem;
        }

        .more-button {
          display: flex;
          align-items: center;
          margin: 0 auto;
          padding: 10px 25px;
          background: linear-gradient(90deg, #1976d2, #7b1fa2);
          color: white;
          border: none;
          border-radius: 30px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .more-button .arrow {
          margin-left: 8px;
          transition: all 0.3s ease;
        }

        .more-button:hover .arrow {
          transform: translateX(5px);
        }
      `})]})};export{R as default};
